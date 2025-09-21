'use server';

/**
 * @fileOverview A skills demand forecasting AI agent for Data Science roles.
 *
 * - getSkillsDemandForecast - A function that handles the skills demand forecast process.
 * - SkillsDemandForecastInput - The input type for the getSkillsDemandForecast function.
 * - SkillsDemandForecastOutput - The return type for the getSkillsDemandForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillsDemandForecastInputSchema = z.object({
  role: z.string().describe('The specific role to forecast skills demand for (e.g., Data Scientist).'),
  timeframeYears: z.number().describe('The timeframe in years for the forecast (e.g., 3).'),
});
export type SkillsDemandForecastInput = z.infer<typeof SkillsDemandForecastInputSchema>;

const SkillsDemandForecastOutputSchema = z.object({
  forecast: z.string().describe('An AI-driven forecast of in-demand skills for the specified role and timeframe.'),
});
export type SkillsDemandForecastOutput = z.infer<typeof SkillsDemandForecastOutputSchema>;

export async function getSkillsDemandForecast(input: SkillsDemandForecastInput): Promise<SkillsDemandForecastOutput> {
  return skillsDemandForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillsDemandForecastPrompt',
  input: {schema: SkillsDemandForecastInputSchema},
  output: {schema: SkillsDemandForecastOutputSchema},
  prompt: `You are an AI career advisor. Provide a forecast of the top in-demand skills for a {{{role}}} in {{{timeframeYears}}} years.  Include specific technologies, methodologies, and soft skills.
`,
});

const skillsDemandForecastFlow = ai.defineFlow(
  {
    name: 'skillsDemandForecastFlow',
    inputSchema: SkillsDemandForecastInputSchema,
    outputSchema: SkillsDemandForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
