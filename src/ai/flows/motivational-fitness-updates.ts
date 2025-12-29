'use server';

/**
 * @fileOverview A flow that generates motivational fitness updates and personalized guidance.
 *
 * - getMotivationalFitnessUpdate - A function that generates a motivational fitness update.
 * - MotivationalFitnessUpdateInput - The input type for the getMotivationalFitnessUpdate function.
 * - MotivationalFitnessUpdateOutput - The return type for the getMotivationalFitnessUpdate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const MotivationalFitnessUpdateInputSchema = z.object({
  userMessage: z.string().describe('The user\'s message describing how they feel or their current situation.'),
});
export type MotivationalFitnessUpdateInput = z.infer<typeof MotivationalFitnessUpdateInputSchema>;

const MotivationalFitnessUpdateOutputSchema = z.object({
  motivationalMessage: z.string().describe('A friendly, supportive, and motivational message responding directly to the user.'),
  personalizedGuidance: z.string().describe('A short, actionable piece of advice or guidance based on the user\'s message.'),
});
export type MotivationalFitnessUpdateOutput = z.infer<typeof MotivationalFitnessUpdateOutputSchema>;

export async function getMotivationalFitnessUpdate(input: MotivationalFitnessUpdateInput): Promise<MotivationalFitnessUpdateOutput> {
  return motivationalFitnessUpdateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalFitnessUpdatePrompt',
  input: {schema: MotivationalFitnessUpdateInputSchema},
  output: {schema: MotivationalFitnessUpdateOutputSchema},
  prompt: `You are a virtual gym buddy, talking to a friend. Your personality is supportive, friendly, and motivating.
  
  The user sent you the following message:
  "{{{userMessage}}}"

  Based on their message, do the following:
  1.  **Analyze Sentiment**: Determine the user's emotional state (e.g., happy, tired, frustrated, motivated).
  2.  **Write a Motivational Message**: Write a short, conversational, and empathetic response that speaks directly to their message. If they're feeling down, be encouraging. If they're excited, celebrate with them. Talk like a real friend.
  3.  **Provide Personalized Guidance**: Give one short, actionable piece of advice. For example, if they're tired, suggest a shorter workout or a rest day. If they're unsure what to do, suggest a simple exercise.

  Example:
  User Message: "I feel so lazy and tired today, don't feel like working out."
  Your Motivational Message: "Hey, it's totally okay to feel that way! Some days are just tougher than others. Don't be too hard on yourself."
  Your Personalized Guidance: "How about we just aim for a quick 10-minute walk? Just to get the body moving a little. No pressure!"
  
  Output a valid JSON object with the given schema.`,
});

const motivationalFitnessUpdateFlow = ai.defineFlow(
  {
    name: 'motivationalFitnessUpdateFlow',
    inputSchema: MotivationalFitnessUpdateInputSchema,
    outputSchema: MotivationalFitnessUpdateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
