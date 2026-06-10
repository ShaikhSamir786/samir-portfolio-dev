import { streamText, convertToModelMessages } from 'ai';
import { groq } from '@ai-sdk/groq';
import { runSecurityChecks } from '@/lib/chat/security';
import { getRelevantContext } from '@/lib/chat/retrieval';
import { getSystemPrompt } from '@/lib/chat/prompt';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { errorResponse } = await runSecurityChecks(req);
    if (errorResponse) return errorResponse;
    const { messages } = await req.clone().json();
    const lastMessage = messages[messages.length - 1];
    const latestMessageText = lastMessage.content || (lastMessage.parts ? lastMessage.parts.map((p: any) => p.text || '').join('') : '');

    const contextText = await getRelevantContext(latestMessageText);
    const systemPrompt = getSystemPrompt(contextText);

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
