export type PredictWorkoutSkippingInput = {
  behavioral_data: string;
  current_motivation_level: string;
  schedule: string;
};

export type PredictWorkoutSkippingOutput = {
  skip_prediction: boolean;
  motivation_nudge: string;
  adjusted_schedule_suggestion?: string;
};

export async function predictWorkoutSkipping(input: PredictWorkoutSkippingInput): Promise<PredictWorkoutSkippingOutput> {
  try {
    const response = await fetch('http://localhost:10001/api/predict-workout-skipping', {
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
    console.error('Error calling predict workout skipping API:', error);
    // Fallback to sample data if API is not available
    return {
      skip_prediction: false,
      motivation_nudge: "Keep up the great work! You're doing amazing.",
      adjusted_schedule_suggestion: "Consider adding variety to your routine."
    };
  }
}
