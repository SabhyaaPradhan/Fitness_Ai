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
    const output = await getPersonalizedWorkoutFeedback(input);
    return output;
  } catch (error) {
    console.error(error);
    // In a real app, you might want to throw a more specific error
    // or handle different error cases from the AI flow.
    throw new Error('Failed to get personalized workout feedback.');
  }
}

export async function suggestNextExerciseAction(input: WorkoutSuggestionInput) {
  try {
    const output = await suggestNextExercise(input);
    return output;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get exercise suggestion.');
  }
}
