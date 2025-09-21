"use server";

import { z } from "zod";
import {
  extractSkills,
  ExtractSkillsInput,
  ExtractSkillsOutput,
} from "@/ai/flows/skills-mapping-from-academic-records";
import {
  getCareerPathRecommendations,
  CareerPathRecommendationsInput,
  CareerPathRecommendationsOutput,
} from "@/ai/flows/career-path-recommendations-based-on-skills";
import {
  generateResumeBulletPoints,
  GenerateResumeBulletPointsInput,
  GenerateResumeBulletPointsOutput,
} from "@/ai/flows/smart-resume-bullet-point-generation";
import {
  getSkillsDemandForecast,
  SkillsDemandForecastInput,
  SkillsDemandForecastOutput,
} from "@/ai/flows/skills-demand-forecasting-for-data-science";
import {
  interviewFlow,
  InterviewFlowInput,
  InterviewFlowOutput,
} from "@/ai/flows/interview-flow";
import {
  getLearningPath,
  type LearningPathInput,
  type LearningPathOutput,
} from "@/ai/flows/learning-path-recommendation";
import { chat } from "@/ai/flows/chatbot-flow";
import { type ChatInput, type ChatOutput } from "@/ai/schemas/chatbot-schemas";
import { getJobMatches } from "@/ai/flows/job-matching-flow";
import { JobMatchingInput, JobMatchingOutput } from "@/ai/schemas/job-matching-schemas";
import { getMarketIntelligence, type MarketIntelligenceInput, type MarketIntelligenceOutput } from "@/ai/flows/market-intelligence-flow";


// Type for a standardized server action response
export type FormState<T> = {
  message: string;
  data?: T;
  fields?: Record<string, string>;
  issues?: string[];
};

// Skills Mapping Action
const skillsSchema = z.object({
  academicRecords: z.string().min(20, "Please provide more details about your academic records."),
  extracurricularActivities: z.string().optional(),
  projectDescriptions: z.string().optional(),
});
export async function mapSkillsAction(
  prevState: FormState<ExtractSkillsOutput>,
  formData: FormData
): Promise<FormState<ExtractSkillsOutput>> {
  const validatedFields = skillsSchema.safeParse({
    academicRecords: formData.get("academicRecords"),
    extracurricularActivities: formData.get("extracurricularActivities") || "",
    projectDescriptions: formData.get("projectDescriptions") || "",
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      message: "Error: Invalid input.",
      fields: {
        academicRecords: formData.get("academicRecords")?.toString() ?? '',
        extracurricularActivities: formData.get("extracurricularActivities")?.toString() ?? '',
        projectDescriptions: formData.get("projectDescriptions")?.toString() ?? '',
      },
      issues: fieldErrors.academicRecords,
    };
  }

  try {
    const result = await extractSkills(validatedFields.data as ExtractSkillsInput);
    return { message: "Skills extracted successfully.", data: result };
  } catch (e) {
    return { message: "An error occurred on the server. Please try again later.", issues: [e instanceof Error ? e.message : String(e)] };
  }
}

