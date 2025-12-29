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
    const output = await recommendDietPlan(input);
    return output;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get diet plan recommendation.');
  }
}

export async function getFoodNutritionAction(input: FoodNutritionInput) {
  try {
    const output = await getFoodNutrition(input);
    return output;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get food nutrition information.');
  }
}
