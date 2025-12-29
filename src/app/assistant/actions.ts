'use server';

import {
  getSmartAssistantFeedback,
  type SmartAssistantInput,
} from '@/ai/flows/smart-assistant-flow';

export async function getSmartAssistantFeedbackAction(
  input: SmartAssistantInput
) {
  try {
    const output = await getSmartAssistantFeedback(input);
    return output;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get smart assistant feedback.');
  }
}
