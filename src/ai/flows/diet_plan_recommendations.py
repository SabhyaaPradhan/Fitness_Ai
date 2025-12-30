"""
This module defines a function for recommending personalized diet plans based on user inputs like BMI, weight goals, and dietary preferences.

- `recommend_diet_plan`: A function that takes user information and returns a personalized diet plan.
- `DietPlanInput`: The input type for the `recommend_diet_plan` function.
- `DietPlanOutput`: The output type for the `recommend_diet_plan` function.
"""

from pydantic import BaseModel, Field
from typing import Optional
import openai
import os

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class DietPlanInput(BaseModel):
    bmi: float = Field(..., description="The user's Body Mass Index (BMI).")
    weight_goal: str = Field(..., description="The user's weight goal, e.g., lose weight, maintain weight, gain weight.")
    dietary_preferences: str = Field(..., description="The user's dietary preferences, e.g., vegetarian, vegan, gluten-free.")
    user_history: Optional[str] = Field(None, description="The user's historical diet data and feedback.")

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
    try:
        if not openai.api_key:
            # Fallback to intelligent hardcoded responses based on input
            return _generate_fallback_diet_plan(input)

        client = openai.OpenAI()
        prompt = f"""
        Create a personalized diet plan for someone with:
        - BMI: {input.bmi}
        - Weight goal: {input.weight_goal}
        - Dietary preferences: {input.dietary_preferences}
        {f"- User history: {input.user_history}" if input.user_history else ""}

        Please provide:
        1. A detailed 7-day meal plan with breakfast, lunch, dinner, and snacks
        2. A comprehensive grocery list for the week
        3. Nutritional breakdown (calories, macros, key nutrients)

        Make the plan realistic, healthy, and sustainable. Consider the user's BMI and goals when determining portion sizes and calorie targets.

        Format your response with clear sections:
        ## Diet Plan
        [7-day meal plan here]

        ## Grocery List
        [grocery list here]

        ## Nutritional Information
        [nutritional breakdown here]
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000,
            temperature=0.7
        )

        ai_response = response.choices[0].message.content.strip()

        # Parse the AI response into structured components
        sections = ai_response.split('## ')

        diet_plan = ""
        grocery_list = ""
        nutritional_info = ""

        for section in sections:
            section_lower = section.lower()
            if section_lower.startswith('diet plan'):
                diet_plan = section.replace('Diet Plan', '').strip()
            elif section_lower.startswith('grocery list'):
                grocery_list = section.replace('Grocery List', '').strip()
            elif section_lower.startswith('nutritional information') or section_lower.startswith('nutrition'):
                nutritional_info = section.replace('Nutritional Information', '').replace('Nutrition', '').strip()

        # Fallback if parsing fails
        if not diet_plan:
            diet_plan = ai_response[:1000] + "..."
        if not grocery_list:
            grocery_list = "Please check the meal plan for grocery items needed."
        if not nutritional_info:
            nutritional_info = "Nutritional information varies by specific meals. Consult a nutritionist for detailed analysis."

        return DietPlanOutput(
            diet_plan=diet_plan,
            grocery_list=grocery_list,
            nutritional_information=nutritional_info
        )

    except Exception as e:
        # Fallback to intelligent hardcoded responses based on input
        print(f"AI generation failed: {e}")
        return _generate_fallback_diet_plan(input)

def _generate_fallback_diet_plan(input: DietPlanInput) -> DietPlanOutput:
    """Generate intelligent fallback diet plan based on input data."""
    # Determine calorie target based on BMI and goal
    base_calories = 2000
    if input.bmi > 25:
        base_calories = 1800 if "lose" in input.weight_goal.lower() else 2200
    elif input.bmi < 18.5:
        base_calories = 2200 if "gain" in input.weight_goal.lower() else 1800

    # Adjust for dietary preferences
    diet_type = input.dietary_preferences.lower()
    if "vegetarian" in diet_type:
        diet_plan = f"""
        7-Day Vegetarian Diet Plan ({base_calories} calories/day)

        Day 1-2: High-protein vegetarian focus
        - Breakfast: Greek yogurt with berries and nuts
        - Lunch: Quinoa salad with chickpeas, vegetables, and feta
        - Dinner: Tofu stir-fry with brown rice and broccoli
        - Snacks: Apple with almond butter, carrot sticks with hummus

        Day 3-4: Balanced vegetarian meals
        - Breakfast: Oatmeal with banana and chia seeds
        - Lunch: Lentil soup with whole grain bread
        - Dinner: Vegetable curry with chickpeas and naan
        - Snacks: Cottage cheese with cucumber, mixed nuts

        Day 5-7: Nutrient-dense vegetarian variety
        - Breakfast: Smoothie bowl with spinach, banana, and protein powder
        - Lunch: Grilled vegetable sandwich on whole grain bread
        - Dinner: Eggplant parmesan with side salad
        - Snacks: Yogurt parfait, fresh fruit
        """
    elif "vegan" in diet_type:
        diet_plan = f"""
        7-Day Vegan Diet Plan ({base_calories} calories/day)

        Focus: Plant-based proteins and nutrient-dense foods

        Daily Structure:
        - Breakfast: Overnight oats with plant milk, chia seeds, and fruits
        - Lunch: Buddha bowl with quinoa, roasted vegetables, tofu, and tahini dressing
        - Dinner: Stir-fried vegetables with tempeh and brown rice
        - Snacks: Fresh fruits, nuts, hummus with vegetables, energy balls
        """
    else:
        diet_plan = f"""
        7-Day Balanced Diet Plan ({base_calories} calories/day)

        Daily Structure:
        - Breakfast: Whole grain toast with avocado and eggs
        - Lunch: Grilled chicken salad with mixed greens and quinoa
        - Dinner: Baked salmon with sweet potatoes and steamed broccoli
        - Snacks: Greek yogurt, fresh fruit, handful of nuts
        """

    # Generate grocery list based on preferences
    if "vegetarian" in diet_type:
        grocery_list = """
        Produce: Berries, bananas, apples, broccoli, spinach, carrots, cucumbers, tomatoes, onions, garlic
        Proteins: Greek yogurt, feta cheese, chickpeas, lentils, tofu, eggs, cottage cheese
        Grains: Quinoa, brown rice, whole grain bread, oatmeal
        Pantry: Almond butter, hummus, chia seeds, olive oil, herbs and spices
        """
    elif "vegan" in diet_type:
        grocery_list = """
        Produce: Berries, bananas, spinach, broccoli, carrots, cucumbers, tomatoes, onions, garlic
        Proteins: Tofu, tempeh, lentils, chickpeas, plant-based protein powder
        Grains: Quinoa, brown rice, oats, whole grain bread
        Pantry: Plant milk, tahini, hummus, chia seeds, nuts, olive oil, herbs and spices
        """
    else:
        grocery_list = """
        Produce: Berries, bananas, apples, broccoli, spinach, carrots, cucumbers, mixed greens
        Proteins: Chicken, salmon, eggs, Greek yogurt, cottage cheese
        Grains: Quinoa, brown rice, sweet potatoes, whole grain bread, oatmeal
        Pantry: Avocado, nuts, olive oil, herbs and spices
        """

    # Nutritional information
    nutritional_info = f"""
    Daily Nutritional Targets:
    - Calories: {base_calories}
    - Protein: {int(base_calories * 0.25 / 4)}g (25% of calories)
    - Carbohydrates: {int(base_calories * 0.45 / 4)}g (45% of calories)
    - Fats: {int(base_calories * 0.30 / 9)}g (30% of calories)
    - Fiber: 25-30g
    - Key nutrients: Adequate vitamins, minerals, and antioxidants from whole foods
    """

    return DietPlanOutput(
        diet_plan=diet_plan.strip(),
        grocery_list=grocery_list.strip(),
        nutritional_information=nutritional_info.strip()
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
    print(result.model_dump_json(indent=4))
