'use server';
/**
 * @fileOverview An AI agent that generates a personalized learning path based on skill gaps.
 *
 * - getLearningPath - A function that handles the learning path generation process.
 * - LearningPathInput - The input type for the getLearningPath function.
 * - LearningPathOutput - The return type for the getLearningPath function.
 */

import {ai} from '@/ai/genkit';
import {
  LearningPathInputSchema,
  LearningPathOutputSchema,
  type LearningPathInput,
  type LearningPathOutput,
} from '@/ai/schemas/learning-path-schemas';


export type {LearningPathInput, LearningPathOutput};


export async function getLearningPath(
  input: LearningPathInput
): Promise<LearningPathOutput> {
  return learningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'learningPathPrompt',
  input: {schema: LearningPathInputSchema},
  output: {schema: LearningPathOutputSchema},
  prompt: `You are an expert career coach and learning advisor. Your task is to create a personalized learning plan for a user who wants to become a {{{targetCareer}}}.

The user's current skills are: {{{currentSkills}}}.

First, identify the essential and good-to-have skills required for a {{{targetCareer}}}.
Compare the user's current skills with the required skills to identify the skill gaps.

Then, for each skill gap, recommend 1-2 high-quality, relevant learning resources (like courses, tutorials, books, or projects). Provide a title, platform, type, a valid URL, and the skill it addresses.

Finally, provide a brief, encouraging summary of the learning plan.
`,
});

const learningPathFlow = ai.defineFlow(
  {
    name: 'learningPathFlow',
    inputSchema: LearningPathInputSchema,
    outputSchema: LearningPathOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
