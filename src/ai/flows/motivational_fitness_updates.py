"""
This module defines a function for generating motivational fitness updates and personalized guidance using Gemini AI.

- `get_motivational_fitness_update`: A function that generates a motivational fitness update.
- `MotivationalFitnessUpdateInput`: The input type for the `get_motivational_fitness_update` function.
- `MotivationalFitnessUpdateOutput`: The return type for the `get_motivational_fitness_update` function.
"""

import google.generativeai as genai
from pydantic import BaseModel, Field

# Configure Gemini API
genai.configure(api_key="AIzaSyBJ5Yf79ZbUG8_Xvm7Njs9lvjAbx9QH3K4")
model = genai.GenerativeModel('gemini-pro')

class MotivationalFitnessUpdateInput(BaseModel):
    user_message: str = Field(..., description="The user's message describing how they feel or their current situation.")

class MotivationalFitnessUpdateOutput(BaseModel):
    motivational_message: str = Field(..., description="A friendly, supportive, and motivational message responding directly to the user.")
    personalized_guidance: str = Field(..., description="A short, actionable piece of advice or guidance based on the user's message.")

def get_motivational_fitness_update(input: MotivationalFitnessUpdateInput) -> MotivationalFitnessUpdateOutput:
    """
    Generates a motivational fitness update based on the user's input using Gemini AI.

    Args:
        input (MotivationalFitnessUpdateInput): The input data containing the user's message.

    Returns:
        MotivationalFitnessUpdateOutput: The motivational message and personalized guidance.
    """
    try:
        prompt = f"""
        The user said: "{input.user_message}"

        As a friendly fitness buddy, provide:
        1. A supportive and motivational message responding directly to the user's feelings.
        2. A short, actionable piece of guidance or advice tailored to their situation.

        Keep the response encouraging, positive, and realistic. Format the output as JSON with keys "motivational_message" and "personalized_guidance".
        """

        response = model.generate_content(prompt)
        result_text = response.text.strip()

        # Parse the JSON response
        import json
        result = json.loads(result_text)

        return MotivationalFitnessUpdateOutput(
            motivational_message=result.get("motivational_message", "Hey, it's totally okay to feel that way! Some days are just tougher than others. Don't be too hard on yourself."),
            personalized_guidance=result.get("personalized_guidance", "How about we just aim for a quick 10-minute walk? Just to get the body moving a little. No pressure!")
        )
    except Exception as e:
        print(f"Error generating motivational update with Gemini: {e}")
        # Fallback to hardcoded response
        return MotivationalFitnessUpdateOutput(
            motivational_message="Hey, it's totally okay to feel that way! Some days are just tougher than others. Don't be too hard on yourself.",
            personalized_guidance="How about we just aim for a quick 10-minute walk? Just to get the body moving a little. No pressure!"
        )

# Example usage
if __name__ == "__main__":
    example_input = MotivationalFitnessUpdateInput(user_message="I feel so lazy and tired today, don't feel like working out.")
    result = get_motivational_fitness_update(example_input)
    print(result.json(indent=4))