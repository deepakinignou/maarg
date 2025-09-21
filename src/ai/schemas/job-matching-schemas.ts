import { z } from 'genkit';

/**
 * @fileOverview Schemas and types for the job matching functionality.
 *
 * - JobMatchingInputSchema - The Zod schema for the job matching input.
 * - JobMatchingInput - The TypeScript type for the job matching input.
 * - JobMatchingOutputSchema - The Zod schema for the job matching output.
 * - JobMatchingOutput - The TypeScript type for the job matching output.
 */

export const JobMatchingInputSchema = z.object({
  skills: z.string().describe("A comma-separated list of the user's skills."),
});
export type JobMatchingInput = z.infer<typeof JobMatchingInputSchema>;

const JobSchema = z.object({
  title: z.string().describe('The job title.'),
  company: z.string().describe('The name of the company hiring.'),
  description: z.string().describe('A brief, engaging description of the job role and responsibilities.'),
  location: z.string().describe('The job location (e.g., "San Francisco, CA", "Remote").'),
  matchingSkills: z.array(z.string()).describe('A list of skills from the input that are relevant to this job.'),
  url: z.string().url().describe('A fictional URL to the job posting.'),
});

export const JobMatchingOutputSchema = z.object({
  jobs: z.array(JobSchema).describe('An array of recommended job openings.'),
  summary: z.string().describe('A brief summary of the types of jobs recommended.'),
});
export type JobMatchingOutput = z.infer<typeof JobMatchingOutputSchema>;
