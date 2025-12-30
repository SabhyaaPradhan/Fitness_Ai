'use server';

import {
  predictWorkoutSkipping,
  type PredictWorkoutSkippingInput,
} from '@/ai/flows/predict-workout-skipping';

export async function predictWorkoutSkippingAction(
  input: PredictWorkoutSkippingInput
) {
  try {
    // Log the request payload
    console.log("Request payload for predictWorkoutSkipping:", input);

    const output = await predictWorkoutSkipping(input);

    // Log the raw output
    console.log("Raw output from predictWorkoutSkipping:", output);

    if (!output || typeof output.skip_prediction !== 'boolean') {
      console.error("Missing expected fields in predictWorkoutSkipping output:", output);
      throw new Error("Invalid response from predictWorkoutSkipping.");
    }

    return output;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get workout skipping prediction.');
  }
}
