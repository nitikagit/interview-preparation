'use server';

/**
 * @fileOverview Generates a report analyzing a candidate's interview answers.
 *
 * - analyzeAnswersAndGenerateReport - A function that analyzes interview answers and generates a report.
 * - AnalyzeAnswersInput - The input type for the analyzeAnswersAndGenerateReport function.
 * - AnalysisReportOutput - The return type for the analyzeAnswersAndGenerateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAnswersInputSchema = z.object({
  answers: z.array(
    z.object({
      question: z.string().describe('The interview question asked.'),
      answer: z.string().describe('The candidate\'s answer to the question.'),
      timeTaken: z
        .number()
        .describe('The time taken by the candidate to answer in seconds.'),
    })
  ).describe('An array of questions, answers, and time taken for each question.'),
  resume: z.string().optional().describe('The candidate\'s resume. Optional.'),
});
export type AnalyzeAnswersInput = z.infer<typeof AnalyzeAnswersInputSchema>;

const AnalysisReportOutputSchema = z.object({
  overallPerformance: z.string().describe('An overall summary of the candidate\'s performance.'),
  questionBreakdown: z.array(
    z.object({
      question: z.string().describe('The interview question asked.'),
      answerAnalysis: z.string().describe('An analysis of the candidate\'s answer.'),
      timeTaken: z.number().describe('The time taken by the candidate to answer in seconds.'),
      vocabularyScore: z.number().describe('A score representing the richness and appropriateness of the vocabulary used (0-100).'),
      grammarScore: z.number().describe('A score representing the grammatical correctness of the answer (0-100).'),
      relevanceScore: z.number().describe('A score representing how relevant the answer is to the question (0-100).'),
      recommendations: z.string().describe('Recommendations for improving the answer.'),
    })
  ).describe('A breakdown of the candidate\'s performance on each question.'),
  overallRecommendations: z.string().describe('Overall recommendations for the candidate.'),
});
export type AnalysisReportOutput = z.infer<typeof AnalysisReportOutputSchema>;

export async function analyzeAnswersAndGenerateReport(
  input: AnalyzeAnswersInput
): Promise<AnalysisReportOutput> {
  return analyzeAnswersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerAnalysisPrompt',
  input: {schema: AnalyzeAnswersInputSchema},
  output: {schema: AnalysisReportOutputSchema},
  prompt: `You are an expert interview performance analyst. You will analyze the candidate's answers and generate a report with scores and recommendations.

Here is the candidate's resume:
{{#if resume}}
{{{resume}}}
{{else}}
Candidate did not provide a resume.
{{/if}}

Here are the candidate's answers:
{{#each answers}}
Question: {{{this.question}}}
Answer: {{{this.answer}}}
Time Taken: {{{this.timeTaken}}} seconds
{{/each}}


Based on the answers, provide the following:

1.  overallPerformance: An overall summary of the candidate's performance, taking into account their resume (if provided) and their answers.
2.  questionBreakdown: An array of objects, one for each question, with the following fields:
    *   question: The interview question asked.
    *   answerAnalysis: A detailed analysis of the candidate's answer.
    *   timeTaken: The time taken by the candidate to answer in seconds.
    *   vocabularyScore: A score (0-100) representing the richness and appropriateness of the vocabulary used.
    *   grammarScore: A score (0-100) representing the grammatical correctness of the answer.
    *   relevanceScore: A score (0-100) representing how relevant the answer is to the question.
    *   recommendations: Recommendations for improving the answer.
3.  overallRecommendations: Overall recommendations for the candidate, based on their performance across all questions.

Make sure the report is detailed and provides actionable feedback to the candidate.

Output in JSON format.
`,
});

const analyzeAnswersFlow = ai.defineFlow(
  {
    name: 'analyzeAnswersFlow',
    inputSchema: AnalyzeAnswersInputSchema,
    outputSchema: AnalysisReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
