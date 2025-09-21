'use server';

/**
 * @fileOverview A career path recommendation AI agent based on identified skills.
 *
 * - getCareerPathRecommendations - A function that handles the career path recommendation process.
 * - CareerPathRecommendationsInput - The input type for the getCareerPathRecommendations function.
 * - CareerPathRecommendationsOutput - The return type for the getCareerPathRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerPathRecommendationsInputSchema = z.object({
  skills: z
    .string()
    .describe("A comma separated list of the user's identified skills."),
  interests: z.string().describe("A short description of the user's interests."),
  aptitude: z.string().describe("A short description of the user's aptitude."),
});
export type CareerPathRecommendationsInput = z.infer<
  typeof CareerPathRecommendationsInputSchema
>;

const CareerPathRecommendationsOutputSchema = z.object({
  careerPaths: z
    .array(z.string())
    .describe('An array of personalized career path recommendations.'),
  summary: z.string().describe('A summary of why these career paths are recommended.'),
});
export type CareerPathRecommendationsOutput = z.infer<
  typeof CareerPathRecommendationsOutputSchema
>;

export async function getCareerPathRecommendations(
  input: CareerPathRecommendationsInput
): Promise<CareerPathRecommendationsOutput> {
  return careerPathRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerPathRecommendationsPrompt',
  input: {schema: CareerPathRecommendationsInputSchema},
  output: {schema: CareerPathRecommendationsOutputSchema},
  prompt: `You are a career counselor who specializes in recommending career paths based on skills, interests and aptitude.

You are provided with the following information about the user:
Skills: {{{skills}}}
Interests: {{{interests}}}
Aptitude: {{{aptitude}}}

Based on this information, and considering current industry trends and hiring demand, recommend a few (3-5) personalized career paths for the user.  Explain why you are recommending these career paths, and how they align with the user's skills, interests, and aptitude.

Format your response as follows:
Career Paths: <comma separated list of career paths>
Summary: <summary of why these career paths are recommended>
`,
});

const careerPathRecommendationsFlow = ai.defineFlow(
  {
    name: 'careerPathRecommendationsFlow',
    inputSchema: CareerPathRecommendationsInputSchema,
    outputSchema: CareerPathRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
