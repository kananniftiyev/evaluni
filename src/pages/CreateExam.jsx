import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Layout from '../components/Layout';
import Field from '../components/Field';
import Papa from 'papaparse'; // Importing the papaparse library
import axios from 'axios'; // Import Axios

const NewExamPage = () => {
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCsvFile(file);
      parseCsv(file);
    }
  };

  const parseCsv = (file) => {
  Papa.parse(file, {
    header: false, // We don't have headers in our CSV
    skipEmptyLines: true, // Skip empty lines
    complete: (results) => {
      const parsedQuestions = [];

      results.data.forEach((line) => {
        if (line.length > 0) {
          const question = line[0].trim();
          const correctAnswer = line[1].trim();
          
          if (line.length === 5) { // Multiple choice question with 4 options
            const options = [
              { id: 'a', text: line[1].trim() }, // Correct answer
              { id: 'b', text: line[2].trim() },
              { id: 'c', text: line[3].trim() },
              { id: 'd', text: line[4].trim() },
            ];
            parsedQuestions.push({
              id: `q${parsedQuestions.length + 1}`,
              type: 'multiple-choice',
              question,
              options,
              correctAnswer
            });
          } else if (line.length === 2) { // Open-ended question
            parsedQuestions.push({
              id: `q${parsedQuestions.length + 1}`,
              type: 'open-ended',
              question,
              correctAnswer
            });
          }
        }
      });

      setQuestions(parsedQuestions);
    },
    error: (error) => {
      console.error("Error parsing CSV:", error);
    },
  });
};


  
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Construct the exam object
    const newExam = {
      id: `exam${Date.now()}`, // Unique ID for the exam
      title: examTitle,
      description: examDescription,
      startDate: new Date().toISOString(), // Current time as start date (for demonstration)
      endDate: new Date(new Date().getTime() + 3600000).toISOString(), // One hour duration
      questions,
      results: []
    };

    try {
      // Send the new exam data to the server
      await axios.post('http://localhost:3000/exams', newExam); // Adjust the URL if necessary
      console.log('New Exam Created:', newExam);
      
      // After saving, navigate to the dashboard or another page
      navigate('/dashboard');
    } catch (error) {
      console.error("Error creating exam:", error);
    }
  };


  return (
    <Layout>
      <div className="flex-grow flex items-center justify-center">
        <div className="mx-auto w-1/3">
          <h1 className="text-2xl font-semibold mb-4">Create New Exam</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field
              text="Exam Title"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              name="examTitle"
              required
            />
            <Field
              text="Exam Description"
              value={examDescription}
              onChange={(e) => setExamDescription(e.target.value)}
              name="examDescription"
              required
            />
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="rounded border p-2 px-8"
              required
            />
            <Button text="Create Exam" onClick={handleSubmit} />
          </form>

          {/* Display parsed questions */}
          {questions.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Parsed Questions</h2>
              <ul>
                {questions.map((question) => (
                  <li key={question.id} className="border p-2 mb-2">
                    <strong>{question.question}</strong>
                    {question.type === 'multiple-choice' && (
                      <ul className="list-disc ml-4">
                        {question.options.map(option => (
                          <li key={option.id}>{option.text}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NewExamPage;
