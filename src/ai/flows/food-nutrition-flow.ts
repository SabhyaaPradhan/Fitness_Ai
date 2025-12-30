export type FoodNutritionInput = {
  food_name: string;
};

export type FoodNutritionOutput = {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export async function getFoodNutrition(input: FoodNutritionInput): Promise<FoodNutritionOutput> {
  try {
    const response = await fetch('http://localhost:10000/api/food-nutrition', {
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
    console.error('Error calling food nutrition API:', error);
    // Fallback to sample data if API is not available
    return {
      foodName: input.food_name,
      calories: 100,
      protein: 10,
      carbs: 20,
      fats: 5
    };
  }
}
