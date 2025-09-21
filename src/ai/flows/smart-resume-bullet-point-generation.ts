'use server';
/**
 * @fileOverview Generates resume bullet points based on user input and job description.
 *
 * - generateResumeBulletPoints - A function that generates resume bullet points.
 * - GenerateResumeBulletPointsInput - The input type for the generateResumeBulletPoints function.
 * - GenerateResumeBulletPointsOutput - The return type for the generateResumeBulletPoints function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeBulletPointsInputSchema = z.object({
  experienceDescription: z
    .string()
    .describe('Description of the work experience to generate bullet points for.'),
  jobDescription: z
    .string()
    .describe('The job description the resume is being tailored for.'),
});
export type GenerateResumeBulletPointsInput = z.infer<
  typeof GenerateResumeBulletPointsInputSchema
>;

const GenerateResumeBulletPointsOutputSchema = z.object({
  bulletPoints: z
    .array(z.string())
    .describe('Array of generated resume bullet points.'),
});
export type GenerateResumeBulletPointsOutput = z.infer<
  typeof GenerateResumeBulletPointsOutputSchema
>;

export async function generateResumeBulletPoints(
  input: GenerateResumeBulletPointsInput
): Promise<GenerateResumeBulletPointsOutput> {
  return generateResumeBulletPointsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumeBulletPointsPrompt',
  input: {schema: GenerateResumeBulletPointsInputSchema},
  output: {schema: GenerateResumeBulletPointsOutputSchema},
  prompt: `You are a professional resume writer. Please generate 3-5 bullet points based on the work experience provided, tailored to the job description. Focus on achievements and quantifiable results.

Work Experience Description: {{{experienceDescription}}}

Job Description: {{{jobDescription}}}

Bullet Points:`,
});

const generateResumeBulletPointsFlow = ai.defineFlow(
  {
    name: 'generateResumeBulletPointsFlow',
    inputSchema: GenerateResumeBulletPointsInputSchema,
    outputSchema: GenerateResumeBulletPointsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
