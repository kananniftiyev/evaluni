import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const ExamPage = () => {
  const { id } = useParams(); // Get the exam ID from the URL
  const [user, setUser] = useState(null);
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      navigate('/login'); // Redirect to login if user is not logged in
      return;
    }
    setUser(loggedInUser);

    const fetchExamData = async () => {
      try {
        const examResponse = await fetch(`http://localhost:3000/exams/${id}`);
        if (!examResponse.ok) throw new Error('Exam not found');
        const examData = await examResponse.json();
        setExam(examData);

        // Check if the user already submitted this exam
        const resultsResponse = await fetch(`http://localhost:3000/results`);
        const resultsData = await resultsResponse.json();
        const userResult = resultsData.find(result => result.userId === loggedInUser.id && result.examId === id);
        
        if (userResult) setAlreadySubmitted(true); // If result exists, user has already submitted
      } catch (error) {
        console.error(error);
        navigate('/dashboard'); // Redirect to dashboard if exam is not found
      }
    };

    fetchExamData();
  }, [id, navigate]);

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (alreadySubmitted) return;

    // Process the answers and send to server
    const response = await fetch('http://localhost:3000/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      navigate('/dashboard'); // Redirect to dashboard after submission
    }
  };

  if (!exam) return <div>Loading...</div>;

  return (
    <div className="exam-page p-4">
      <h1 className="text-2xl font-semibold mb-4">{exam.title}</h1>
      <p className="mb-4">{exam.description}</p>
      {alreadySubmitted ? (
        <p className="text-red-500">You have already submitted this exam.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {exam.questions.map(question => (
            <div key={question.id} className="mb-4">
              <p className="font-semibold">{question.question}</p>
              {question.type === 'multiple-choice' ? (
                question.options.map(option => (
                  <label key={option.id} className="block">
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => handleAnswerChange(question.id, option.id)}
                      className="mr-2"
                    />
                    {option.text}
                  </label>
                ))
              ) : (
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="border p-2 w-full"
                  rows="4"
                />
              )}
            </div>
          ))}
          <Button text="Submit Answers" type="submit" disabled={alreadySubmitted} />
        </form>
      )}
    </div>
  );
};

export default ExamPage;
