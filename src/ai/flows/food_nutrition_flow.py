"""
This module defines a function for retrieving nutritional information for a specific food item.

- `get_food_nutrition`: A function that takes a food name and returns its nutritional data.
- `FoodNutritionInput`: The input type for the `get_food_nutrition` function.
- `FoodNutritionOutput`: The output type for the `get_food_nutrition` function.
"""

from pydantic import BaseModel, Field

class FoodNutritionInput(BaseModel):
    food_name: str = Field(..., description="The name of the food item to look up.")

class FoodNutritionOutput(BaseModel):
    food_name: str = Field(..., description="The name of the food item.")
    calories: str = Field(..., description="The number of calories, including units (e.g., '150 kcal').")
    protein: str = Field(..., description="The amount of protein, including units (e.g., '25g').")
    carbs: str = Field(..., description="The amount of carbohydrates, including units (e.g., '5g').")
    fats: str = Field(..., description="The amount of fat, including units (e.g., '10g').")

def get_food_nutrition(input: FoodNutritionInput) -> FoodNutritionOutput:
    """
    Retrieves nutritional information for a specific food item.

    Args:
        input (FoodNutritionInput): The input data containing the food name.

    Returns:
        FoodNutritionOutput: The nutritional data for the food item.
    """
    # Simulate AI-based nutritional lookup
    return FoodNutritionOutput(
        food_name=input.food_name,
        calories="150 kcal",
        protein="25g",
        carbs="5g",
        fats="10g"
    )

# Example usage
if __name__ == "__main__":
    example_input = FoodNutritionInput(food_name="apple")
    result = get_food_nutrition(example_input)
    print(result.json(indent=4))