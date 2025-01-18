import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AssignmentCreation from './AssignmentCreation';
import AssignmentUpload from './AssignmentUpload';
import AssignmentResults from './AssignmentResults';

function App() {
  const [assignmentData, setAssignmentData] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AssignmentCreation onSubmit={setAssignmentData} />} />
        <Route path="/upload-assignment" element={<AssignmentUpload />} />
        <Route path="/results" element={<AssignmentResults />} />
      </Routes>
    </Router>
  );
}

export default App;