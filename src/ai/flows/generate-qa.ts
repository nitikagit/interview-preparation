// src/ai/flows/generate-qa.ts
'use server';
/**
 * @fileOverview A question and answer generation AI agent.
 *
 * - generateQA - A function that handles the question and answer generation process.
 * - GenerateQAInput - The input type for the generateQA function.
 * - GenerateQAOutput - The return type for the generateQA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQAInputSchema = z.object({
  role: z.string().describe('The role or industry to generate questions and answers for.'),
  numberOfQuestions: z.number().describe('The number of questions to generate.'),
});
export type GenerateQAInput = z.infer<typeof GenerateQAInputSchema>;

const GenerateQAOutputSchema = z.object({
  questionsAndAnswers: z.array(
    z.object({
      question: z.string().describe('The generated question.'),
      answer: z.string().describe('The ideal answer to the question.'),
    })
  ).describe('An array of generated questions and their corresponding answers.'),
});
export type GenerateQAOutput = z.infer<typeof GenerateQAOutputSchema>;

export async function generateQA(input: GenerateQAInput): Promise<GenerateQAOutput> {
  return generateQAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQAPrompt',
  input: {schema: GenerateQAInputSchema},
  output: {schema: GenerateQAOutputSchema},
  prompt: `You are an expert interview question generator. You will generate a set of questions and ideal answers for a given role or industry.

Role/Industry: {{{role}}}
Number of Questions: {{{numberOfQuestions}}}

Generate questions and answers that are relevant and insightful for the given role. The answer should be in detail. Do not leave any fields empty.

Format your response as a JSON object conforming to the schema.`, 
});

const generateQAFlow = ai.defineFlow(
  {
    name: 'generateQAFlow',
    inputSchema: GenerateQAInputSchema,
    outputSchema: GenerateQAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
