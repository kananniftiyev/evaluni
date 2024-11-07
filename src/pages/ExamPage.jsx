import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";

const ExamPage = () => {
  const { id } = useParams(); // Get the exam ID from the URL
  const [user, setUser] = useState(null);
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [isExamOpen, setIsExamOpen] = useState(true); // To track if the exam is open for submission
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      navigate("/login"); // Redirect to login if user is not logged in
      return;
    }
    setUser(loggedInUser);

    const fetchExamData = async () => {
      try {
        const examResponse = await fetch(`http://localhost:3000/exams/${id}`);
        if (!examResponse.ok) throw new Error("Exam not found");
        const examData = await examResponse.json();
        setExam(examData);

        // Check if the user already submitted this exam
        const resultsResponse = await fetch(`http://localhost:3000/results`);
        const resultsData = await resultsResponse.json();
        const userResult = resultsData.find(
          (result) => result.userId === loggedInUser.id && result.examId === id
        );

        if (userResult) setAlreadySubmitted(true); // If result exists, user has already submitted

        // Check if the exam is open for submission
        const currentTime = new Date();
        const startTime = new Date(examData.startDate);
        const endTime = new Date(examData.endDate);

        // If the current time is before the start date or after the deadline, the exam is closed
        if (currentTime < startTime || currentTime > endTime) {
          setIsExamOpen(false);
        }
      } catch (error) {
        console.error(error);
        navigate("/dashboard"); // Redirect to dashboard if exam is not found
      }
    };

    fetchExamData();
  }, [id, navigate]);

  const handleAnswerChange = (questionId, selectedOptionText) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOptionText, // Store option.text instead of option.id
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (alreadySubmitted || !isExamOpen) return;

    // Process the answers and send to server
    const response = await fetch("http://localhost:3000/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        examId: id,
        answers,
        score: calculateScore(answers, exam), // A function to calculate score based on answers
        submittedAt: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      setAlreadySubmitted(true);
      navigate("/dashboard"); // Redirect to dashboard after submission
    }
  };

  const calculateScore = (answers, exam) => {
    let score = 0;

    // Loop through each question in the exam
    exam.questions.forEach((question) => {
      const userAnswer = answers[question.id];

      console.log(
        `User Answer: ${userAnswer}, Correct Answer: ${question.correctAnswer}`
      );

      // Check if the question is multiple choice or open-ended
      if (question.type === "multiple-choice" && userAnswer) {
        if (userAnswer === question.correctAnswer) {
          score += 1; // Increment score for correct answer (option ID comparison)
        }
      } else if (question.type === "open-ended" && userAnswer) {
        // Handle open-ended question scoring (simple validation here)
        if (
          userAnswer.trim().toLowerCase() ===
          question.correctAnswer.trim().toLowerCase() // Comparison for open-ended answers
        ) {
          score += 1; // Increment score if the open-ended answer is correct
        }
      }
    });

    return score;
  };

  if (!exam) return <div>Loading...</div>;

  return (
    <div className="exam-page p-4">
      <h1 className="text-2xl font-semibold mb-4">{exam.title}</h1>
      <p className="mb-4">{exam.description}</p>

      {/* Show if the exam is not open for submission */}
      {!isExamOpen && (
        <p className="text-red-500">
          The exam is not available for submission. It may have already ended or
          hasn't started yet.
        </p>
      )}

      {alreadySubmitted ? (
        <p className="text-red-500">You have already submitted this exam.</p>
      ) : isExamOpen ? (
        <form onSubmit={handleSubmit}>
          {exam.questions.map((question) => (
            <div key={question.id} className="mb-4">
              <p className="font-semibold">{question.question}</p>
              {question.type === "multiple-choice" ? (
                question.options.map((option) => (
                  <label key={option.id} className="block">
                    <input
                      type="radio"
                      name={question.id} // Ensure name is unique for each question group
                      value={option.text} // Use option.text as the value for selection
                      checked={answers[question.id] === option.text} // Compare against stored option.text
                      onChange={() =>
                        handleAnswerChange(question.id, option.text)
                      } // Pass option.text
                      className="mr-2"
                    />
                    {option.text}
                  </label>
                ))
              ) : (
                <textarea
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  className="border p-2 w-full"
                  rows="4"
                />
              )}
            </div>
          ))}
          <Button
            text="Submit Answers"
            type="submit"
            disabled={alreadySubmitted || !isExamOpen}
          />
        </form>
      ) : null}
    </div>
  );
};

export default ExamPage;
