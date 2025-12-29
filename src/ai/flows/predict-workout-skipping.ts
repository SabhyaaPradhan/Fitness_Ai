'use server';

/**
 * @fileOverview Predicts when users might skip workouts and sends motivational nudges.
 *
 * - predictWorkoutSkipping - A function that predicts workout skipping and triggers motivational nudges.
 * - PredictWorkoutSkippingInput - The input type for the predictWorkoutSkipping function.
 * - PredictWorkoutSkippingOutput - The return type for the predictWorkoutSkipping function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const PredictWorkoutSkippingInputSchema = z.object({
  behavioralData: z
    .string()
    .describe(
      'Historical data about the users workout habits, including frequency, duration, time of day, and any reasons provided for skipping workouts.'
    ),
  currentMotivationLevel: z
    .string()
    .describe('The users current self-reported motivation level (e.g. high, medium, low).'),
  schedule: z.string().describe('The users current workout schedule.'),
});
export type PredictWorkoutSkippingInput = z.infer<typeof PredictWorkoutSkippingInputSchema>;

const PredictWorkoutSkippingOutputSchema = z.object({
  skipPrediction: z
    .boolean()
    .describe(
      'Whether or not the user is predicted to skip their next scheduled workout.'
    ),
  motivationNudge: z
    .string()
    .describe(
      'A motivational message or suggestion to encourage the user to stick to their workout schedule.'
    ),
  adjustedScheduleSuggestion: z
    .string()
    .optional()
    .describe(
      'A suggested adjustment to the workout schedule to better fit the users current motivation level and behavior.'
    ),
});
export type PredictWorkoutSkippingOutput = z.infer<typeof PredictWorkoutSkippingOutputSchema>;

export async function predictWorkoutSkipping(
  input: PredictWorkoutSkippingInput
): Promise<PredictWorkoutSkippingOutput> {
  return predictWorkoutSkippingFlow(input);
}

const predictWorkoutSkippingPrompt = ai.definePrompt({
  name: 'predictWorkoutSkippingPrompt',
  input: {schema: PredictWorkoutSkippingInputSchema},
  output: {schema: PredictWorkoutSkippingOutputSchema},
  prompt: `You are an AI fitness tracker that analyzes user behavior to predict if they will skip workouts and provide motivational nudges.

Analyze the following data to determine if the user is likely to skip their next workout:

Behavioral Data: {{{behavioralData}}}
Current Motivation Level: {{{currentMotivationLevel}}}
Schedule: {{{schedule}}}

Based on your analysis, determine if the user is likely to skip their next workout and provide a motivational nudge to encourage them to stick to their schedule.
If the user is predicted to skip their next workout, suggest an adjusted schedule that better fits their current motivation level and behavior.

Output in JSON format:
{
  "skipPrediction": true or false,
  "motivationNudge": "Your motivational message here",
  "adjustedScheduleSuggestion": "Your suggested schedule adjustment here (optional)"
}`,
});

const predictWorkoutSkippingFlow = ai.defineFlow(
  {
    name: 'predictWorkoutSkippingFlow',
    inputSchema: PredictWorkoutSkippingInputSchema,
    outputSchema: PredictWorkoutSkippingOutputSchema,
  },
  async input => {
    const {output} = await predictWorkoutSkippingPrompt(input);
    return output!;
  }
);
