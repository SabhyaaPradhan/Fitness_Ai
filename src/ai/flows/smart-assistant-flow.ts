'use server';
/**
 * @fileOverview A smart gym assistant that provides real-time workout guidance.
 *
 * - getSmartAssistantFeedback - A function that provides real-time workout feedback and recommendations.
 * - SmartAssistantInput - The input type for the getSmartAssistantFeedback function.
 * - SmartAssistantOutput - The return type for the getSmartAssistantFeedback function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SmartAssistantInputSchema = z.object({
  workoutType: z.string().describe('The type of workout being performed.'),
  currentSet: z.number().describe('The current set number.'),
  repCount: z.number().describe('The number of reps completed in the current set.'),
  heartRate: z.number().optional().describe('The user\'s heart rate in beats per minute (BPM).'),
  timeUnderTension: z.number().optional().describe('The total time under tension for the set in seconds.'),
  weightLifted: z.string().optional().describe('The weight lifted for the set, including units (e.g., "150 lbs", "70 kg").'),
  perceivedExertion: z.string().describe('User\'s subjective feeling of exertion (e.g., "Felt challenging but manageable").')
});
export type SmartAssistantInput = z.infer<typeof SmartAssistantInputSchema>;

const SmartAssistantOutputSchema = z.object({
  intensityRecommendation: z.string().describe('Recommendation to increase, decrease, or maintain intensity.'),
  restSuggestion: z.string().describe('Suggested rest time before the next set.'),
  motivationalNudge: z.string().describe('A contextual motivational message.'),
});
export type SmartAssistantOutput = z.infer<typeof SmartAssistantOutputSchema>;

export async function getSmartAssistantFeedback(
  input: SmartAssistantInput
): Promise<SmartAssistantOutput> {
  return smartAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartAssistantPrompt',
  input: { schema: SmartAssistantInputSchema },
  output: { schema: SmartAssistantOutputSchema },
  prompt: `You are an AI Smart Gym Assistant connected to IoT gym equipment. Your role is to provide real-time guidance based on user performance and sensor data.

  Workout: {{{workoutType}}}
  Current Set: {{{currentSet}}}
  Reps Completed: {{{repCount}}}
  
  Sensor Data:
  - Heart Rate: {{#if heartRate}}{{{heartRate}}} BPM{{else}}N/A{{/if}}
  - Time Under Tension: {{#if timeUnderTension}}{{{timeUnderTension}}} seconds{{else}}N/A{{/if}}
  - Weight Lifted: {{#if weightLifted}}{{{weightLifted}}}{{else}}N/A{{/if}}
  - User's Perceived Exertion: {{{perceivedExertion}}}

  Based on this data, provide:
  1.  An intensity recommendation for the next set (e.g., "Increase weight by 5%", "Maintain current weight," "Reduce reps by 2"). This is a command to the "smart equipment".
  2.  A specific rest time suggestion (e.g., "Rest for 60 seconds," "Take a 2-minute break").
  3.  A short, contextual motivational nudge.

  Analyze the data like a real personal trainer. If heart rate is very high for the exercise, suggest reducing intensity or a longer rest. If time under tension is low, reps are high, and exertion is low, suggest increasing weight.`,
});

const smartAssistantFlow = ai.defineFlow(
  {
    name: 'smartAssistantFlow',
    inputSchema: SmartAssistantInputSchema,
    outputSchema: SmartAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
