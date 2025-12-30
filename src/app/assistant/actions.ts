'use server';

export async function getSmartAssistantFeedbackAction(
  input: SmartAssistantInput
) {
  try {
    // Map frontend field names to backend field names
    const backendInput = {
      workout_type: input.workoutType,
      current_set: input.currentSet,
      rep_count: input.repCount,
      heart_rate: input.heartRate,
      time_under_tension: input.timeUnderTension,
      weight_lifted: input.weightLifted,
      perceived_exertion: input.perceivedExertion,
    };

    console.log("Input to API:", backendInput); // Log the input data
    const response = await fetch("https://fitness-ai-1-odt3.onrender.com/api/smart-assistant-feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendInput),
    });

    console.log("API Response Status:", response.status); // Log the response status
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText); // Log the API error response
      throw new Error("Failed to fetch smart assistant feedback");
    }

    const output = await response.json();
    console.log("API Response Data:", output); // Log the response data
    return output;
  } catch (error) {
    console.error("Error in getSmartAssistantFeedbackAction:", error); // Log the error
    throw new Error("Failed to get smart assistant feedback.");
  }
}
