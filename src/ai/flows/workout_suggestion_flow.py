"""
This module defines a function for suggesting the next workout exercise based on workout history and user query.

- `suggest_next_exercise`: A function that suggests an exercise based on workout history and user query.
- `WorkoutSuggestionInput`: The input type for the `suggest_next_exercise` function.
- `WorkoutSuggestionOutput`: The return type for the `suggest_next_exercise` function.
"""

from pydantic import BaseModel, Field
from typing import List

class WorkoutSuggestionInput(BaseModel):
    previous_exercises: List[str] = Field(..., description="A list of exercises the user has already completed in this session.")
    user_query: str = Field(..., description="The user's question or request, e.g., 'What should I do next?' or 'I want to work on my chest.'")

class WorkoutSuggestionOutput(BaseModel):
    recommendation: str = Field(..., description="A clear, concise recommendation for the next exercise, including why it's a good choice.")

def suggest_next_exercise(input: WorkoutSuggestionInput) -> WorkoutSuggestionOutput:
    """
    Suggests the next workout exercise based on workout history and user query.

    Args:
        input (WorkoutSuggestionInput): The input data for generating the suggestion.

    Returns:
        WorkoutSuggestionOutput: The generated exercise recommendation.
    """
    # Simulate AI-based exercise suggestion
    return WorkoutSuggestionOutput(
        recommendation="A good next move would be 3 sets of dumbbell bench presses to target your chest. It complements the bicep curls you just did."
    )

# Example usage
if __name__ == "__main__":
    example_input = WorkoutSuggestionInput(
        previous_exercises=["bicep curls", "tricep dips"],
        user_query="I want to work on my chest."
    )
    result = suggest_next_exercise(example_input)
    print(result.json(indent=4))