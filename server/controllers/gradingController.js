const fetch = require('node-fetch');

exports.getAIGrading = async (req, res) => {
  try {
    const { assignmentDetails, studentWork } = req.body;
    
    if (!assignmentDetails || !studentWork) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    const API_URL = "https://api.openai.com/v1/chat/completions";
    const API_KEY = process.env.OPENAI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'API key not configured'
      });
    }

    const prompt = `Grade this assignment based on the provided criteria:
      
      Assignment Details:
      ${JSON.stringify(assignmentDetails, null, 2)}
      
      Student Work:
      ${studentWork}`;

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
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    res.json({
      success: true,
      feedback: data.choices[0].message.content
    });
  } catch (error) {
    console.error('Grading error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};