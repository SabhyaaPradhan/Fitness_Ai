"""
This module defines a function for recommending personalized diet plans based on user inputs like BMI, weight goals, and dietary preferences.

- `recommend_diet_plan`: A function that takes user information and returns a personalized diet plan.
- `DietPlanInput`: The input type for the `recommend_diet_plan` function.
- `DietPlanOutput`: The output type for the `recommend_diet_plan` function.
"""

from pydantic import BaseModel, Field
from typing import Optional

class DietPlanInput(BaseModel):
    bmi: float = Field(..., description="The user’s Body Mass Index (BMI).")
    weight_goal: str = Field(..., description="The user’s weight goal, e.g., lose weight, maintain weight, gain weight.")
    dietary_preferences: str = Field(..., description="The user’s dietary preferences, e.g., vegetarian, vegan, gluten-free.")
    user_history: Optional[str] = Field(None, description="The user’s historical diet data and feedback.")

class DietPlanOutput(BaseModel):
    diet_plan: str = Field(..., description="A personalized diet plan based on the user inputs.")
    grocery_list: str = Field(..., description="A grocery list for the recommended diet plan.")
    nutritional_information: str = Field(..., description="Nutritional information for the diet plan.")

def recommend_diet_plan(input: DietPlanInput) -> DietPlanOutput:
    """
    Recommends a personalized diet plan based on the user's input.

    Args:
        input (DietPlanInput): The input data for generating the diet plan.

    Returns:
        DietPlanOutput: The generated diet plan, grocery list, and nutritional information.
    """
    # Simulate AI-based recommendation logic
    diet_plan = f"Personalized diet plan for BMI {input.bmi}, goal: {input.weight_goal}, preferences: {input.dietary_preferences}"
    grocery_list = "Sample grocery list based on the diet plan."
    nutritional_information = "Sample nutritional information for the diet plan."

    return DietPlanOutput(
        diet_plan=diet_plan,
        grocery_list=grocery_list,
        nutritional_information=nutritional_information
    )

# Example usage
if __name__ == "__main__":
    example_input = DietPlanInput(
        bmi=22.5,
        weight_goal="lose weight",
        dietary_preferences="vegetarian",
        user_history="Previously followed a high-protein diet."
    )

    result = recommend_diet_plan(example_input)
    print(result.json(indent=4))