'use server';

import {
  recommendGyms,
} from '@/ai/flows/gym-recommender';
import { GymRecommenderInput } from '@/ai/schemas/gym-recommender-schemas';

export async function getGymRecommendationsAction(input: GymRecommenderInput) {
  try {
    const output = await recommendGyms(input);
    return output;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get gym recommendations.');
  }
}
