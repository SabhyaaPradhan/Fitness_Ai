'use server';

import {
  recommendGyms,
  type GymRecommenderInput,
} from '@/ai/flows/gym-recommender';

export async function getGymRecommendationsAction(input: GymRecommenderInput) {
  try {
    // Log the request payload
    console.log("Request payload for getGymRecommendations:", input);

    const output = await recommendGyms(input);

    // Log the raw output
    console.log("Raw output from getGymRecommendations:", output);

    if (!output || !output.recommendations) {
      console.error("Missing expected fields in getGymRecommendations output:", output);
      throw new Error("Invalid response from getGymRecommendations.");
    }

    return output;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get gym recommendations.');
  }
}
