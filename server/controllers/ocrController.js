const { ImageAnnotatorClient } = require('@google-cloud/vision');

// Initialize Vision client
// server/controllers/ocrController.js
let visionClient;
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    visionClient = new ImageAnnotatorClient();
    console.log("Using credentials file from environment variable");
  } else if (process.env.GOOGLE_CREDENTIALS_JSON) {
    try {
      const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
      visionClient = new ImageAnnotatorClient({ credentials });
      console.log("Using parsed JSON credentials");
    } catch (jsonError) {
      console.error('Error parsing Google credentials JSON:', jsonError);
      // Continue without vision client - we'll handle the null case later
    }
  } else {
    console.log('No Google Cloud credentials found - OCR functionality will be unavailable');
  }
} catch (error) {
  console.error('Error initializing Vision client:', error);
}

exports.processImage = async (req, res) => {
  try {
    if (!visionClient) {
      return res.status(500).json({ 
        success: false, 
        error: 'OCR service not configured' 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      });
    }

    // Get language hint from request
    const languageHint = req.body.language || 'en';

    // Perform OCR with Google Cloud Vision
    const [result] = await visionClient.documentTextDetection({
      image: { content: req.file.buffer },
      imageContext: {
        languageHints: [languageHint]
      }
    });

    const text = result.fullTextAnnotation ? result.fullTextAnnotation.text : '';
    
    res.json({
      success: true,
      text: text,
      confidence: result.textAnnotations && result.textAnnotations.length > 0 
        ? result.textAnnotations[0].confidence * 100 
        : 0
    });
  } catch (error) {
    console.error('OCR processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};