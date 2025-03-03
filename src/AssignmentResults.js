import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuThumbsUp, LuThumbsDown } from 'react-icons/lu';
import './AssignmentResults.css';
import './ExtractedText.css';

function AssignmentResults({ assignmentData }) {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [userFeedback, setUserFeedback] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [showProcessedImage, setShowProcessedImage] = useState(false);

  useEffect(() => {
    // Load feedback and extracted text from localStorage
    const storedFeedback = localStorage.getItem('assignmentFeedback');
    const storedExtractedText = localStorage.getItem('extractedStudentWork');
    const storedProcessedImageUrl = localStorage.getItem('processedImageUrl');
    
    if (storedFeedback) {
      setFeedback(storedFeedback);
    }
    
    if (storedExtractedText) {
      setExtractedText(storedExtractedText);
    }
    
    if (storedProcessedImageUrl) {
      setProcessedImageUrl(storedProcessedImageUrl);
    }
  }, []);

  const handleThumbsDown = () => {
    setShowFeedbackInput(true);
  };

  const handleFeedbackSubmit = () => {
    console.log('User feedback:', userFeedback);
    alert('Thank you for your feedback!');
    setShowFeedbackInput(false);
    setUserFeedback('');
  };

  const toggleExtractedText = () => {
    setShowExtractedText(!showExtractedText);
  };
  
  const toggleProcessedImage = () => {
    setShowProcessedImage(!showProcessedImage);
  };

  const handleManualTextEdit = (e) => {
    setExtractedText(e.target.value);
  };
  
  const handleUpdateGrading = async () => {
    try {
      // Get assignment details from localStorage
      const assignmentDetails = JSON.parse(localStorage.getItem('assignmentData') || '{}');
      
      // Update the stored extracted text
      localStorage.setItem('extractedStudentWork', extractedText);
      
      // Re-grade with the manually corrected text
      const { getAIGrading } = require('./api');
      const newFeedback = await getAIGrading(assignmentDetails, extractedText);
      
      // Update feedback state and storage
      setFeedback(newFeedback);
      localStorage.setItem('assignmentFeedback', newFeedback);
      
      alert('Grading updated successfully!');
    } catch (error) {
      console.error('Error updating grading:', error);
      alert('Error updating grading: ' + error.message);
    }
  };

  return (
    <div className="form-container">
      <h1>Assignment Results</h1>
      
      {/* Control buttons for OCR results */}
      <div className="control-buttons">
        {extractedText && (
          <button 
            className="toggle-button" 
            onClick={toggleExtractedText}
          >
            {showExtractedText ? 'Hide Extracted Text' : 'Show Extracted Text'}
          </button>
        )}
        
        {processedImageUrl && (
          <button
            className="toggle-button"
            onClick={toggleProcessedImage}
            style={{ marginLeft: '10px' }}
          >
            {showProcessedImage ? 'Hide Processed Image' : 'Show Processed Image'}
          </button>
        )}
      </div>
      
      {/* Processed image section */}
      {showProcessedImage && processedImageUrl && (
        <div className="processed-image-container">
          <h3>Processed Image:</h3>
          <p className="image-note">
            This is how the image was processed for OCR. 
            The clearer the text appears in this image, the better the OCR results.
          </p>
          <img 
            src={processedImageUrl} 
            alt="Processed for OCR" 
            className="processed-image"
          />
        </div>
      )}
      
      {/* Extracted text section with edit capability */}
      {showExtractedText && (
        <div className="extracted-text">
          <h3>Extracted Text:</h3>
          <p className="edit-note">
            You can edit the text below to correct any OCR errors, then click "Update Grading".
          </p>
          <textarea
            className="extracted-text-editor"
            value={extractedText}
            onChange={handleManualTextEdit}
            rows={10}
          />
          <button 
            className="btn-primary update-grading-btn"
            onClick={handleUpdateGrading}
          >
            Update Grading
          </button>
        </div>
      )}
      
      {/* AI Feedback section */}
      {feedback ? (
        <div className="feedback-section">
          <h3>AI Feedback</h3>
          <div className="feedback-content">
            {feedback}
          </div>
        </div>
      ) : (
        <p>Loading results...</p>
      )}
      
      {/* Feedback buttons */}
      <div className="feedback-buttons">
        <button className="thumbs-up" onClick={() => alert('Glad you liked it!')}>
          <LuThumbsUp size={20} />
        </button>
        <button className="thumbs-down" onClick={handleThumbsDown}>
          <LuThumbsDown size={20} />
        </button>
      </div>
      
      {/* Feedback input form */}
      {showFeedbackInput && (
        <div className={`feedback-input ${showFeedbackInput ? 'slide-up' : ''}`}>
          <textarea
            value={userFeedback}
            onChange={(e) => setUserFeedback(e.target.value)}
            placeholder="Tell us what went wrong..."
          />
          <button onClick={handleFeedbackSubmit} className="btn-primary">Submit Feedback</button>
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="button-group">
        <button className="btn-primary" onClick={() => navigate('/upload-assignment')}>Upload Next Assignment</button>
        <button className="btn-secondary" onClick={() => navigate('/')}>Start Over</button>
      </div>
    </div>
  );
}

export default AssignmentResults;