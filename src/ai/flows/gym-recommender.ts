'use server';

/**
 * @fileOverview A recommendation engine for gyms, workout programs, and fitness challenges.
 *
 * - recommendGyms - A function that suggests fitness options based on user preferences.
 */

import { ai } from '@/ai/genkit';
import {
    GymRecommenderInput,
    GymRecommenderInputSchema,
    GymRecommenderOutput,
    GymRecommenderOutputSchema
} from '@/ai/schemas/gym-recommender-schemas';

export async function recommendGyms(input: GymRecommenderInput): Promise<GymRecommenderOutput> {
  return gymRecommenderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gymRecommenderPrompt',
  input: { schema: GymRecommenderInputSchema },
  output: { schema: GymRecommenderOutputSchema },
  prompt: `You are a fitness recommendation expert. Based on the user's goals, location, preferences, and workout history, suggest a mix of nearby gyms, workout programs, and fitness challenges.

User Goals: {{{goals}}}
User Location: {{{location}}}
User Preferences: {{{preferences}}}
User History: {{{history}}}

Provide a diverse list of recommendations. For gyms, include their general location.
Output a valid JSON object with the given schema.`,
});

const gymRecommenderFlow = ai.defineFlow(
  {
    name: 'gymRecommenderFlow',
    inputSchema: GymRecommenderInputSchema,
    outputSchema: GymRecommenderOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
