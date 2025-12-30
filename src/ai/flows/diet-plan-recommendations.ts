export type DietPlanInput = {
  bmi: number;
  weight_goal: string;
  dietary_preferences: string;
  user_history?: string;
};

export type DietPlanOutput = {
  diet_plan: string;
  grocery_list: string;
  nutritional_information: string;
};

export async function recommendDietPlan(input: DietPlanInput): Promise<DietPlanOutput> {
  try {
    const response = await fetch('http://localhost:10001/api/recommend-diet-plan', {
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
    console.error('Error calling diet plan API:', error);
    // Fallback to sample data if API is not available
    return {
      diet_plan: `Personalized diet plan for BMI ${input.bmi}, goal: ${input.weight_goal}, preferences: ${input.dietary_preferences}`,
      grocery_list: "Sample grocery list based on the diet plan.",
      nutritional_information: "Sample nutritional information for the diet plan."
    };
  }
}
