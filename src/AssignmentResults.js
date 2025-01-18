import React from 'react';
import { useNavigate } from 'react-router-dom';

function AssignmentResults() {

const navigate = useNavigate();

  const dummyData = {
    grade: 4,
    positiveFeedback: [
        "Clear Format and Organization: The letter follows a clear structure, with an introduction, body paragraphs, and a conclusion. This shows effort in aligning with the task's requirements.",
        "Relevance to the Task: The student addresses the cultural shock and differences experienced by Maryam, tying them to the themes of the novel.",
        "Effort in Using the Past and Present Tense: The student attempts to incorporate past tense forms (passé composé and imparfait), which is a good demonstration of grammar taught."
    ],
    constructiveFeedback: [
        "Grammatical Accuracy: There are consistent errors in tense use and sentence structure, which occasionally hinder clarity (e.g., \"une autre partie du la nourriture\").",
        "Limited Vocabulary Range: The vocabulary used is very basic, and there is little variety. Using more expressive or specific terms would have enhanced the writing.",
        "Cohesion and Flow: Some ideas are disconnected or repetitive, such as the focus on food, making the letter less engaging and fluid."
    ],
    markedUpText: "This is the marked-up version of the assignment with highlights for corrections."
  };

  return (
    <div className="form-container">
      <h1>Assignment Results</h1>
      <p><strong>Grade:</strong> {dummyData.grade}/10</p>
      <h3>Positive Feedback</h3>
      <ul>
        {dummyData.positiveFeedback.map((feedback, index) => (
          <li key={index}>{feedback}</li>
        ))}
      </ul>
      <h3>Constructive Feedback</h3>
      <ul>
        {dummyData.constructiveFeedback.map((feedback, index) => (
          <li key={index}>{feedback}</li>
        ))}
      </ul>
      <h3>Marked-Up Assignment</h3>
      <p>{dummyData.markedUpText}</p>
      <div className="button-group">
        <button className="btn-primary" onClick={() => navigate('/upload-assignment')}>Upload Next Assignment</button>
        <button className="btn-secondary" onClick={() => navigate('/')}>Start Over</button>
      </div>
    </div>
  );
}

export default AssignmentResults;



