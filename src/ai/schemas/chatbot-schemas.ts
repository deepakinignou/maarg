import {z} from 'genkit';

/**
 * @fileOverview Schemas and types for the chatbot functionality.
 *
 * - ChatMessage - A message in the chat history.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
  prompt: z.string().describe("The user's latest message."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.object({
  response: z.string().describe("The AI's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;
