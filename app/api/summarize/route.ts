import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: Request) {
  try {
    const { emails } = await request.json()

    if (!emails || emails.length === 0) {
      return NextResponse.json({ error: 'No emails provided' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      // Fallback to mock summary if no API key
      const mockSummary = generateMockSummary(emails)
      return NextResponse.json({ summary: mockSummary })
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    const emailText = emails.map((email: any, index: number) =>
      `Email ${index + 1}:\nFrom: ${email.from}\nSubject: ${email.subject}\nDate: ${email.date}\nBody: ${email.body}\n`
    ).join('\n---\n\n')

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are an email summarization assistant. Please analyze the following emails and provide a concise, well-organized summary. Include:

1. **Overview**: A brief summary of the total emails and main themes
2. **Priority Items**: Any urgent or important emails that need attention
3. **Action Required**: Tasks or deadlines mentioned
4. **FYI**: Informational emails that don't require immediate action

Here are the emails:

${emailText}

Please provide a clear, actionable summary.`
      }]
    })

    const summary = message.content[0].type === 'text' ? message.content[0].text : 'Unable to generate summary'

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error:', error)

    // Fallback to mock summary on error
    const { emails } = await request.json()
    const mockSummary = generateMockSummary(emails)
    return NextResponse.json({ summary: mockSummary })
  }
}

function generateMockSummary(emails: any[]) {
  const urgent = emails.filter(e =>
    e.subject.toLowerCase().includes('urgent') ||
    e.subject.toLowerCase().includes('deadline') ||
    e.body.toLowerCase().includes('asap')
  )

  const marketing = emails.filter(e =>
    e.subject.toLowerCase().includes('sale') ||
    e.subject.toLowerCase().includes('offer') ||
    e.from.includes('marketing')
  )

  return `📧 **Email Summary** (${emails.length} total emails)

**Overview:**
You have ${emails.length} emails to review. ${urgent.length > 0 ? `${urgent.length} require immediate attention.` : 'No urgent items detected.'}

**Priority Items:**
${urgent.length > 0 ? urgent.map(e => `• ${e.from}: "${e.subject}"`).join('\n') : '• No urgent emails'}

**Action Required:**
${urgent.length > 0 ? '• Review deadline-related emails\n• Respond to time-sensitive requests' : '• No immediate actions needed'}

**FYI:**
${marketing.length > 0 ? `• ${marketing.length} promotional email(s)` : ''}
${emails.filter(e => !urgent.includes(e) && !marketing.includes(e)).length > 0 ? `• ${emails.filter(e => !urgent.includes(e) && !marketing.includes(e)).length} general email(s)` : ''}

**Note:** This is a demo summary. For AI-powered summaries, configure your ANTHROPIC_API_KEY environment variable.`
}
