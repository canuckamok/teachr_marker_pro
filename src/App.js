import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AssignmentCreation from './AssignmentCreation';
import AssignmentUpload from './AssignmentUpload';
import AssignmentResults from './AssignmentResults';

function App() {
  const [assignmentData, setAssignmentData] = useState(null);

  useEffect(() => {
    // Load assignment data from local storage on app load
    const savedData = localStorage.getItem('assignmentData');
    if (savedData) {
      setAssignmentData(JSON.parse(savedData));
    }
  }, []);

  const handleAssignmentSubmit = (data) => {
    setAssignmentData(data);
    localStorage.setItem('assignmentData', JSON.stringify(data));
    // Later, this function will be updated to send the data to a database
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AssignmentCreation onSubmit={handleAssignmentSubmit} />} />
        <Route path="/upload-assignment" element={<AssignmentUpload />} />
        <Route path="/results" element={<AssignmentResults assignmentData={assignmentData} />} />
      </Routes>
    </Router>
  );
}

export default App;