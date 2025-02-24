import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAIGrading } from './api';

function AssignmentUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
      if (file.type.startsWith("text/")) {
        const text = await file.text();
        studentWork = text;
      } else {
        studentWork = "Uploaded file is an image. Image processing is not yet implemented.";
      }

      const assignmentDetails = JSON.parse(localStorage.getItem('assignmentData'));
      const feedback = await getAIGrading(assignmentDetails, studentWork);
      localStorage.setItem('assignmentFeedback', feedback);
      alert('File uploaded and graded successfully!');
      navigate('/results');
    } catch (error) {
      console.error('Error grading assignment:', error);
      alert('Error grading assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Upload Assignment</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="file" accept="text/*,image/*" onChange={handleFileChange} />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Uploading & Grading...' : 'Upload & Grade'}
        </button>
      </form>
    </div>
  );
}

export default AssignmentUpload;
