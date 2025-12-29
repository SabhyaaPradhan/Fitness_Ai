/**
 * @fileOverview Schemas and types for the gym recommender flow.
 *
 * - GymRecommenderInput - The input type for the recommendGyms function.
 * - GymRecommenderOutput - The return type for the recommendGyms function.
 */

import { z } from 'zod';

export const GymRecommenderInputSchema = z.object({
  goals: z.string().describe('The user’s fitness goals (e.g., "weight loss", "muscle gain").'),
  location: z.string().describe('The user’s current location (e.g., "San Francisco, CA").'),
  preferences: z.string().optional().describe('User’s preferences like "yoga", "HIIT", "group classes".'),
  history: z.string().optional().describe('User\'s past workout history, including liked/disliked activities and gyms.'),
});
export type GymRecommenderInput = z.infer<typeof GymRecommenderInputSchema>;

const RecommendationSchema = z.object({
  name: z.string().describe('The name of the gym, program, or challenge.'),
  type: z.enum(['Gym', 'Workout Program', 'Fitness Challenge']).describe('The type of recommendation.'),
  description: z.string().describe('A brief description of why this is a good recommendation for the user.'),
  location: z.string().optional().describe('The address or area for a physical gym.'),
});

export const GymRecommenderOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).describe('A list of recommendations.'),
});
export type GymRecommenderOutput = z.infer<typeof GymRecommenderOutputSchema>;
