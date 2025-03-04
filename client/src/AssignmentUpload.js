import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAIGrading } from './api';
import { performOCR } from './services/ocrService';
import './AssignmentUpload.css';

function AssignmentUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create a preview URL for images
      if (selectedFile.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload a file.');
      return;
    }

    setLoading(true);
    try {
      let studentWork = "";
      let processedImageUrl = null;
      
      // Process text files directly
      if (file.type.startsWith("text/")) {
        setProcessingStatus('Reading text file...');
        studentWork = await file.text();
      } 
      // Process image files with OCR
      else if (file.type.startsWith("image/")) {
        setProcessingStatus('Starting OCR process...');
        
        // Determine language based on assignment subject
        const assignmentDetails = JSON.parse(localStorage.getItem('assignmentData') || '{}');
        let languageCode = 'eng'; // Default to English
        
        if (assignmentDetails.subject) {
          const subject = assignmentDetails.subject.toLowerCase();
          if (subject.includes('spanish') || subject.includes('español')) {
            languageCode = 'spa';
          } else if (subject.includes('french') || subject.includes('français')) {
            languageCode = 'fra';
          }
        }
        
        setProcessingStatus(`Performing OCR using ${languageCode} language model...`);
        const ocrResult = await performOCR(file, languageCode);
        
        if (ocrResult.success) {
          studentWork = ocrResult.text;
          processedImageUrl = ocrResult.processedImage;
          setProcessingStatus(`OCR completed with ${Math.round(ocrResult.confidence)}% confidence`);
        } else {
          throw new Error('OCR processing failed: ' + (ocrResult.error || 'Unknown error'));
        }
      } else {
        studentWork = "Uploaded file type is not supported. Please use text or image files.";
      }

      // Get assignment details and send for grading
      setProcessingStatus('Grading assignment...');
      const assignmentDetails = JSON.parse(localStorage.getItem('assignmentData') || '{}');
      
      // Store the extracted text for reference
      localStorage.setItem('extractedStudentWork', studentWork);
      
      // Store processed image URL if available
      if (processedImageUrl) {
        localStorage.setItem('processedImageUrl', processedImageUrl);
      }
      
      const feedback = await getAIGrading(assignmentDetails, studentWork);
      
      // Store feedback and navigate to results
      localStorage.setItem('assignmentFeedback', feedback);
      setProcessingStatus('Grading complete!');
      
      navigate('/results');
    } catch (error) {
      console.error('Error processing assignment:', error);
      setProcessingStatus('Error: ' + error.message);
      alert('Error processing assignment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Upload Assignment</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Upload Student Work (Text or Image):</label>
          <input 
            type="file" 
            accept="text/*,image/*" 
            onChange={handleFileChange}
          />
          
          {/* Preview for image files */}
          {previewUrl && (
            <div className="image-preview">
              <img 
                src={previewUrl} 
                alt="Assignment preview" 
                style={{ maxWidth: '100%', marginTop: '10px', borderRadius: '5px' }} 
              />
            </div>
          )}
        </div>
        
        {processingStatus && (
          <div className="status-message">
            <p>{processingStatus}</p>
            {loading && <div className="loading-spinner"></div>}
          </div>
        )}
        
        <button type="submit" className="btn-primary" disabled={loading || !file}>
          {loading ? 'Processing...' : 'Upload & Grade'}
        </button>
      </form>
    </div>
  );
}

export default AssignmentUpload;