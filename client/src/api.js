
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/.netlify/functions'
  : 'http://localhost:5001/api';

export async function getAIGrading(assignmentDetails, studentWork) {
    const endpoint = process.env.NODE_ENV === 'production'
      ? `${API_BASE_URL}/grading`
      : `${API_BASE_URL}/grading/analyze`;
      
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            assignmentDetails,
            studentWork
        })
    });

    if (!response.ok) {
        throw new Error("Failed to fetch AI response");
    }

    const data = await response.json();
    return data.success ? data.feedback : null;
}

export async function performOCR(imageFile, language = 'eng') {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('language', language);

        const endpoint = process.env.NODE_ENV === 'production'
          ? `${API_BASE_URL}/ocr`
          : `${API_BASE_URL}/ocr/process`;
          
        const response = await fetch(endpoint, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("OCR processing failed");
        }

        return await response.json();
    } catch (error) {
        console.error('OCR error:', error);
        return {
            success: false,
            error: error.message,
            text: null
        };
    }
}