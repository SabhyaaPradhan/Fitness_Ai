"""
This module defines a function for providing real-time workout feedback and recommendations.

- `get_smart_assistant_feedback`: A function that provides real-time workout feedback and recommendations.
- `SmartAssistantInput`: The input type for the `get_smart_assistant_feedback` function.
- `SmartAssistantOutput`: The return type for the `get_smart_assistant_feedback` function.
"""

from pydantic import BaseModel, Field
from typing import Optional

class SmartAssistantInput(BaseModel):
    workout_type: str = Field(..., description="The type of workout being performed.")
    current_set: int = Field(..., description="The current set number.")
    rep_count: int = Field(..., description="The number of reps completed in the current set.")
    heart_rate: Optional[int] = Field(None, description="The user's heart rate in beats per minute (BPM).")
    time_under_tension: Optional[int] = Field(None, description="The total time under tension for the set in seconds.")
    weight_lifted: Optional[str] = Field(None, description="The weight lifted for the set, including units (e.g., '150 lbs', '70 kg').")
    perceived_exertion: str = Field(..., description="User's subjective feeling of exertion.")

class SmartAssistantOutput(BaseModel):
    intensity_recommendation: str = Field(..., description="Recommendation to increase, decrease, or maintain intensity.")
    rest_suggestion: str = Field(..., description="Suggested rest time before the next set.")
    motivational_nudge: str = Field(..., description="A contextual motivational message.")

def get_smart_assistant_feedback(input: SmartAssistantInput) -> SmartAssistantOutput:
    """
    Provides real-time workout feedback and recommendations.

    Args:
        input (SmartAssistantInput): The input data for generating feedback.

    Returns:
        SmartAssistantOutput: The generated feedback and recommendations.
    """
    # Simulate AI-based feedback generation
    return SmartAssistantOutput(
        intensity_recommendation="Maintain current intensity.",
        rest_suggestion="Take a 60-second rest before the next set.",
        motivational_nudge="You're doing great! Keep pushing forward."
    )

# Example usage
if __name__ == "__main__":
    example_input = SmartAssistantInput(
        workout_type="bench press",
        current_set=2,
        rep_count=10,
        heart_rate=120,
        time_under_tension=30,
        weight_lifted="150 lbs",
        perceived_exertion="Challenging but manageable."
    )
    result = get_smart_assistant_feedback(example_input)
    print(result.json(indent=4))