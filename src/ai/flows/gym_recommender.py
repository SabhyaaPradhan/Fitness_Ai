"""
This module defines a function for recommending gyms, workout programs, and fitness challenges based on user preferences.

- `recommend_gyms`: A function that suggests fitness options based on user preferences.
"""

from pydantic import BaseModel, Field
from typing import List

class GymRecommenderInput(BaseModel):
    goals: str = Field(..., description="The user's fitness goals.")
    location: str = Field(..., description="The user's location.")
    preferences: str = Field(..., description="The user's preferences for gyms or workout programs.")
    history: str = Field(..., description="The user's workout history.")

class GymRecommenderOutput(BaseModel):
    recommendations: List[str] = Field(..., description="A list of recommended gyms, workout programs, or fitness challenges.")

def recommend_gyms(input: GymRecommenderInput) -> GymRecommenderOutput:
    """
    Recommends gyms, workout programs, and fitness challenges based on user preferences.

    Args:
        input (GymRecommenderInput): The input data for generating recommendations.

    Returns:
        GymRecommenderOutput: The generated recommendations.
    """
    # Simulate AI-based recommendation logic
    return GymRecommenderOutput(
        recommendations=[
            "Gym A - Close to your location",
            "Yoga Program - Suitable for relaxation",
            "Fitness Challenge - 30-day weight loss program"
        ]
    )

# Example usage
if __name__ == "__main__":
    example_input = GymRecommenderInput(
        goals="Lose weight",
        location="Downtown",
        preferences="Yoga, Cardio",
        history="Attended Gym B for 6 months."
    )
    result = recommend_gyms(example_input)
    print(result.json(indent=4))