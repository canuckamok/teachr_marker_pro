const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export async function getAIGrading(assignmentDetails, studentWork) {
    const prompt = `Grade this assignment based on the provided criteria:\n\nAssignment Details:\n${JSON.stringify(assignmentDetails, null, 2)}\n\nStudent Work:\n${studentWork}`;

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500
        })
    });

    if (!response.ok) {
        throw new Error("Failed to fetch AI response");
    }

    const data = await response.json();
    return data.choices[0].message.content;
}