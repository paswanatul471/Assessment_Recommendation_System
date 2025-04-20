'use server';
/**
 * @fileOverview Recommends SHL assessments based on a job description.
 *
 * - recommendAssessments - A function that handles the assessment recommendation process.
 * - RecommendAssessmentsInput - The input type for the recommendAssessments function.
 * - RecommendAssessmentsOutput - The return type for the recommendAssessments function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getShlAssessments, ShlAssessment} from '@/services/shl';

const RecommendAssessmentsInputSchema = z.object({
  jobDescription: z.string().describe('The job description text.'),
});
export type RecommendAssessmentsInput = z.infer<typeof RecommendAssessmentsInputSchema>;

const RecommendAssessmentsOutputSchema = z.array(z.object({
  assessmentName: z.string().describe('The name of the assessment.'),
  assessmentUrl: z.string().describe('The URL to the assessment in the SHL catalog.'),
  remoteTestingSupport: z.string().describe('Indicates whether remote testing is supported (Yes/No).'),
  adaptiveIrtSupport: z.string().describe('Indicates whether adaptive/IRT is supported (Yes/No).'),
  duration: z.string().describe('The duration of the assessment.'),
  testType: z.string().describe('The type of test.'),
  relevanceScore: z.number().describe('A score indicating the relevance of the assessment to the job description.'),
}));
export type RecommendAssessmentsOutput = z.infer<typeof RecommendAssessmentsOutputSchema>;

export async function recommendAssessments(input: RecommendAssessmentsInput): Promise<RecommendAssessmentsOutput> {
  return recommendAssessmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendAssessmentsPrompt',
  input: {
    schema: z.object({
      jobDescription: z.string().describe('The job description text.'),
      assessments: z.array(z.object({
        assessmentName: z.string().describe('The name of the assessment.'),
        assessmentUrl: z.string().describe('The URL to the assessment in the SHL catalog.'),
        remoteTestingSupport: z.string().describe('Indicates whether remote testing is supported (Yes/No).'),
        adaptiveIrtSupport: z.string().describe('Indicates whether adaptive/IRT is supported (Yes/No).'),
        duration: z.string().describe('The duration of the assessment.'),
        testType: z.string().describe('The type of test.'),
      })).describe('A list of available SHL assessments.'),
    }),
  },
  output: {
    schema: z.array(z.object({
      assessmentName: z.string().describe('The name of the assessment.'),
      assessmentUrl: z.string().describe('The URL to the assessment in the SHL catalog.'),
      remoteTestingSupport: z.string().describe('Indicates whether remote testing is supported (Yes/No).'),
      adaptiveIrtSupport: z.string().describe('Indicates whether adaptive/IRT is supported (Yes/No).'),
      duration: z.string().describe('The duration of the assessment.'),
      testType: z.string().describe('The type of test.'),
      relevanceScore: z.number().describe('A score indicating the relevance of the assessment to the job description.'),
    })),
  },
  prompt: `Given the following job description: {{{jobDescription}}}, and a list of SHL assessments, rank the assessments by relevance to the job description.  Return a relevance score between 0 and 1 for each assessment.

Assessments:
{{#each assessments}}
- Assessment Name: {{assessmentName}}, URL: {{assessmentUrl}}, Remote Testing Support: {{remoteTestingSupport}}, Adaptive/IRT Support: {{adaptiveIrtSupport}}, Duration: {{duration}}, Test Type: {{testType}}
{{/each}}

Ensure that the output contains all the fields from the input assessments, as well as the new relevanceScore field.
`,
});

const recommendAssessmentsFlow = ai.defineFlow<
  typeof RecommendAssessmentsInputSchema,
  typeof RecommendAssessmentsOutputSchema
>({
  name: 'recommendAssessmentsFlow',
  inputSchema: RecommendAssessmentsInputSchema,
  outputSchema: RecommendAssessmentsOutputSchema,
}, async input => {
  const assessments = await getShlAssessments(input.jobDescription);
  const {output} = await prompt({
    ...input,
    assessments,
  });
  return output!;
});
