"""
This module defines a function for providing personalized feedback on workout form and reps.

- `get_personalized_workout_feedback`: A function that provides personalized feedback on workout form and reps.
- `PersonalizedWorkoutFeedbackInput`: The input type for the `get_personalized_workout_feedback` function.
- `PersonalizedWorkoutFeedbackOutput`: The return type for the `get_personalized_workout_feedback` function.
"""

from pydantic import BaseModel, Field

class PersonalizedWorkoutFeedbackInput(BaseModel):
    workout_type: str = Field(..., description="The type of workout being performed (e.g., squats, push-ups).")
    photo_data_uri: str = Field(..., description="A photo of the user performing the exercise, as a data URI.")
    target_muscle_groups: str = Field(..., description="The muscle groups targeted by the exercise.")

class PersonalizedWorkoutFeedbackOutput(BaseModel):
    form_feedback: str = Field(..., description="Specific feedback on the user’s form, including corrections and areas for improvement.")
    rep_feedback: str = Field(..., description="Feedback on the user’s repetition count and consistency.")
    performance_score: int = Field(..., description="An overall performance score for the current posture, out of 100.")
    motivational_message: str = Field(..., description="A short motivational message to encourage the user.")

def get_personalized_workout_feedback(input: PersonalizedWorkoutFeedbackInput) -> PersonalizedWorkoutFeedbackOutput:
    """
    Provides personalized feedback on workout form and reps.

    Args:
        input (PersonalizedWorkoutFeedbackInput): The input data for generating feedback.

    Returns:
        PersonalizedWorkoutFeedbackOutput: The generated feedback and motivational message.
    """
    # Simulate AI-based feedback generation
    return PersonalizedWorkoutFeedbackOutput(
        form_feedback="Keep your back straight and engage your core.",
        rep_feedback="Good consistency in your reps. Maintain this form throughout.",
        performance_score=85,
        motivational_message="Great job! You're doing amazing. Keep it up!"
    )

# Example usage
if __name__ == "__main__":
    example_input = PersonalizedWorkoutFeedbackInput(
        workout_type="squats",
        photo_data_uri="data:image/jpeg;base64,...",
        target_muscle_groups="quads, glutes"
    )
    result = get_personalized_workout_feedback(example_input)
    print(result.json(indent=4))