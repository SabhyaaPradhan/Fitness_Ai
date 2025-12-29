'use server';

/**
 * @fileOverview A personalized workout feedback AI agent.
 *
 * - getPersonalizedWorkoutFeedback - A function that provides personalized feedback on workout form and reps.
 * - PersonalizedWorkoutFeedbackInput - The input type for the getPersonalizedWorkoutFeedback function.
 * - PersonalizedWorkoutFeedbackOutput - The return type for the getPersonalizedWorkoutFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const PersonalizedWorkoutFeedbackInputSchema = z.object({
  workoutType: z.string().describe('The type of workout being performed (e.g., squats, push-ups).'),
  photoDataUri: z.string().describe("A photo of the user performing the exercise, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  targetMuscleGroups: z.string().describe('The muscle groups targeted by the exercise.'),
});
export type PersonalizedWorkoutFeedbackInput = z.infer<
  typeof PersonalizedWorkoutFeedbackInputSchema
>;

const PersonalizedWorkoutFeedbackOutputSchema = z.object({
  formFeedback: z.string().describe('Specific feedback on the user’s form, including corrections and areas for improvement.'),
  repFeedback: z.string().describe('Feedback on the user’s repetition count and consistency. Since this is a single frame, comment on the current form and how to maintain it for the full set.'),
  performanceScore: z.number().describe('An overall performance score for the current posture, out of 100.'),
  motivationalMessage: z.string().describe('A short motivational message to encourage the user.'),
});
export type PersonalizedWorkoutFeedbackOutput = z.infer<
  typeof PersonalizedWorkoutFeedbackOutputSchema
>;

export async function getPersonalizedWorkoutFeedback(
  input: PersonalizedWorkoutFeedbackInput
): Promise<PersonalizedWorkoutFeedbackOutput> {
  return personalizedWorkoutFeedbackFlow(input);
}

const personalizedWorkoutFeedbackPrompt = ai.definePrompt({
  name: 'personalizedWorkoutFeedbackPrompt',
  input: {schema: PersonalizedWorkoutFeedbackInputSchema},
  output: {schema: PersonalizedWorkoutFeedbackOutputSchema},
  prompt: `You are an AI Smart Gym Assistant providing real-time feedback to users during their workouts by analyzing a still image.

  Based on the user's posture in the provided photo, the workout type, and targeted muscle groups, provide specific feedback on their form.
  
  Workout Type: {{{workoutType}}}
  Target Muscle Groups: {{{targetMuscleGroups}}}
  User's Pose: {{media url=photoDataUri}}

  Analyze the user's pose in the image for the given exercise.

  Form Feedback: Focus on specific corrections and areas for improvement. For a squat, you might check if their back is straight, if their knees are behind their toes, and if their depth is good. Give detailed, actionable advice. If the form is good, confirm it.
  Rep Feedback: You are analyzing a single frame. Comment on how to maintain this form for an entire set of reps. For example, "This is a good position. Focus on keeping your core engaged like this for all reps." or "Your back is a bit rounded. Try to keep it straight through the entire movement."
  Performance Score: Calculate a score out of 100 based on the quality of their current form in the image. A perfect squat form would be 100. A dangerously rounded back might be 30.
  Motivational Message: Encourage the user to maintain good form or to correct their form to get the most out of their workout and avoid injury.

  Ensure that the feedback is concise, actionable, and motivating.
  Output the data as a valid JSON object with the given schema.
  `,
});

const personalizedWorkoutFeedbackFlow = ai.defineFlow(
  {
    name: 'personalizedWorkoutFeedbackFlow',
    inputSchema: PersonalizedWorkoutFeedbackInputSchema,
    outputSchema: PersonalizedWorkoutFeedbackOutputSchema,
  },
  async input => {
    const {output} = await personalizedWorkoutFeedbackPrompt(input);
    return output!;
  }
);
