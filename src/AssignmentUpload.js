import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AssignmentUpload() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload a file.');
      return;
    }

    // Simulate storing the uploaded file in local storage for the prototype
    localStorage.setItem('uploadedAssignment', file.name);
    alert('File uploaded successfully and saved locally!');
    navigate('/results');
  };

  return (
    <div className="form-container">
      <h1>Upload Assignment</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <button type="submit" className="btn-primary">Upload</button>
      </form>
    </div>
  );
}

export default AssignmentUpload;