import { createWorker } from 'tesseract.js';

// Simple image preprocessing without OpenCV
export const preprocessImage = async (imageFile) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Convert to grayscale and increase contrast
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Convert to grayscale
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        // Apply contrast (simple version)
        const contrast = 1.5; // Increase for higher contrast
        const factor = 259 * (contrast + 255) / (255 * (259 - contrast));
        const newValue = factor * (avg - 128) + 128;
        
        // Set RGB channels to the new value
        data[i] = newValue;     // R
        data[i + 1] = newValue; // G
        data[i + 2] = newValue; // B
      }
      
      // Put the processed image back on the canvas
      ctx.putImageData(imageData, 0, 0);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    };
    
    // Load the image
    img.src = URL.createObjectURL(imageFile);
  });
};

// Main OCR function
export const performOCR = async (imageFile, language = 'eng') => {
  try {
    console.log("Starting OCR process with language:", language);
    
    // Step 1: Preprocess the image for better OCR results
    const processedImage = await preprocessImage(imageFile);
    console.log("Image preprocessing complete");
    
    // Step 2: Create a worker and recognize text
    const worker = await createWorker();
    console.log("Worker created");
    
    await worker.loadLanguage(language);
    console.log(`Language ${language} loaded`);
    
    await worker.initialize(language);
    console.log(`Worker initialized with ${language}`);
    
    const { data } = await worker.recognize(processedImage);
    console.log("OCR recognition complete");
    
    // Step 3: Terminate worker to free memory
    await worker.terminate();
    console.log("Worker terminated");
    
    return {
      success: true,
      text: data.text,
      confidence: data.confidence
    };
  } catch (error) {
    console.error('OCR processing error:', error);
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