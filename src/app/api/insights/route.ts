import { NextResponse } from 'next/server'

const categories = [
  'stress', 'gratitude', 'relationships', 'achievement', 'self-care', 'challenge', 'growth', 'other'
];

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyDcfF_sos6xfCfgiIyokWGEVOqYTfsgLgk';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

function categorize(content: string) {
  const text = content.toLowerCase();
  if (text.includes('stress') || text.includes('cry') || text.includes('hard')) return 'stress';
  if (text.includes('grateful') || text.includes('gratitude') || text.includes('thank')) return 'gratitude';
  if (text.includes('friend') || text.includes('family') || text.includes('relationship')) return 'relationships';
  if (text.includes('achieve') || text.includes('win') || text.includes('victory')) return 'achievement';
  if (text.includes('self-care') || text.includes('rest') || text.includes('relax')) return 'self-care';
  if (text.includes('challenge') || text.includes('difficult')) return 'challenge';
  if (text.includes('grow') || text.includes('learn')) return 'growth';
  return 'other';
}

function getMoodGraphInsight(entries: any[], moods: any[]) {
  if (!entries.length) return "I don't see any mood data yet, but I'm here whenever you want to share!";
  const moodCounts = moods.map(mood => ({
    label: mood.label,
    value: mood.value,
    count: entries.filter(e => e.mood === mood.value).length
  }));
  const mostCommon = moodCounts.reduce((a, b) => (a.count > b.count ? a : b));
  const leastCommon = moodCounts.reduce((a, b) => (a.count < b.count ? a : b));
  const avgMood = (entries.reduce((sum, e) => sum + (e.mood || 0), 0) / entries.length).toFixed(2);
  const bestDay = entries.reduce((a, b) => (a.mood > b.mood ? a : b));
  const worstDay = entries.reduce((a, b) => (a.mood < b.mood ? a : b));
  return `You've most often felt '${mostCommon.label}' (${mostCommon.count} times). Your least frequent mood is '${leastCommon.label}'. Your average mood is ${avgMood}. Your best day was ${bestDay.date} (${moods.find(m => m.value === bestDay.mood)?.label}), and your toughest day was ${worstDay.date} (${moods.find(m => m.value === worstDay.mood)?.label}). Keep tracking your feelings—you're doing great!`;
}

