'use server';

/**
 * @fileOverview A resume-based question generator AI agent.
 *
 * - resumeQuestionGenerator - A function that handles the question generation process based on a resume.
 * - ResumeQuestionGeneratorInput - The input type for the resumeQuestionGenerator function.
 * - ResumeQuestionGeneratorOutput - The return type for the resumeQuestiongenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeQuestionGeneratorInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume.'),
  numberOfQuestions: z
    .number()
    .describe('The number of questions to generate.'),
});
export type ResumeQuestionGeneratorInput = z.infer<
  typeof ResumeQuestionGeneratorInputSchema
>;

const ResumeQuestionGeneratorOutputSchema = z.object({
  questions: z
    .array(z.string())
    .describe(
      'An array of interview questions generated based on the resume.'
    ),
});
export type ResumeQuestionGeneratorOutput = z.infer<
  typeof ResumeQuestionGeneratorOutputSchema
>;

export async function resumeQuestionGenerator(
  input: ResumeQuestionGeneratorInput
): Promise<ResumeQuestionGeneratorOutput> {
  return resumeQuestionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeQuestionGeneratorPrompt',
  input: {schema: ResumeQuestionGeneratorInputSchema},
  output: {schema: ResumeQuestionGeneratorOutputSchema},
  prompt: `You are an expert career coach specializing in helping candidates prepare for interviews.

You will analyze the candidate's resume and generate a list of relevant interview questions based on their skills, experience, and projects.

Resume:
{{resumeText}}

Generate {{{numberOfQuestions}}} interview questions that are tailored to the candidate's resume. Focus on questions that assess the candidate's skills, experience, and suitability for potential roles.

Output the questions as a JSON array of strings.`,
});

const resumeQuestionGeneratorFlow = ai.defineFlow(
  {
    name: 'resumeQuestionGeneratorFlow',
    inputSchema: ResumeQuestionGeneratorInputSchema,
    outputSchema: ResumeQuestionGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
