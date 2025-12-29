from fastapi import FastAPI
from src.ai.flows.food_nutrition_flow import get_food_nutrition, FoodNutritionInput
from src.ai.flows.gym_recommender import recommend_gyms, GymRecommenderInput
from src.ai.flows.motivational_fitness_updates import get_motivational_fitness_update, MotivationalFitnessUpdateInput
from src.ai.flows.personalized_workout_feedback import get_personalized_workout_feedback, PersonalizedWorkoutFeedbackInput
from src.ai.flows.predict_workout_skipping import predict_workout_skipping, PredictWorkoutSkippingInput
from src.ai.flows.smart_assistant_flow import get_smart_assistant_feedback, SmartAssistantInput
from src.ai.flows.workout_suggestion_flow import suggest_next_exercise, WorkoutSuggestionInput
import os

app = FastAPI()

@app.post("/api/food-nutrition")
def food_nutrition(input: FoodNutritionInput):
    return get_food_nutrition(input)

@app.post("/api/gym-recommendations")
def gym_recommendations(input: GymRecommenderInput):
    return recommend_gyms(input)

@app.post("/api/motivational-fitness-update")
def motivational_fitness_update(input: MotivationalFitnessUpdateInput):
    return get_motivational_fitness_update(input)

@app.post("/api/personalized-workout-feedback")
def personalized_workout_feedback(input: PersonalizedWorkoutFeedbackInput):
    return get_personalized_workout_feedback(input)

@app.post("/api/predict-workout-skipping")
def predict_workout_skipping(input: PredictWorkoutSkippingInput):
    return predict_workout_skipping(input)

@app.post("/api/smart-assistant-feedback")
def smart_assistant_feedback(input: SmartAssistantInput):
    return get_smart_assistant_feedback(input)

@app.post("/api/workout-suggestion")
def workout_suggestion(input: WorkoutSuggestionInput):
    return suggest_next_exercise(input)

# To run the server, use the command: uvicorn main:app --reload

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Default to 8000 if PORT is not set
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=port)