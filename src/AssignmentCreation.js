import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AssignmentCreation({ onSubmit }) {
  const [assignmentName, setAssignmentName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [context, setContext] = useState('');
  const [explanation, setExplanation] = useState('');
  const [rubricFile, setRubricFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const assignmentData = {
      assignmentName,
      gradeLevel,
      subject,
      context,
      explanation,
      rubricFile,
    };
    localStorage.setItem('assignmentData', JSON.stringify(assignmentData));
    onSubmit(assignmentData);
    navigate('/upload-assignment');
  };

  return (
    <div className="form-container">
      <h1>Create Assignment</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Assignment Name:</label>
          <input
            type="text"
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Grade Level:</label>
          <input
            type="text"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Assignment instructions:</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label>How would you like this to be assessed?:</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Upload Rubric:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setRubricFile(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn-primary">Create Assignment</button>
      </form>
    </div>
  );
}

export default AssignmentCreation;
