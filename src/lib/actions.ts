'use server';

import { z } from 'zod';
import { resumeQuestionGenerator } from '@/ai/flows/resume-question-generator';
import { analyzeAnswersAndGenerateReport, type AnalyzeAnswersInput } from '@/ai/flows/answer-analysis-report';
import { generateQA } from '@/ai/flows/generate-qa';

const resumeSchema = z.object({
  resumeText: z.string().min(50, 'Resume text is too short.'),
  numberOfQuestions: z.coerce.number().min(1, { message: 'Please generate at least 1 question.' }).max(10, { message: 'You can generate a maximum of 10 questions.' }),
});

export async function generateResumeQuestions(prevState: any, formData: FormData) {
  try {
    const validatedFields = resumeSchema.safeParse({
      resumeText: formData.get('resumeText'),
      numberOfQuestions: formData.get('numberOfQuestions'),
    });

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    const result = await resumeQuestionGenerator(validatedFields.data);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate questions. Please try again.' };
  }
}

const analysisSchema = z.object({
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    timeTaken: z.number(),
  })),
  resume: z.string().optional(),
});

export async function analyzeSubmittedAnswers(data: AnalyzeAnswersInput) {
  try {
    const validatedData = analysisSchema.safeParse(data);
    if (!validatedData.success) {
      throw new Error('Invalid input for analysis.');
    }

    const report = await analyzeAnswersAndGenerateReport(validatedData.data);
    return { data: report };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate report. Please try again.' };
  }
}

const qaSchema = z.object({
    role: z.string().min(2, { message: 'Role must be at least 2 characters.' }),
    numberOfQuestions: z.coerce.number().min(1, { message: 'Please generate at least 1 question.' }).max(10, { message: 'You can generate a maximum of 10 questions.' }),
});

export async function generateQandA(prevState: any, formData: FormData) {
    try {
        const validatedFields = qaSchema.safeParse({
            role: formData.get('role'),
            numberOfQuestions: formData.get('numberOfQuestions'),
        });

        if (!validatedFields.success) {
            return {
                error: validatedFields.error.flatten().fieldErrors,
            };
        }

        const result = await generateQA(validatedFields.data);
        return { data: result };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to generate Q&A. Please try again.' };
    }
}
