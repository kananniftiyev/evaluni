import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Layout from "../components/Layout";
import Field from "../components/Field";
import Papa from "papaparse"; // Importing the papaparse library
import axios from "axios"; // Import Axios
import Modal from "../components/Modal";

const NewExamPage = () => {
  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState(15); // Default to 15 minutes
  const [creatorId, setCreatorId] = useState(null); // State for storing creator ID
  const [showModal, setShowModal] = useState(false); // New state to control modal visibility
  const [examId, setExamId] = useState(null); // New state for exam ID
  const [examTitleError, setExamTitleError] = useState(""); // Error state for exam title
  const navigate = useNavigate();

  // This function gets the current user's ID, assuming it's stored in localStorage.
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCreatorId(user.id);
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
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedQuestions = [];

        results.data.forEach((line) => {
          if (line.length > 0) {
            const question = line[0].trim();

            if (line.length === 5) {
              const correctOptionText = line[1].trim();
              const options = [
                { id: "a", text: correctOptionText },
                { id: "b", text: line[2].trim() },
                { id: "c", text: line[3].trim() },
                { id: "d", text: line[4].trim() },
              ];

              const shuffledOptions = shuffleArray([...options]);

              parsedQuestions.push({
                id: `q${parsedQuestions.length + 1}`,
                type: "multiple-choice",
                question,
                options: shuffledOptions,
                correctAnswer: correctOptionText,
              });
            } else if (line.length === 2) {
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

    if (!examTitle) {
      setExamTitleError("Exam title is required.");
      return;
    } else {
      setExamTitleError("");
    }

    if (!startDate || !duration) {
      console.error("Please set both start date and duration.");
      return;
    }

    if (!creatorId) {
      console.error("User is not logged in.");
      return;
    }

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + duration); // Set the end date based on the duration

    const newExam = {
      id: `exam${Date.now()}`,
      title: examTitle,
      description: examDescription,
      startDate: new Date(startDate).toISOString(),
      endDate: endDate.toISOString(),
      questions,
      results: [],
      creatorId,
    };

    try {
      await axios.post("http://localhost:3000/exams", newExam);
      setExamId(newExam.id);
      setShowModal(true);

      navigate("/dashboard", {
        state: { showModal: true, examId: newExam.id },
      });
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
            {examTitleError && (
              <p className="ml-1 text-red-500 text-sm mb-1 font-semibold">
                {examTitleError}
              </p>
            )}
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

            <div className="flex flex-col">
              <label htmlFor="duration" className="mb-2 font-semibold">
                Duration (in minutes)
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="rounded border p-2"
                required
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            <Button text="Create Exam" onClick={handleSubmit} />
          </form>

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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        examId={examId}
      />
    </Layout>
  );
};

export default NewExamPage;
