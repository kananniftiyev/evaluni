import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Layout from "../components/Layout";
import Field from "../components/Field";
import Papa from "papaparse"; // Importing the papaparse library
import axios from "axios"; // Import Axios

const NewExamPage = () => {
  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [creatorId, setCreatorId] = useState(null); // State for storing creator ID
  const navigate = useNavigate();

  // This function gets the current user's ID, assuming it's stored in localStorage.
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Adjust based on your app's logic
    if (user) {
      setCreatorId(user.id); // Set the creatorId state with the logged-in user's ID
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCsvFile(file);
      parseCsv(file);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const parseCsv = (file) => {
    Papa.parse(file, {
      header: false, // No headers
      skipEmptyLines: true, // Skip empty lines
      complete: (results) => {
        const parsedQuestions = [];

        results.data.forEach((line) => {
          if (line.length > 0) {
            const question = line[0].trim();

            if (line.length === 5) {
              // Multiple choice question with 4 options
              const correctOptionText = line[1].trim();
              const options = [
                { id: "a", text: correctOptionText }, // Initially marked correct
                { id: "b", text: line[2].trim() },
                { id: "c", text: line[3].trim() },
                { id: "d", text: line[4].trim() },
              ];

              // Shuffle options
              const shuffledOptions = shuffleArray([...options]);

              // Find the new ID of the correct answer
              const correctOption = shuffledOptions.find(
                (option) => option.text === correctOptionText
              );

              parsedQuestions.push({
                id: `q${parsedQuestions.length + 1}`,
                type: "multiple-choice",
                question,
                options: shuffledOptions,
                correctAnswer: correctOption.id, // Store new shuffled ID
              });
            } else if (line.length === 2) {
              // Open-ended question
              parsedQuestions.push({
                id: `q${parsedQuestions.length + 1}`,
                type: "open-ended",
                question,
                correctAnswer: line[1].trim(),
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

    if (!creatorId) {
      console.error("User is not logged in.");
      return;
    }

    if (!startDate || !endDate) {
      console.error("Please set both start date and deadline.");
      return;
    }

    // Construct the exam object
    const newExam = {
      id: `exam${Date.now()}`, // Unique ID for the exam
      title: examTitle,
      description: examDescription,
      startDate: new Date(startDate).toISOString(), // Use the user-selected start date
      endDate: new Date(endDate).toISOString(), // Use the user-selected end date
      questions,
      results: [],
      creatorId, // Include the creatorId here
    };

    try {
      // Send the new exam data to the server
      await axios.post("http://localhost:3000/exams", newExam); // Adjust the URL if necessary
      console.log("New Exam Created:", newExam);

      // After saving, navigate to the dashboard or another page
      navigate("/dashboard");
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

            {/* Date and time input for the start date */}
            <div className="flex flex-col">
              <label htmlFor="startDate" className="mb-2 font-semibold">
                Start Date
              </label>
              <input
                type="datetime-local"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded border p-2"
                required
              />
            </div>

            {/* Date and time input for the end date (deadline) */}
            <div className="flex flex-col">
              <label htmlFor="endDate" className="mb-2 font-semibold">
                Deadline
              </label>
              <input
                type="datetime-local"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded border p-2"
                required
              />
            </div>

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
                    {question.type === "multiple-choice" && (
                      <ul className="list-disc ml-4">
                        {question.options.map((option) => (
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
