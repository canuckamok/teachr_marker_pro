import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AssignmentResults() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const storedFeedback = localStorage.getItem('assignmentFeedback');
    if (storedFeedback) {
      setFeedback(storedFeedback);
    }
  }, []);

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
      <div className="button-group">
        <button className="btn-primary" onClick={() => navigate('/upload-assignment')}>Upload Next Assignment</button>
        <button className="btn-secondary" onClick={() => navigate('/')}>Start Over</button>
      </div>
    </div>
  );
}

export default AssignmentResults;