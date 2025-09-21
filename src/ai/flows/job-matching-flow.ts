'use server';

/**
 * @fileOverview An AI agent for matching users to job openings based on their skills.
 *
 * - getJobMatches - A function that handles the job matching process.
 */

import { ai } from '@/ai/genkit';
import { JobMatchingInputSchema, JobMatchingOutputSchema, type JobMatchingInput, type JobMatchingOutput } from '@/ai/schemas/job-matching-schemas';

export async function getJobMatches(input: JobMatchingInput): Promise<JobMatchingOutput> {
  return jobMatchingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobMatchingPrompt',
  input: { schema: JobMatchingInputSchema },
  output: { schema: JobMatchingOutputSchema },
  prompt: `You are an expert AI recruiter. Your task is to find and recommend relevant job openings based on a user's skills.

The user's skills are: {{{skills}}}

Based on these skills, find 5-7 fictional but realistic job postings from well-known tech companies or innovative startups. For each job, provide a title, company, location, a short description, the skills from the user's list that make them a good fit, and a fictional application URL.

Generate a brief summary of the types of roles you have recommended.
`,
});

const jobMatchingFlow = ai.defineFlow(
  {
    name: 'jobMatchingFlow',
    inputSchema: JobMatchingInputSchema,
    outputSchema: JobMatchingOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
