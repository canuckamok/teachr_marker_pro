import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuThumbsUp, LuThumbsDown } from 'react-icons/lu'; // Using Lucide icons for outlined effect
import './AssignmentResults.css';

function AssignmentResults({ assignmentData }) {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [userFeedback, setUserFeedback] = useState('');

  useEffect(() => {
    const storedFeedback = localStorage.getItem('assignmentFeedback');
    if (storedFeedback) {
      setFeedback(storedFeedback);
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

  return (
    <div className="form-container">
      <h1>Assignment Results</h1>
      {feedback ? (
        <div>
          <h3>AI Feedback</h3>
          <p>{feedback}</p>
        </div>
      ) : (
        <p>Loading results...</p>
      )}
      
      <div className="feedback-buttons">
        <button className="thumbs-up" onClick={() => alert('Glad you liked it!')}>
          <LuThumbsUp size={20} />
        </button>
        <button className="thumbs-down" onClick={handleThumbsDown}>
          <LuThumbsDown size={20} />
        </button>
      </div>
      
      {showFeedbackInput && (
        <div className="feedback-input slide-up">
          <textarea
            value={userFeedback}
            onChange={(e) => setUserFeedback(e.target.value)}
            placeholder="Tell us what went wrong..."
          />
          <button onClick={handleFeedbackSubmit} className="btn-primary">Submit Feedback</button>
        </div>
      )}
      
      <div className="button-group">
        <button className="btn-primary" onClick={() => navigate('/upload-assignment')}>Upload Next Assignment</button>
        <button className="btn-secondary" onClick={() => navigate('/')}>Start Over</button>
      </div>
    </div>
  );
}

export default AssignmentResults;
