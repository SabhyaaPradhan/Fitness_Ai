'use server';

import {
  predictWorkoutSkipping,
  type PredictWorkoutSkippingInput,
} from '@/ai/flows/predict-workout-skipping';

export async function predictWorkoutSkippingAction(
  input: PredictWorkoutSkippingInput
) {
  try {
    const output = await predictWorkoutSkipping(input);
    return output;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get workout skipping prediction.');
  }
}
