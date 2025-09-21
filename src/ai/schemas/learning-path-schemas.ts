import {z} from 'genkit';

export const LearningPathInputSchema = z.object({
  targetCareer: z.string().describe('The desired career role.'),
  currentSkills: z
    .string()
    .describe("A comma-separated list of the user's current skills."),
});
export type LearningPathInput = z.infer<typeof LearningPathInputSchema>;

const SkillGapSchema = z.object({
  skill: z.string().describe('The skill that is missing.'),
  importance: z
    .enum(['essential', 'good-to-have'])
    .describe('The importance of the skill for the target career.'),
});

const LearningResourceSchema = z.object({
  title: z.string().describe('The title of the learning resource.'),
  platform: z
    .string()
    .describe(
      'The platform where the resource can be found (e.g., Coursera, Udemy, freeCodeCamp).'
    ),
  type: z
    .enum(['Course', 'Book', 'Project', 'Article', 'Video'])
    .describe('The type of the learning resource.'),
  url: z.string().url().describe('A URL to the resource.'),
  forSkill: z
    .string()
    .describe('The specific skill this resource helps to learn.'),
});

export const LearningPathOutputSchema = z.object({
  skillGaps: z
    .array(SkillGapSchema)
    .describe(
      'A list of skills the user needs to learn to achieve their target career.'
    ),
  learningResources: z
    .array(LearningResourceSchema)
    .describe(
      'A curated list of learning resources to help bridge the skill gaps.'
    ),
  summary: z.string().describe('A brief summary of the learning plan.'),
});
export type LearningPathOutput = z.infer<typeof LearningPathOutputSchema>;
