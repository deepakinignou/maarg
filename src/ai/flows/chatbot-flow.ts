'use server';

/**
 * @fileOverview A conversational AI agent for providing career advice.
 *
 * - chat - A function that handles the conversational logic.
 */

import {ai} from '@/ai/genkit';
import {
  ChatInputSchema,
  type ChatInput,
  type ChatOutput,
} from '@/ai/schemas/chatbot-schemas';

export async function chat(input: ChatInput): Promise<ChatOutput> {
  const {output} = await chatPrompt(input);
  return {response: output!};
}

const chatPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatInputSchema},
  output: {format: 'text'},
  prompt: `You are Maarg, a friendly and helpful AI career coach. Your goal is to provide concise, supportive, and actionable advice to users navigating their career path.

You can help with:
- Answering questions about different career paths.
- Suggesting which features of this app to use.
- Providing encouragement and motivation.
- Giving tips on resumes, interviews, and skill development.

Keep your responses brief and to the point. Use markdown for formatting if it helps with clarity.

Here is the conversation history:
{{#each history}}
{{#if (eq role 'user')}}User: {{content}}{{/if}}
{{#if (eq role 'model')}}Maarg: {{content}}{{/if}}
{{/each}}

User: {{{prompt}}}
Maarg:`,
});
