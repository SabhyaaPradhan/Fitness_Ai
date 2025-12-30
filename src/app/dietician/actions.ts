'use server';

import {
  recommendDietPlan,
  type DietPlanInput,
} from '@/ai/flows/diet-plan-recommendations';
import { 
  getFoodNutrition,
  type FoodNutritionInput
} from '@/ai/flows/food-nutrition-flow';

export async function recommendDietPlanAction(input: DietPlanInput) {
  try {
    // Log the request payload
    console.log("Request payload for recommendDietPlan:", input);

    const output = await recommendDietPlan(input);

    // Log the raw output
    console.log("Raw output from recommendDietPlan:", output);

    if (!output || !output.diet_plan) {
      console.error("Missing expected fields in recommendDietPlan output:", output);
      throw new Error("Invalid response from recommendDietPlan.");
    }

    return output;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get diet plan recommendation.');
  }
}

export async function getFoodNutritionAction(input: FoodNutritionInput) {
  try {
    // Log the request payload
    console.log("Request payload for getFoodNutrition:", input);

    const output = await getFoodNutrition(input);

    // Log the raw output
    console.log("Raw output from getFoodNutrition:", output);

    if (!output || !output.calories) {
      console.error("Missing expected fields in getFoodNutrition output:", output);
      throw new Error("Invalid response from getFoodNutrition.");
    }

    return output;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get food nutrition information.');
  }
}
