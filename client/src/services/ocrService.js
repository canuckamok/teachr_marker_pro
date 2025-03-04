export const performOCR = async (imageFile, language = 'eng') => {
  try {
      console.log(`Starting OCR process with language: ${language}`);
      
      // Create form data for the file upload
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('language', language);
      
      // Call the backend OCR API
      const response = await fetch('http://localhost:5001/api/ocr/process', {
          method: 'POST',
          body: formData
      });
      
      if (!response.ok) {
          const errorText = await response.text();
          console.error('OCR API error:', response.status, errorText);
          throw new Error('OCR processing failed');
      }
      
      const result = await response.json();
      console.log('OCR API response:', result);
      
      if (!result.success) {
          throw new Error(result.error || 'Unknown OCR error');
      }
      
      return {
          success: true,
          text: result.text,
          confidence: result.confidence
      };
  } catch (error) {
      console.error('OCR error:', error);
      return {
          success: false,
          error: error.message,
          text: null
      };
  }
};

// Helper function to detect language based on simple patterns
export const detectLanguage = (text) => {
  const langPatterns = {
      eng: /\b(the|and|is|in|to|of|that|this|for)\b/gi,
      spa: /\b(el|la|los|las|es|en|y|que|de|por)\b/gi,
      fra: /\b(le|la|les|est|en|et|que|de|pour)\b/gi
  };
  
  // Count matches for each language
  const counts = {
      eng: (text.match(langPatterns.eng) || []).length,
      spa: (text.match(langPatterns.spa) || []).length,
      fra: (text.match(langPatterns.fra) || []).length
  };
  
  // Find the language with the most matches
  let detectedLang = 'eng'; // Default to English
  let maxCount = counts.eng;
  
  if (counts.spa > maxCount) {
      detectedLang = 'spa';
      maxCount = counts.spa;
  }
  
  if (counts.fra > maxCount) {
      detectedLang = 'fra';
  }
  
  return detectedLang;
};

// Simple image preprocessing function (kept for compatibility with existing code)
export const preprocessImage = async (imageFile) => {
  console.log('Image preprocessing complete');
  return imageFile; // Just return the file as-is, since real processing happens on the server
};