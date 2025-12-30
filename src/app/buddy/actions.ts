'use server';

export type MotivationalFitnessUpdateInput = {
  user_message: string;
};

export async function getMotivationalFitnessUpdateAction(
  input: MotivationalFitnessUpdateInput
) {
  try {
    // Log the request payload
    console.log("Request payload for getMotivationalFitnessUpdate:", input);

    const response = await fetch("https://fitness-ai-1-odt3.onrender.com/api/motivational-fitness-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    console.log("API Response Status:", response.status); // Log the response status
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText); // Log the API error response
      throw new Error("Failed to fetch motivational fitness update");
    }

    const output = await response.json();
    console.log("API Response Data:", output); // Log the response data

    if (!output || !output.motivational_message) {
      console.error("Missing expected fields in getMotivationalFitnessUpdate output:", output);
      throw new Error("Invalid response from getMotivationalFitnessUpdate.");
    }

    return output;
  } catch (error) {
    console.error("Error in getMotivationalFitnessUpdateAction:", error); // Log the error
    throw new Error('Failed to get motivational fitness update.');
  }
}
