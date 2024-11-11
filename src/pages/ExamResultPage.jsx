import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";

const ExamResultPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [exam, setExam] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      navigate("/login");
      return;
    }
    setUser(loggedInUser);

    const fetchExamData = async () => {
      try {
        const examResponse = await fetch(`http://localhost:3000/exams/${id}`);
        if (!examResponse.ok) throw new Error("Exam not found");
        const examData = await examResponse.json();
        setExam(examData);

        const resultsResponse = await fetch(`http://localhost:3000/results`);
        const resultsData = await resultsResponse.json();
        const userResult = resultsData.find(
          (result) => result.userId === loggedInUser.id && result.examId === id
        );

        if (userResult) {
          setResult(userResult);
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error(error);
        navigate("/dashboard");
      }
    };

    fetchExamData();
  }, [id, navigate]);

  if (!exam || !result) return <div>Loading...</div>;

  return (
    <div className="exam-result-page p-4 min-h-screen w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4 text-center revoult-black-text">
        {exam.title} - Result
      </h1>
      <p className="mb-4 italic revoult-black-text">{exam.description}</p>

      <hr className="my-4 border-t-2 border-[#21262e]" />

      <div className="result-summary mb-4">
        <h2 className="text-xl font-semibold revoult-black-text">
          Your Score: {result.score} / {exam.questions.length}
        </h2>
        <p className="text-green-500 revoult-black-text">
          {result.score === exam.questions.length
            ? "Excellent!"
            : result.score > exam.questions.length / 2
            ? "Good job!"
            : "Better luck next time!"}
        </p>
      </div>

      <div className="answers">
        <h3 className="text-lg font-semibold revoult-black-text">
          Your Answers:
        </h3>
        {exam.questions.map((question) => (
          <div
            key={question.id}
            className="mb-4 rounded-lg bg-blue-600 p-5 revoult-white shadow-sm"
          >
            <p className="font-semibold revoult-black-text">
              {question.question}
            </p>
            <p className="revoult-black-text">
              <strong>Your Answer: </strong>
              {result.answers[question.id] || "No answer"}
            </p>
            <p className="revoult-black-text">
              <strong>Correct Answer: </strong>
              {question.correctAnswer}
            </p>
          </div>
        ))}
      </div>

      <Button text="Back to Dashboard" onClick={() => navigate("/dashboard")} />
    </div>
  );
};

export default ExamResultPage;
