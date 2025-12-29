'use server';

/**
 * @fileOverview A conversational AI flow for suggesting the next workout exercise.
 *
 * - suggestNextExercise - A function that suggests an exercise based on workout history and user query.
 * - WorkoutSuggestionInput - The input type for the suggestNextExercise function.
 * - WorkoutSuggestionOutput - The return type for the suggestNextExercise function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WorkoutSuggestionInputSchema = z.object({
  previousExercises: z.array(z.string()).describe('A list of exercises the user has already completed in this session.'),
  userQuery: z.string().describe('The user\'s question or request, e.g., "What should I do next?" or "I want to work on my chest."'),
});
export type WorkoutSuggestionInput = z.infer<typeof WorkoutSuggestionInputSchema>;


const WorkoutSuggestionOutputSchema = z.object({
  recommendation: z.string().describe('A clear, concise recommendation for the next exercise, including why it\'s a good choice. For example: "A good next move would be 3 sets of dumbbell bench presses to target your chest. It complements the bicep curls you just did."'),
});
export type WorkoutSuggestionOutput = z.infer<typeof WorkoutSuggestionOutputSchema>;


export async function suggestNextExercise(
  input: WorkoutSuggestionInput
): Promise<WorkoutSuggestionOutput> {
  return suggestNextExerciseFlow(input);
}


const suggestNextExercisePrompt = ai.definePrompt({
  name: 'suggestNextExercisePrompt',
  input: { schema: WorkoutSuggestionInputSchema },
  output: { schema: WorkoutSuggestionOutputSchema },
  prompt: `You are an expert AI personal trainer. A user is asking for a recommendation for their next exercise.

You should provide a suggestion that is logical and complementary to their current workout session. Be encouraging and provide a brief reason for your choice.

Workout Context:
- Exercises already completed: {{{previousExercises}}}

User's Request:
"{{{userQuery}}}"

Based on the context and request, provide a single, actionable exercise recommendation.`,
});

const suggestNextExerciseFlow = ai.defineFlow(
  {
    name: 'suggestNextExerciseFlow',
    inputSchema: WorkoutSuggestionInputSchema,
    outputSchema: WorkoutSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await suggestNextExercisePrompt(input);
    return output!;
  }
);
