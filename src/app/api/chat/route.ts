import { NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// Create uploads directory if it doesn't exist
const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')
if (!existsSync(UPLOADS_DIR)) {
  await mkdir(UPLOADS_DIR, { recursive: true })
}

// Supported file types
const SUPPORTED_FILE_TYPES = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-excel': 'xls',
  'application/msword': 'doc',
  'text/plain': 'txt'
}

const SYSTEM_PROMPT = `You are STAY, an AI companion designed to support teens with mental health challenges and prevent suicide.
Your responses should be:
1. Empathetic and supportive
2. Non-judgmental and understanding
3. Focused on active listening and validation
4. Encouraging of professional help when needed
5. Age-appropriate and relatable to Gen Z
6. Calming and reassuring
7. Based on evidence-based psychological and neuroscience principles to maximize helpfulness and support

IMPORTANT: Please keep your responses brief, clear, and to the point, while still being meaningful and supportive. Do not use any Markdown or formatting (no asterisks, no bold, no lists). Give only 2 or 3 key suggestions or ideas, not a long list. Avoid unnecessary detail or repetition.

Never introduce yourself, never say you are STAY or an AI, never ask for scenarios, and never explain your own role. Always answer the user's question directly and concisely.

If the user asks for examples or elaboration, provide 1 or 2 short, real-life examples directly related to their question, without any introduction or meta-commentary.

Use psychological and neuroscience principles to maximize the helpfulness, support, and accuracy of your responses.

Remember to:
- Never give medical advice
- Always encourage seeking professional help for serious concerns
- Maintain appropriate boundaries
- Use a warm, conversational tone
- Validate feelings and experiences
- Provide resources when relevant`

export async function POST(req: Request) {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured')
    }

    // Accept both JSON and formData
    let message = ''
    let file = null
    let userId = ''
    let systemPrompt = SYSTEM_PROMPT
    let fileUrl = null

    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await req.json()
      message = body.message
      fileUrl = body.fileUrl
      userId = body.userId || ''
      if (body.systemPrompt) systemPrompt = body.systemPrompt
    } else {
      const formData = await req.formData()
      message = formData.get('message') as string
      file = formData.get('file') as File | null
      userId = formData.get('userId') as string
      if (formData.get('systemPrompt')) systemPrompt = formData.get('systemPrompt') as string
      if (file) {
        // Validate file type
        if (!SUPPORTED_FILE_TYPES[file.type as keyof typeof SUPPORTED_FILE_TYPES]) {
          return NextResponse.json(
            { error: 'Unsupported file type' },
            { status: 400 }
          )
        }
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileExtension = SUPPORTED_FILE_TYPES[file.type as keyof typeof SUPPORTED_FILE_TYPES]
        const fileName = `${Date.now()}-${file.name}`
        const filePath = join(UPLOADS_DIR, fileName)
        await writeFile(filePath, buffer)
        fileUrl = `/uploads/${fileName}`
        // Add file context to the message
        message += `\n[File attached: ${file.name} (${fileExtension.toUpperCase()})]`
      }
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: message }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Gemini API')
    }

    const data = await response.json()
    const aiResponse = data.candidates[0].content.parts[0].text

    return NextResponse.json({ 
      message: aiResponse,
      fileUrl
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process your message' },
      { status: 500 }
    )
  }
}

// Get chat history
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const days = parseInt(searchParams.get('days') || '30')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const chatHistoryPath = join(process.cwd(), 'data', 'chat-history.json')
    let chatHistoryData = []
    try {
      const existingData = await readFile(chatHistoryPath, 'utf-8')
      chatHistoryData = JSON.parse(existingData)
    } catch (error) {
      // File doesn't exist or is invalid, return empty array
    }

    // Filter by user ID and date range
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const filteredHistory = chatHistoryData.filter((chat: any) => {
      return chat.userId === userId && new Date(chat.timestamp) >= cutoffDate
    })

    return NextResponse.json({ history: filteredHistory })
  } catch (error) {
    console.error('Chat history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    )
  }
} 