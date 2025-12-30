export type SmartAssistantInput = {
  workout_type: string;
  current_set: number;
  rep_count: number;
  heart_rate?: number;
  time_under_tension?: number;
  weight_lifted?: string;
  perceived_exertion: string;
};

export type SmartAssistantOutput = {
  intensity_recommendation: string;
  rest_suggestion: string;
  motivational_nudge: string;
};

export async function getSmartAssistantFeedback(input: SmartAssistantInput): Promise<SmartAssistantOutput> {
  try {
    const response = await fetch('http://localhost:10000/api/smart-assistant-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling smart assistant API:', error);
    // Fallback to sample data if API is not available
    return {
      intensity_recommendation: "Maintain current intensity.",
      rest_suggestion: "Take a 60-second rest before the next set.",
      motivational_nudge: "You're doing great! Keep pushing forward."
    };
  }
}
