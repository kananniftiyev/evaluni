import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [exams, setExams] = useState([]);
  const [userExams, setUserExams] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Fetch and set user only once
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch exams and results only when `user` is set
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [examsResponse, resultsResponse] = await Promise.all([
          fetch('http://localhost:3000/exams'),
          fetch('http://localhost:3000/results'),
        ]);

        const examsData = await examsResponse.json();
        const resultsData = await resultsResponse.json();

        // Filter results for the logged-in user
        const userResults = resultsData.filter(result => result.userId === user.id);

        // Map user results to their corresponding exams
        const submittedExams = userResults.map(result => {
          const exam = examsData.find(exam => exam.id === result.examId);
          return {
            ...exam,
            score: result.score,
            submittedAt: result.submittedAt,
            id: exam.id,
          };
        });

        setUserExams(submittedExams);
      } catch (error) {
        console.error('Error fetching exams or results:', error);
      }
    };

    fetchData();
  }, [user]); // Only re-run when `user` changes

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCreateExam = () => {
    navigate('/dashboard/new');
  };

  return (
    <div className="dashboard min-h-screen bg-gray-100">
      <nav className="navbar text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
            Evaluni Dashboard
          </h1>
          {user && (
            <div className="relative">
              <button
                className="text-lg focus:outline-none flex items-center gap-2"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.email}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                  <ul className="py-1">
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => navigate('/account')}
                      >
                        Account Settings
                      </button>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Welcome to Evaluni</h2>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Create Exam</h3>
          <Button text="Create Exam" onClick={handleCreateExam} />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Past Exams</h3>
          <ul className="space-y-4">
            {userExams.length > 0 ? (
              userExams.map(exam => (
                <li key={exam.id} className="bg-white p-4 rounded shadow">
                  <h4 className="text-md font-semibold">{exam.title}</h4>
                  <p className="text-gray-600">{exam.description}</p>
                  <p className="text-gray-600">Score: {exam.score}</p>
                  <p className="text-gray-600">Submitted At: {new Date(exam.submittedAt).toLocaleString()}</p>
                  <Button text="View Exam" onClick={() => {
    console.log(`Navigating to /exam/${exam.id}/view`);
    navigate(`/exam/${exam.id}/view`);
}} />

                </li>
              ))
            ) : (
              <p>No past exams found.</p>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
