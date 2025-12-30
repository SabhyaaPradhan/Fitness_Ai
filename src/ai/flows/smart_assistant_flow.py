"""
This module defines a function for providing real-time workout feedback and recommendations.

- `get_smart_assistant_feedback`: A function that provides real-time workout feedback and recommendations.
- `SmartAssistantInput`: The input type for the `get_smart_assistant_feedback` function.
- `SmartAssistantOutput`: The return type for the `get_smart_assistant_feedback` function.
"""

from pydantic import BaseModel, Field
from typing import Optional
import openai
import os

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

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
    try:
        if not openai.api_key:
            # Fallback to intelligent hardcoded responses based on input
            return _generate_fallback_feedback(input)

        client = openai.OpenAI()
        prompt = f"""
        Analyze this workout set and provide real-time feedback:

        Workout: {input.workout_type}
        Set: {input.current_set}
        Reps completed: {input.rep_count}
        {f"Heart rate: {input.heart_rate} BPM" if input.heart_rate else ""}
        {f"Time under tension: {input.time_under_tension} seconds" if input.time_under_tension else ""}
        {f"Weight lifted: {input.weight_lifted}" if input.weight_lifted else ""}
        Perceived exertion: {input.perceived_exertion}

        Provide:
        1. Intensity recommendation (increase, decrease, or maintain intensity)
        2. Rest suggestion (specific time recommendation)
        3. Motivational nudge (encouraging message)

        Keep responses concise and actionable. Base recommendations on standard fitness principles.
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.7
        )

        ai_response = response.choices[0].message.content.strip()

        # Parse the AI response
        lines = ai_response.split('\n')
        intensity_rec = ""
        rest_suggestion = ""
        motivational_nudge = ""

        for line in lines:
            line = line.strip()
            if any(word in line.lower() for word in ['intensity', 'recommendation', 'increase', 'decrease', 'maintain']):
                intensity_rec = line
            elif any(word in line.lower() for word in ['rest', 'recovery', 'break', 'pause']):
                rest_suggestion = line
            elif any(word in line.lower() for word in ['motivational', 'nudge', 'encouraging', 'great', 'keep']):
                motivational_nudge = line

        # Fallback if parsing fails
        if not intensity_rec:
            intensity_rec = "Maintain current intensity."
        if not rest_suggestion:
            rest_suggestion = "Take a 60-second rest before the next set."
        if not motivational_nudge:
            motivational_nudge = "You're doing great! Keep pushing forward."

        return SmartAssistantOutput(
            intensity_recommendation=intensity_rec,
            rest_suggestion=rest_suggestion,
            motivational_nudge=motivational_nudge
        )

    except Exception as e:
        print(f"AI generation failed: {e}")
        return _generate_fallback_feedback(input)

def _generate_fallback_feedback(input: SmartAssistantInput) -> SmartAssistantOutput:
    """Generate intelligent fallback feedback based on input data."""
    # Analyze perceived exertion for intensity recommendation
    exertion = input.perceived_exertion.lower()
    if any(word in exertion for word in ['easy', 'light', 'too easy']):
        intensity_rec = "Consider increasing intensity - try adding weight or more reps."
    elif any(word in exertion for word in ['hard', 'difficult', 'struggling', 'too hard']):
        intensity_rec = "Consider decreasing intensity - reduce weight or take more rest."
    else:
        intensity_rec = "Maintain current intensity - you're on the right track."

    # Rest suggestion based on set number and exertion
    if input.current_set <= 2:
        rest_suggestion = "Take a 60-90 second rest before the next set."
    elif any(word in exertion for word in ['hard', 'difficult']):
        rest_suggestion = "Take a 90-120 second rest to recover properly."
    else:
        rest_suggestion = "Take a 60-second rest before the next set."

    # Motivational nudge based on progress
    if input.rep_count >= 10:
        motivational_nudge = "Excellent rep count! You're building strength effectively."
    elif input.rep_count >= 6:
        motivational_nudge = "Good work! Keep focusing on proper form."
    else:
        motivational_nudge = "Stay focused on your form. Quality over quantity!"

    return SmartAssistantOutput(
        intensity_recommendation=intensity_rec,
        rest_suggestion=rest_suggestion,
        motivational_nudge=motivational_nudge
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