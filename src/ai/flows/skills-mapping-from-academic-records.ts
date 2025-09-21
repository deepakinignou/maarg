'use server';
/**
 * @fileOverview An AI agent that extracts skills from academic records, extracurricular activities, and project descriptions.
 *
 * - extractSkills - A function that handles the skill extraction process.
 * - ExtractSkillsInput - The input type for the extractSkills function.
 * - ExtractSkillsOutput - The return type for the extractSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSkillsInputSchema = z.object({
  academicRecords: z
    .string()
    .describe('The academic records of the user.'),
  extracurricularActivities: z
    .string()
    .describe('The extracurricular activities of the user.'),
  projectDescriptions: z.string().describe('The project descriptions of the user.'),
});
export type ExtractSkillsInput = z.infer<typeof ExtractSkillsInputSchema>;

const ExtractSkillsOutputSchema = z.object({
  hardSkills: z.array(z.string()).describe('The hard skills identified from the input data.'),
  softSkills: z.array(z.string()).describe('The soft skills identified from the input data.'),
});
export type ExtractSkillsOutput = z.infer<typeof ExtractSkillsOutputSchema>;

export async function extractSkills(input: ExtractSkillsInput): Promise<ExtractSkillsOutput> {
  return extractSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractSkillsPrompt',
  input: {schema: ExtractSkillsInputSchema},
  output: {schema: ExtractSkillsOutputSchema},
  prompt: `You are an AI assistant that extracts hard and soft skills from the provided data.\n\nAnalyze the following information to identify the user's hard and soft skills. Provide the skills as arrays of strings.\n\nAcademic Records: {{{academicRecords}}}\nExtracurricular Activities: {{{extracurricularActivities}}}\nProject Descriptions: {{{projectDescriptions}}}\n\nHard Skills:\nSoft Skills:`,
});

const extractSkillsFlow = ai.defineFlow(
  {
    name: 'extractSkillsFlow',
    inputSchema: ExtractSkillsInputSchema,
    outputSchema: ExtractSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
