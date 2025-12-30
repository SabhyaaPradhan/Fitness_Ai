'use server';

import {
  getPersonalizedWorkoutFeedback,
  type PersonalizedWorkoutFeedbackInput,
} from '@/ai/flows/personalized-workout-feedback';
import { 
  suggestNextExercise,
  type WorkoutSuggestionInput 
} from '@/ai/flows/workout-suggestion-flow';

export async function getPersonalizedWorkoutFeedbackAction(
  input: PersonalizedWorkoutFeedbackInput
) {
  try {
    // Log the request payload
    console.log("Request payload for getPersonalizedWorkoutFeedback:", input);

    const output = await getPersonalizedWorkoutFeedback(input);

    // Log the raw output
    console.log("Raw output from getPersonalizedWorkoutFeedback:", output);

    if (!output || !output.feedback) {
      console.error("Missing expected fields in getPersonalizedWorkoutFeedback output:", output);
      throw new Error("Invalid response from getPersonalizedWorkoutFeedback.");
    }

    return output;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get personalized workout feedback.');
  }
}

export async function suggestNextExerciseAction(input: WorkoutSuggestionInput) {
  try {
    // Log the request payload
    console.log("Request payload for suggestNextExercise:", input);

    const output = await suggestNextExercise(input);

    // Log the raw output
    console.log("Raw output from suggestNextExercise:", output);

    if (!output || !output.suggestion) {
      console.error("Missing expected fields in suggestNextExercise output:", output);
      throw new Error("Invalid response from suggestNextExercise.");
    }

    return output;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get exercise suggestion.');
  }
}
