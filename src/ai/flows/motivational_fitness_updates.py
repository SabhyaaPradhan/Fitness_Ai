"""
This module defines a function for generating motivational fitness updates and personalized guidance.

- `get_motivational_fitness_update`: A function that generates a motivational fitness update.
- `MotivationalFitnessUpdateInput`: The input type for the `get_motivational_fitness_update` function.
- `MotivationalFitnessUpdateOutput`: The return type for the `get_motivational_fitness_update` function.
"""

from pydantic import BaseModel, Field

class MotivationalFitnessUpdateInput(BaseModel):
    user_message: str = Field(..., description="The user's message describing how they feel or their current situation.")

class MotivationalFitnessUpdateOutput(BaseModel):
    motivational_message: str = Field(..., description="A friendly, supportive, and motivational message responding directly to the user.")
    personalized_guidance: str = Field(..., description="A short, actionable piece of advice or guidance based on the user's message.")

def get_motivational_fitness_update(input: MotivationalFitnessUpdateInput) -> MotivationalFitnessUpdateOutput:
    """
    Generates a motivational fitness update based on the user's input.

    Args:
        input (MotivationalFitnessUpdateInput): The input data containing the user's message.

    Returns:
        MotivationalFitnessUpdateOutput: The motivational message and personalized guidance.
    """
    # Simulate AI-based motivational message generation
    return MotivationalFitnessUpdateOutput(
        motivational_message="Hey, it's totally okay to feel that way! Some days are just tougher than others. Don't be too hard on yourself.",
        personalized_guidance="How about we just aim for a quick 10-minute walk? Just to get the body moving a little. No pressure!"
    )

# Example usage
if __name__ == "__main__":
    example_input = MotivationalFitnessUpdateInput(user_message="I feel so lazy and tired today, don't feel like working out.")
    result = get_motivational_fitness_update(example_input)
    print(result.json(indent=4))