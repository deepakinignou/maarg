'use server';

/**
 * @fileOverview An AI agent for practicing interviews.
 *
 * - interviewFlow - A function that handles question generation and feedback.
 * - InterviewFlowInput - The input type for the interviewFlow function.
 * - InterviewFlowOutput - The return type for the interviewFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterviewFlowInputSchema = z.object({
  role: z.string().describe('The job role the user is applying for.'),
  userAnswer: z.string().optional().describe("The user's answer to a practice question."),
  question: z.string().optional().describe('The question the user is answering.'),
  conversation: z.string().optional().describe('A JSON string of the past conversation for final feedback.'),
});
export type InterviewFlowInput = z.infer<typeof InterviewFlowInputSchema>;

const InterviewReportSchema = z.object({
    confidenceScore: z.number().min(0).max(100).describe("An overall confidence score from 0-100 based on the user's performance."),
    fluencyAnalysis: z.string().describe("A brief analysis of the user's fluency and use of filler words."),
    strengths: z.array(z.string()).describe("A list of 2-3 key strengths from the user's answers."),
    areasForImprovement: z.array(z.string()).describe("A list of 2-3 specific areas for improvement."),
    summary: z.string().describe("A final encouraging summary and recommendation."),
    technicalProficiency: z.string().describe("Analysis of the user's technical knowledge and accuracy based on their answers to technical questions. If no technical questions were asked, state that."),
    behavioralCompetency: z.string().describe("Assessment of the user's performance on behavioral questions, focusing on storytelling and structure."),
    starMethodAdherence: z.string().describe("Evaluation of how effectively the user applied the STAR (Situation, Task, Action, Result) method in their answers, with examples."),
});

const InterviewFlowOutputSchema = z.object({
  questions: z.array(z.string()).optional().describe('A list of common interview questions for the specified role.'),
  feedback: z.string().optional().describe("Constructive feedback on the user's answer."),
  report: InterviewReportSchema.optional().describe("A final report card on the user's performance."),
});
export type InterviewFlowOutput = z.infer<typeof InterviewFlowOutputSchema>;

export async function interviewFlow(input: InterviewFlowInput): Promise<InterviewFlowOutput> {
  if (input.conversation) {
    // Generate final report
    const {output} = await reportPrompt({role: input.role, conversation: input.conversation});
    return { report: output! };
  } else if (input.userAnswer && input.question) {
    // Generate feedback for a single answer
    const {output} = await feedbackPrompt(input);
    return output!;
  } else {
    // Generate initial questions
    const {output} = await questionsPrompt(input);
    return output!;
  }
}

const questionsPrompt = ai.definePrompt({
  name: 'interviewQuestionsPrompt',
  input: {schema: z.object({role: z.string()})},
  output: {schema: InterviewFlowOutputSchema},
  prompt: `You are an expert career coach. Generate a list of 5 common behavioral and technical interview questions for a {{{role}}} position.`,
});

const feedbackPrompt = ai.definePrompt({
  name: 'interviewFeedbackPrompt',
  input: {schema: InterviewFlowInputSchema},
  output: {schema: z.object({feedback: z.string()})},
  prompt: `You are an expert interview coach. The user is practicing for a {{{role}}} interview.
  
Question: "{{{question}}}"
User's Answer: "{{{userAnswer}}}"

Provide constructive, concise feedback on the user's answer. Comment on its structure (like STAR method), clarity, and relevance. Suggest specific improvements. Format the feedback in markdown.`,
});


const reportPrompt = ai.definePrompt({
    name: 'interviewReportPrompt',
    input: { schema: z.object({ role: z.string(), conversation: z.string() }) },
    output: { schema: InterviewReportSchema },
    prompt: `You are an expert interview coach reviewing a mock interview transcript for a {{{role}}} position. The transcript is provided as a JSON array of objects with "type" and "text".

Transcript:
{{{conversation}}}

Based on the entire conversation, generate a detailed, analytical, and constructive final report card.
- Provide a confidence score from 0-100, where 50 is average and 90+ is exceptional.
- Briefly analyze fluency and clarity, mentioning any use of filler words.
- Identify 2-3 key strengths, providing specific examples from the transcript.
- Pinpoint 2-3 specific, actionable areas for improvement.
- Provide a detailed analysis of the user's technical proficiency based on their answers. If no technical questions were asked, note that.
- Assess the user's behavioral competency, focusing on their ability to tell compelling stories.
- Evaluate the user's adherence to the STAR (Situation, Task, Action, Result) method for behavioral questions. Provide examples of where it was used well and where it could be improved.
- Write a final encouraging summary with a clear recommendation for next steps.
`
});
