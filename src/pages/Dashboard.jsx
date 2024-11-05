import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [exams, setExams] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      navigate('/login');
    }

    fetch('http://localhost:3000/exams')
      .then(response => response.json())
      .then(data => setExams(data));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCreateExam = () => {
    navigate('/dashboard/newExam');
  };

  return (
    <div className="dashboard min-h-screen bg-gray-100">
      <nav className="navbar text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center ">
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
            {exams.map(exam => (
              <li key={exam.id} className="bg-white p-4 rounded shadow">
                <h4 className="text-md font-semibold">{exam.name}</h4>
                <p className="text-gray-600">{exam.description}</p>
                <Button text="View Exam" onClick={() => navigate(`/exam/${exam.id}`)} />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
