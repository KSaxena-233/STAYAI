import { NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

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

    let message = ''
    let systemPrompt = SYSTEM_PROMPT

    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await req.json()
      message = body.message
      if (body.systemPrompt) systemPrompt = body.systemPrompt
    } else {
      // Only support JSON in production
      return NextResponse.json(
        { error: 'Only JSON requests are supported in production' },
        { status: 400 }
      )
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
      message: aiResponse
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
    // For Netlify/production, persistent server-side storage is not available
    // Return an empty history array or a static message
    return NextResponse.json({ history: [] })
  } catch (error) {
    console.error('Chat history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    )
  }
} 