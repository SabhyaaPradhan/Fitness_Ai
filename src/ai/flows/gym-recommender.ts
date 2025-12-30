export type GymRecommenderInput = {
  goals: string;
  location: string;
  preferences: string;
  history: string;
};

export type GymRecommenderOutput = {
  recommendations: string[];
};

export async function recommendGyms(input: GymRecommenderInput): Promise<GymRecommenderOutput> {
  try {
    const response = await fetch('http://localhost:10001/api/recommend-gyms', {
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
    console.error('Error calling recommend gyms API:', error);
    // Fallback to sample data if API is not available
    return {
      recommendations: [
        "Gym A - Close to your location",
        "Yoga Program - Suitable for relaxation",
        "Fitness Challenge - 30-day weight loss program"
      ]
    };
  }
}
