'use server';
/**
 * @fileOverview An AI agent that provides real-time job market intelligence.
 *
 * - getMarketIntelligence - A function that handles the market intelligence generation.
 * - MarketIntelligenceInput - The input type for the getMarketIntelligence function.
 * - MarketIntelligenceOutput - The return type for the getMarketIntelligence function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketIntelligenceInputSchema = z.object({
  role: z.string().describe('The job role to analyze.'),
});
export type MarketIntelligenceInput = z.infer<typeof MarketIntelligenceInputSchema>;

const MarketIntelligenceOutputSchema = z.object({
  analysisSummary: z.string().describe('A brief summary of the current market outlook for the role.'),
  salaryData: z.object({
    entryLevel: z.number().describe('Estimated entry-level salary.'),
    midLevel: z.number().describe('Estimated mid-level salary.'),
    seniorLevel: z.number().describe('Estimated senior-level salary.'),
    currency: z.string().describe('The currency for the salary, e.g., USD, INR.'),
  }),
  topCompanies: z.array(z.string()).describe('A list of top 5 companies currently hiring for this role.'),
  topLocations: z.array(z.string()).describe('A list of top 5 cities or regions with high demand for this role.'),
  requiredSkills: z.array(z.object({
    skill: z.string(),
    demand: z.enum(['High', 'Medium', 'Low']),
  })).describe('A list of key skills and their current demand level.'),
});
export type MarketIntelligenceOutput = z.infer<typeof MarketIntelligenceOutputSchema>;

export async function getMarketIntelligence(
  input: MarketIntelligenceInput
): Promise<MarketIntelligenceOutput> {
  return marketIntelligenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketIntelligencePrompt',
  input: {schema: MarketIntelligenceInputSchema},
  output: {schema: MarketIntelligenceOutputSchema},
  prompt: `You are a Market Intelligence Analyst for the tech industry. Your task is to provide a detailed, data-driven analysis for the specified job role: {{{role}}}.

Generate fictional but realistic data based on current market trends.

Provide the following:
- A concise summary of the job market outlook.
- Estimated salary ranges (entry, mid, senior) in USD.
- A list of 5 top hiring companies (well-known tech firms).
- A list of 5 top locations (cities) for this role.
- A list of 10 key skills, each with a demand rating of 'High', 'Medium', or 'Low'.
`,
});

const marketIntelligenceFlow = ai.defineFlow(
  {
    name: 'marketIntelligenceFlow',
    inputSchema: MarketIntelligenceInputSchema,
    outputSchema: MarketIntelligenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
