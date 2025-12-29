'use server';

/**
 * @fileOverview A Genkit flow for retrieving nutritional information for a specific food item.
 *
 * - `getFoodNutrition`: A function that takes a food name and returns its nutritional data.
 * - `FoodNutritionInput`: The input type for the `getFoodNutrition` function.
 * - `FoodNutritionOutput`: The output type for the `getFoodNutrition` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FoodNutritionInputSchema = z.object({
  foodName: z.string().describe('The name of the food item to look up.'),
});

export type FoodNutritionInput = z.infer<typeof FoodNutritionInputSchema>;

const FoodNutritionOutputSchema = z.object({
  foodName: z.string().describe('The name of the food item.'),
  calories: z.string().describe('The number of calories, including units (e.g., "150 kcal").'),
  protein: z.string().describe('The amount of protein, including units (e.g., "25g").'),
  carbs: z.string().describe('The amount of carbohydrates, including units (e.g., "5g").'),
  fats: z.string().describe('The amount of fat, including units (e.g., "10g").'),
});

export type FoodNutritionOutput = z.infer<typeof FoodNutritionOutputSchema>;

export async function getFoodNutrition(
  input: FoodNutritionInput
): Promise<FoodNutritionOutput> {
  return getFoodNutritionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'foodNutritionPrompt',
  input: {schema: FoodNutritionInputSchema},
  output: {schema: FoodNutritionOutputSchema},
  prompt: `You are a nutritional database. Given a food name, provide the estimated nutritional information for a standard serving size.

  Food Name: {{{foodName}}}

  Return the calories, protein, carbohydrates, and fats. Include units for each value (e.g., kcal, g).
  If the food name is ambiguous, make a reasonable assumption (e.g., "apple" refers to a medium-sized raw apple).
  
  The foodName in the output should be the same as the input foodName.`,
});

const getFoodNutritionFlow = ai.defineFlow(
  {
    name: 'getFoodNutritionFlow',
    inputSchema: FoodNutritionInputSchema,
    outputSchema: FoodNutritionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
