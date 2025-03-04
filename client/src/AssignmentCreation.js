import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AssignmentCreation({ onSubmit }) {
  const [assignmentName, setAssignmentName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [context, setContext] = useState('');
  const [explanation, setExplanation] = useState('');
  const [rubricFile, setRubricFile] = useState(null);
  const [rubricFileName, setRubricFileName] = useState('');
  const navigate = useNavigate();

  // Load saved assignment data from localStorage when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('assignmentData');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Populate the form fields with saved data
        setAssignmentName(parsedData.assignmentName || '');
        setGradeLevel(parsedData.gradeLevel || '');
        setSubject(parsedData.subject || '');
        setContext(parsedData.context || '');
        setExplanation(parsedData.explanation || '');
        
        // For file input, we can only store the filename, not the actual file
        if (parsedData.rubricFileName) {
          setRubricFileName(parsedData.rubricFileName);
        }
      } catch (error) {
        console.error('Error parsing saved assignment data:', error);
      }
    }
  }, []);

  const handleRubricChange = (e) => {
    if (e.target.files[0]) {
      setRubricFile(e.target.files[0]);
      setRubricFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const assignmentData = {
      assignmentName,
      gradeLevel,
      subject,
      context,
      explanation,
      rubricFile: null, // Can't store File objects in localStorage
      rubricFileName: rubricFileName
    };
    
    // Save to localStorage
    localStorage.setItem('assignmentData', JSON.stringify(assignmentData));
    
    // Add the actual file object back for the onSubmit handler
    assignmentData.rubricFile = rubricFile;
    
    // Call the onSubmit prop with the complete data
    onSubmit(assignmentData);
    
    // Navigate to the next page
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
          <label>Assignment Instructions:</label>
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
          <label>Upload Rubric (Text or Image):</label>
          <input
            type="file"
            accept="text/*,image/*"
            onChange={handleRubricChange}
          />
          {rubricFileName && (
            <p className="file-name">Current file: {rubricFileName}</p>
          )}
        </div>
        <button type="submit" className="btn-primary">Continue to Upload</button>
      </form>
    </div>
  );
}

export default AssignmentCreation;