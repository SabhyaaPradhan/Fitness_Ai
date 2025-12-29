'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending personalized diet plans based on user inputs like BMI, weight goals, and dietary preferences.
 *
 * - `recommendDietPlan`: A function that takes user information and returns a personalized diet plan.
 * - `DietPlanInput`: The input type for the `recommendDietPlan` function.
 * - `DietPlanOutput`: The output type for the `recommendDietPlan` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DietPlanInputSchema = z.object({
  bmi: z.number().describe('The user’s Body Mass Index (BMI).'),
  weightGoal: z
    .string()
    .describe(
      'The user’s weight goal, e.g., lose weight, maintain weight, gain weight.'
    ),
  dietaryPreferences:
    z.string().describe('The user’s dietary preferences, e.g., vegetarian, vegan, gluten-free.'),
  userHistory: z
    .string()
    .optional()
    .describe('The user’s historical diet data and feedback.'),
});

export type DietPlanInput = z.infer<typeof DietPlanInputSchema>;

const DietPlanOutputSchema = z.object({
  dietPlan: z.string().describe('A personalized diet plan based on the user inputs.'),
  groceryList: z.string().describe('A grocery list for the recommended diet plan.'),
  nutritionalInformation:
    z.string().describe('Nutritional information for the diet plan.'),
});

export type DietPlanOutput = z.infer<typeof DietPlanOutputSchema>;

export async function recommendDietPlan(
  input: DietPlanInput
): Promise<DietPlanOutput> {
  return recommendDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dietPlanPrompt',
  input: {schema: DietPlanInputSchema},
  output: {schema: DietPlanOutputSchema},
  prompt: `You are an AI Dietician that recommends personalized diet plans based on the user's BMI, weight goals, and dietary preferences.

  BMI: {{{bmi}}}
  Weight Goal: {{{weightGoal}}}
  Dietary Preferences: {{{dietaryPreferences}}}
  User History: {{{userHistory}}}

  Generate a personalized diet plan, a grocery list for the diet plan, and nutritional information for the diet plan.`,
});

const recommendDietPlanFlow = ai.defineFlow(
  {
    name: 'recommendDietPlanFlow',
    inputSchema: DietPlanInputSchema,
    outputSchema: DietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
