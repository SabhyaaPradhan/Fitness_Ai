'use server';

import {
  getMotivationalFitnessUpdate,
  type MotivationalFitnessUpdateInput,
} from '@/ai/flows/motivational-fitness-updates';

export async function getMotivationalFitnessUpdateAction(
  input: MotivationalFitnessUpdateInput
) {
  try {
    const output = await getMotivationalFitnessUpdate(input);
    return output;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get motivational fitness update.');
  }
}
