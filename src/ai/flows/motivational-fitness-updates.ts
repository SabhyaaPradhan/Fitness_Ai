export type MotivationalFitnessUpdateInput = {
  user_message: string;
};

export type MotivationalFitnessUpdateOutput = {
  motivational_message: string;
  personalized_guidance: string;
};

export async function getMotivationalFitnessUpdate(input: MotivationalFitnessUpdateInput): Promise<MotivationalFitnessUpdateOutput> {
  try {
    const response = await fetch('http://localhost:10000/api/motivational-fitness-update', {
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
    console.error('Error calling motivational fitness update API:', error);
    // Fallback to sample data if API is not available
    return {
      motivational_message: "Hey, it's totally okay to feel that way! Some days are just tougher than others. Don't be too hard on yourself.",
      personalized_guidance: "How about we just aim for a quick 10-minute walk? Just to get the body moving a little. No pressure!"
    };
  }
}
