export type WorkoutSuggestionInput = {
  userId: string;
  currentWorkout: string;
};

export type WorkoutSuggestionOutput = {
  suggestion: string;
};

export async function suggestNextExercise(input: WorkoutSuggestionInput): Promise<WorkoutSuggestionOutput> {
  try {
    const response = await fetch('http://localhost:10000/api/workout-suggestion', {
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
    console.error('Error calling workout suggestion API:', error);
    // Fallback to sample data if API is not available
    return { suggestion: "Sample workout suggestion." };
  }
}
