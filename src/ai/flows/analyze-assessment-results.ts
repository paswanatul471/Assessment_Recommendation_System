'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing candidate assessment results.
 *
 * The flow takes a file containing assessment results and returns a summary
 * of key strengths and weaknesses.
 *
 * @fileOverview
 * - analyzeAssessmentResults - A function that handles the analysis process.
 * - AnalyzeAssessmentResultsInput - The input type for the analyzeAssessmentResults function.
 * - AnalyzeAssessmentResultsOutput - The return type for the analyzeAssessmentResults function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeAssessmentResultsInputSchema = z.object({
  fileUrl: z.string().describe('The URL of the file containing candidate assessment results.'),
});
export type AnalyzeAssessmentResultsInput = z.infer<typeof AnalyzeAssessmentResultsInputSchema>;

const AnalyzeAssessmentResultsOutputSchema = z.object({
  summary: z.string().describe('A summary of the key strengths and weaknesses identified in the assessment results.'),
});
export type AnalyzeAssessmentResultsOutput = z.infer<typeof AnalyzeAssessmentResultsOutputSchema>;

export async function analyzeAssessmentResults(input: AnalyzeAssessmentResultsInput): Promise<AnalyzeAssessmentResultsOutput> {
  return analyzeAssessmentResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAssessmentResultsPrompt',
  input: {
    schema: z.object({
      fileUrl: z.string().describe('The URL of the file containing candidate assessment results.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A summary of the key strengths and weaknesses identified in the assessment results.'),
    }),
  },
  prompt: `You are an AI assistant specializing in analyzing assessment results and providing summaries.

You will analyze the candidate assessment results from the provided file and generate a summary of the key strengths and weaknesses identified in the results.

Use the following information to create the summary:

File URL: {{fileUrl}}`,
});

const analyzeAssessmentResultsFlow = ai.defineFlow<
  typeof AnalyzeAssessmentResultsInputSchema,
  typeof AnalyzeAssessmentResultsOutputSchema
>({
  name: 'analyzeAssessmentResultsFlow',
  inputSchema: AnalyzeAssessmentResultsInputSchema,
  outputSchema: AnalyzeAssessmentResultsOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});