function getCategoryGraphInsight(entries: any[]) {
  if (!entries.length) return "No category data to analyze yet, but I'm here to help you reflect whenever you're ready!";

  // Count categories
  const catCounts: Record<string, number> = {};
  for (const e of entries) {
    const cat = e.aiCategory || 'other';
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  }
  const sorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3);

  // Find if one category dominates
  const total = entries.length;
  const [topCat, topCount] = sorted[0];
  const topPercent = ((topCount / total) * 100).toFixed(1);

  let message = `You've written most about '${topCat}' (${topCount} entries, ${topPercent}% of your journaling).`;

  if (parseFloat(topPercent) > 60) {
    message += " This theme is a major focus for you. Consider exploring other areas for a more balanced reflection.";
  } else if (parseFloat(topPercent) < 35 && top3.length > 1) {
    message += ` Your journaling is well-balanced across themes: ${top3.map(([cat, count]) => `'${cat}' (${count})`).join(', ')}.`;
  } else if (top3.length > 1) {
    message += ` Other frequent themes: ${top3.slice(1).map(([cat, count]) => `'${cat}' (${count})`).join(', ')}.`;
  }

  // Optional: Check for change over time (last 7 vs. first 7 entries)
  if (entries.length >= 14) {
    const firstHalf = entries.slice(0, Math.floor(entries.length / 2));
    const lastHalf = entries.slice(Math.floor(entries.length / 2));
    const firstTop = Object.entries(firstHalf.reduce((acc, e) => {
      const cat = e.aiCategory || 'other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1])[0]?.[0];
    const lastTop = Object.entries(lastHalf.reduce((acc, e) => {
      const cat = e.aiCategory || 'other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (firstTop && lastTop && firstTop !== lastTop) {
      message += ` Notably, your focus has shifted from '${firstTop}' earlier to '${lastTop}' more recently.`;
    }
  }

  return message;
}

function getChatInsight(question: string, entries: any[], moods: any[], tags: string[]) {
  if (!entries || entries.length === 0) {
    return "You don't have any journal entries yet. Start writing to see insights!";
  }
  const q = question.toLowerCase();
  if (q.includes('most common mood') || q.includes('frequent mood')) {
    const moodCounts = moods.map(mood => ({
      label: mood.label,
      count: entries.filter(e => e.mood === mood.value).length
    }));
    const mostCommon = moodCounts.reduce((a, b) => (a.count > b.count ? a : b));
    return `Your most common mood is '${mostCommon.label}' (${mostCommon.count} times).`;
  }
  if (q.includes('trend') || q.includes('pattern')) {
    const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = sorted[0]?.mood;
    const last = sorted[sorted.length - 1]?.mood;
    if (first !== undefined && last !== undefined) {
      if (last > first) return "Your mood seems to be improving over time!";
      if (last < first) return "Your mood seems to be declining over time. Remember, it's okay to have ups and downs.";
      return "Your mood has been steady over time.";
    }
    return "Not enough data to detect a trend yet.";
  }
  if (q.includes('category') || q.includes('topic') || q.includes('theme')) {
    const catCounts: Record<string, number> = {};
    for (const e of entries) {
      const cat = e.aiCategory || 'other';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    }
    const sorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
    const top3 = sorted.slice(0, 3);
    return `Your top journaling themes are: ${top3.map(([cat, count]) => `'${cat}' (${count})`).join(', ')}.`;
  }
  if (q.includes('summary') || q.includes('summarize') || q.includes('suggest')) {
    const moodCounts = moods.map(mood => ({
      label: mood.label,
      count: entries.filter(e => e.mood === mood.value).length
    }));
    const mostCommon = moodCounts.reduce((a, b) => (a.count > b.count ? a : b));
    const avgMood = (entries.reduce((sum, e) => sum + (e.mood || 0), 0) / entries.length).toFixed(2);
    const catCounts: Record<string, number> = {};
    for (const e of entries) {
      const cat = e.aiCategory || 'other';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    }
    const sorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
    const top3 = sorted.slice(0, 3);
    return `Summary: Your most common mood is '${mostCommon.label}'. Your average mood is ${avgMood}. Your top themes: ${top3.map(([cat, count]) => `'${cat}' (${count})`).join(', ')}.`;
  }
  if (q.includes('happiest day') || q.includes('best day')) {
    const bestDay = entries.reduce((a, b) => (a.mood > b.mood ? a : b));
    return `Your happiest day was ${bestDay.date} (${moods.find(m => m.value === bestDay.mood)?.label}).`;
  }
  if (q.includes('worst day') || q.includes('saddest day') || q.includes('lowest day')) {
    const worstDay = entries.reduce((a, b) => (a.mood < b.mood ? a : b));
    return `Your toughest day was ${worstDay.date} (${moods.find(m => m.value === worstDay.mood)?.label}).`;
  }
  if (q.includes('average mood')) {
    const avgMood = (entries.reduce((sum, e) => sum + (e.mood || 0), 0) / entries.length).toFixed(2);
    return `Your average mood is ${avgMood}.`;
  }
  if (q.includes('how many') && q.includes('category')) {
    const match = q.match(/category ([a-z]+)/);
    if (match) {
      const cat = match[1];
      const count = entries.filter(e => (e.aiCategory || 'other').toLowerCase() === cat).length;
      return `You have ${count} entries in the '${cat}' category.`;
    }
  }
  // Fallback: echo question and basic stats
  return `You asked: "${question}". You have ${entries.length} entries. Try asking about your most common mood, trends, happiest day, or a summary!`;
}

export async function POST(req: Request) {
  const body = await req.json();
  if (body.type === 'chat' || body.type === 'mood-graph' || body.type === 'category-graph') {
    const { question, entries, moods, tags } = body;
    const prompt = `
You are a helpful journal analytics assistant. The user has the following journal entries:
${JSON.stringify(entries, null, 2)}
Moods: ${JSON.stringify(moods, null, 2)}
Tags: ${JSON.stringify(tags, null, 2)}
User's question: "${question || 'Give me a summary of my mood and category trends.'}"
Give a concise, insightful, and encouraging answer based only on the data above.
    `;

    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!geminiRes.ok) {
      return NextResponse.json({ insight: 'Sorry, the AI service is currently unavailable.' }, { status: 500 });
    }

    const geminiData = await geminiRes.json();
    const insight = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not find an answer.';
    return NextResponse.json({ insight });
  }
  return NextResponse.json({ insight: 'Sorry, I could not find an answer.' });
}