// Career Path Action
const careerPathSchema = z.object({
  skills: z.string().min(3, "Please provide your skills."),
  interests: z.string().min(10, "Please describe your interests."),
  aptitude: z.string().min(10, "Please describe your aptitude."),
});
export async function recommendCareerPathsAction(
  prevState: FormState<CareerPathRecommendationsOutput>,
  formData: FormData
): Promise<FormState<CareerPathRecommendationsOutput>> {
  const validatedFields = careerPathSchema.safeParse({
    skills: formData.get("skills"),
    interests: formData.get("interests"),
    aptitude: formData.get("aptitude"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      message: "Error: Invalid input.",
      fields: {
        skills: formData.get('skills')?.toString() ?? '',
        interests: formData.get('interests')?.toString() ?? '',
        aptitude: formData.get('aptitude')?.toString() ?? '',
      },
      issues: Object.values(fieldErrors).flat(),
    };
  }
  
  try {
    const result = await getCareerPathRecommendations(validatedFields.data as CareerPathRecommendationsInput);
    return { message: "Career paths recommended.", data: result };
  } catch (e) {
    return { message: "An error occurred on the server. Please try again later.", issues: [e instanceof Error ? e.message : String(e)] };
  }
}


// Resume Builder Action
const resumeSchema = z.object({
  experienceDescription: z.string().min(20, "Please provide more details about your experience."),
  jobDescription: z.string().min(20, "Please provide more details about the job description."),
});
export async function generateResumePointsAction(
  prevState: FormState<GenerateResumeBulletPointsOutput>,
  formData: FormData
): Promise<FormState<GenerateResumeBulletPointsOutput>> {
  const validatedFields = resumeSchema.safeParse({
    experienceDescription: formData.get("experienceDescription"),
    jobDescription: formData.get("jobDescription"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      message: "Error: Invalid input.",
      fields: {
        experienceDescription: formData.get('experienceDescription')?.toString() ?? '',
        jobDescription: formData.get('jobDescription')?.toString() ?? '',
      },
      issues: Object.values(fieldErrors).flat(),
    };
  }
  
  try {
    const result = await generateResumeBulletPoints(validatedFields.data as GenerateResumeBulletPointsInput);
    return { message: "Bullet points generated.", data: result };
  } catch (e) {
    return { message: "An error occurred on the server. Please try again later.", issues: [e instanceof Error ? e.message : String(e)] };
  }
}

// Demand Forecasting Action
const forecastSchema = z.object({
  role: z.string().min(1, "Please select a role."),
  timeframeYears: z.coerce.number().min(1).max(10),
});
export async function forecastSkillsDemandAction(
  prevState: FormState<SkillsDemandForecastOutput>,
  formData: FormData
): Promise<FormState<SkillsDemandForecastOutput>> {
  const validatedFields = forecastSchema.safeParse({
    role: formData.get("role"),
    timeframeYears: formData.get("timeframeYears"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      message: "Error: Invalid input.",
      fields: {
        role: formData.get('role')?.toString() ?? '',
        timeframeYears: formData.get('timeframeYears')?.toString() ?? '',
      },
      issues: Object.values(fieldErrors).flat(),
    };
  }
  
  try {
    const result = await getSkillsDemandForecast(validatedFields.data as SkillsDemandForecastInput);
    return { message: "Forecast generated.", data: result };
  } catch (e) {
    return { message: "An error occurred on the server. Please try again later.", issues: [e instanceof Error ? e.message : String(e)] };
  }
}

// Interview Prep Action
const interviewSchema = z.object({
  role: z.string().min(1, "Please select a role."),
  question: z.string().optional(),
  userAnswer: z.string().optional(),
  conversation: z.string().optional(),
});
export async function interviewPrepAction(
  prevState: FormState<InterviewFlowOutput>,
  formData: FormData
): Promise<FormState<InterviewFlowOutput>> {
  const validatedFields = interviewSchema.safeParse({
    role: formData.get("role"),
    question: formData.get("question") || undefined,
    userAnswer: formData.get("userAnswer") || undefined,
    conversation: formData.get("conversation") || undefined,
  });

  if (!validatedFields.success) {
    return { message: "Error: Invalid input." };
  }

  try {
    const result = await interviewFlow(validatedFields.data as InterviewFlowInput);
    const state: FormState<InterviewFlowOutput> = { message: "Success", data: result };
    if (validatedFields.data.question) {
        state.fields = { question: validatedFields.data.question };
    }
    return state;
  } catch (e) {
    return { message: "An error occurred on the server. Please try again later.", issues: [e instanceof Error ? e.message : String(e)] };
  }
}


// Learning Plan Action
const learningPlanSchema = z.object({
    targetCareer: z.string().min(1, "Please select a career role."),
    currentSkills: z.string().min(3, "Please enter at least one skill."),
});
export async function learningPlanAction(
    prevState: FormState<LearningPathOutput>,
    formData: FormData
): Promise<FormState<LearningPathOutput>> {
    const validatedFields = learningPlanSchema.safeParse({
        targetCareer: formData.get("targetCareer"),
        currentSkills: formData.get("currentSkills"),
    });

    if (!validatedFields.success) {
        const { fieldErrors } = validatedFields.error.flatten();
        return {
            message: "Error: Invalid input.",
            fields: {
                targetCareer: formData.get('targetCareer')?.toString() ?? '',
                currentSkills: formData.get('currentSkills')?.toString() ?? '',
            },
            issues: Object.values(fieldErrors).flat(),
        };
    }

    try {
        const result = await getLearningPath(validatedFields.data as LearningPathInput);
        return { message: "Learning path generated.", data: result };
    } catch (e) {
        return { message: "An error occurred on the server. Please try again later.", issues: [e instanceof Error ? e.message : String(e)] };
    }
}


// Chatbot Action
export async function chatAction(input: ChatInput): Promise<ChatOutput | { error: string }> {
  if (!input.prompt) {
    return { error: "Invalid input: prompt is missing." };
  }
  
  try {
    const result = await chat(input);
    return result;
  } catch (e) {
    console.error("Chatbot action error:", e);
    return { error: e instanceof Error ? e.message : "An unknown error occurred in the chatbot." };
  }
}

// Job Matching Action
const jobMatchingSchema = z.object({
  skills: z.string().min(3, "Please provide at least one skill."),
});
export async function findJobsAction(
  prevState: FormState<JobMatchingOutput>,
  formData: FormData
): Promise<FormState<JobMatchingOutput>> {
  const validatedFields = jobMatchingSchema.safeParse({
    skills: formData.get("skills"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      message: "Error: Invalid input.",
      fields: {
        skills: formData.get('skills')?.toString() ?? '',
      },
      issues: Object.values(fieldErrors).flat(),
    };
  }
  
  try {
    const result = await getJobMatches(validatedFields.data as JobMatchingInput);
    return { message: "Job matches found.", data: result };
  } catch (e) {
    return { message: "An error occurred on the server. Please try again later.", issues: [e instanceof Error ? e.message : String(e)] };
  }
}

// Market Intelligence Action
const marketIntelligenceSchema = z.object({
  role: z.string().min(1, "Please select a role."),
});
export async function analyzeMarketAction(
  prevState: FormState<MarketIntelligenceOutput>,
  formData: FormData
): Promise<FormState<MarketIntelligenceOutput>> {
  const validatedFields = marketIntelligenceSchema.safeParse({
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      message: "Error: Invalid input.",
      fields: {
        role: formData.get('role')?.toString() ?? '',
      },
      issues: Object.values(fieldErrors).flat(),
    };
  }
  
  try {
    const result = await getMarketIntelligence(validatedFields.data as MarketIntelligenceInput);
    return { message: "Market analysis generated.", data: result };
  } catch (e) {
    return { message: "An error occurred on the server. Please try again later.", issues: [e instanceof Error ? e.message : String(e)] };
  }
}
