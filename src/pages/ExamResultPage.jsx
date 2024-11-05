import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const ExamResultPage = () => {
  const { id } = useParams(); // Get the exam ID from the URL
  const [user, setUser] = useState(null);
  const [examResult, setExamResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      navigate('/login'); // Redirect to login if user is not logged in
      return;
    }
    setUser(loggedInUser);

    // Fetch the exam result for the specific exam ID
    const fetchExamResult = async () => {
      try {
        const resultsResponse = await fetch(`http://localhost:3000/results`);
        const resultsData = await resultsResponse.json();
        const userResult = resultsData.find(result => result.userId === loggedInUser.id && result.examId === id);

        if (!userResult) {
          navigate('/dashboard'); // Redirect to dashboard if result not found
          return;
        }

        // Fetch the exam details
        const examResponse = await fetch(`http://localhost:3000/exams/${id}`);
        if (!examResponse.ok) throw new Error('Exam not found');
        const examData = await examResponse.json();

        setExamResult({ ...userResult, exam: examData });
      } catch (error) {
        console.error(error);
        navigate('/dashboard'); // Redirect to dashboard on error
      }
    };

    fetchExamResult();
  }, [id, navigate]);

  if (!examResult) return <div>Loading...</div>;

  return (
    <div className="view-exam-result p-4">
      <h1 className="text-2xl font-semibold mb-4">{examResult.exam.title}</h1>
      <p className="mb-4">{examResult.exam.description}</p>
      <h2 className="text-lg font-semibold mb-2">Your Answers</h2>
      {examResult.exam.questions.map(question => {
        // Find the user's selected answer for the current question
        const userAnswer = examResult.answers.find(answer => answer.questionId === question.id);
        const isCorrect = userAnswer?.selectedOption === question.correctAnswer; // Check if the selected answer is correct

        return (
          <div key={question.id} className="mb-4">
            <p className="font-semibold">{question.question}</p>
            {question.options ? (
              <p className={`font-semibold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                Your answer: {userAnswer ? question.options.find(opt => opt.id === userAnswer.selectedOption)?.text : 'No answer selected'}
              </p>
            ) : (
              <p className="font-semibold">This is an open-ended question.</p>
            )}
            {!isCorrect && userAnswer && (
              <p className="text-red-600">Correct answer: {question.correctAnswer}</p>
            )}
          </div>
        );
      })}
      <Button text="Back to Dashboard" onClick={() => navigate('/dashboard')} />
    </div>
  );
};

export default ExamResultPage;
