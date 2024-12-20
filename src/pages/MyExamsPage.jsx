import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Layout from "../components/Layout";
import { Bar } from "react-chartjs-2"; // Import Bar chart from react-chartjs-2
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register the necessary components for Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const MyExamsPage = () => {
  const [user, setUser] = useState(null);
  const [createdExams, setCreatedExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();

  // Fetch the current user
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch exams created by the user
  useEffect(() => {
    if (!user) return;

    const fetchCreatedExams = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/exams?creatorId=${user.id}`
        );
        const data = await response.json();
        setCreatedExams(data);
      } catch (error) {
        console.error("Error fetching created exams:", error);
      }
    };

    fetchCreatedExams();
  }, [user]);

  // Fetch participants and leaderboard for the selected exam
  const viewExamDetails = async (examId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/results?examId=${examId}`
      );
      const data = await response.json();

      // Enrich the results with user details
      const enrichedParticipants = await Promise.all(
        data.map(async (result) => {
          const userResponse = await fetch(
            `http://localhost:3000/users/${result.userId}`
          );
          const userData = await userResponse.json();
          return {
            ...result,
            userName: userData.name,
            userSurname: userData.surname,
            userEmail: userData.email,
          };
        })
      );

      // Sort participants by score for leaderboard
      const sortedParticipants = enrichedParticipants.sort(
        (a, b) => b.score - a.score
      );
      setParticipants(sortedParticipants);

      // Prepare data for the chart
      setChartData({
        labels: sortedParticipants.map(
          (participant) => `${participant.userName} ${participant.userSurname}`
        ),
        datasets: [
          {
            label: "Scores",
            data: sortedParticipants.map((participant) => participant.score),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });

      setSelectedExam(examId);
      setIsModalOpen(true); // Open the modal when exam details are fetched
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  // Handle delete exam
  const handleDeleteExam = async (examId) => {
    try {
      if (window.confirm("Are you sure you want to delete this exam?")) {
        const resultsResponse = await fetch(
          `http://localhost:3000/results?examId=${examId}`
        );
        const results = await resultsResponse.json();

        if (resultsResponse.ok && results.length > 0) {
          for (const result of results) {
            const resultId = result.id;
            const deleteResultResponse = await fetch(
              `http://localhost:3000/results/${resultId}`,
              {
                method: "DELETE",
              }
            );

            if (!deleteResultResponse.ok) {
              console.error(`Failed to delete result with ID: ${resultId}`);
            }
          }
        }

        const examResponse = await fetch(
          `http://localhost:3000/exams/${examId}`,
          {
            method: "DELETE",
          }
        );

        if (!examResponse.ok) {
          console.error("Failed to delete exam");
          return;
        }

        setCreatedExams((prevExams) =>
          prevExams.filter((exam) => exam.id !== examId)
        );
        console.log(`Successfully deleted exam and its results`);
      }
    } catch (error) {
      console.error("Error deleting the exam and its related results:", error);
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
    setParticipants([]);
    setChartData(null); // Clear chart data on close
  };

  return (
    <Layout>
      <div className="created-exams-page p-4 min-h-screen w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4 text-center revoult-black-text">
          My Created Exams
        </h1>
        <ul className="space-y-4 mt-4">
          {createdExams.map((exam) => (
            <li
              key={exam.id}
              className="revoult-white p-4 rounded-lg shadow-sm"
            >
              <h2 className="text-lg font-semibold revoult-black-text">
                {exam.title}
              </h2>
              <p className="revoult-black-text">{exam.description}</p>
              <div className="flex gap-2 mt-4">
                <Button
                  text="View Details"
                  onClick={() => viewExamDetails(exam.id)}
                  className="revoult-black-button"
                />
                <Button
                  text="Delete Exam"
                  onClick={() => handleDeleteExam(exam.id)}
                  className="bg-red-500 text-white revoult-black-button"
                />
              </div>
            </li>
          ))}
        </ul>

        {/* Modal for displaying leaderboard */}
        {isModalOpen && selectedExam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-lg font-semibold mb-4 revoult-black-text">
                Participants and Leaderboard
              </h2>
              {/* Chart.js visualization */}
              {chartData && (
                <div className="mb-4">
                  <Bar data={chartData} />
                </div>
              )}
              <ul className="space-y-2">
                {participants.map((participant, index) => (
                  <li key={participant.id} className="bg-gray-50 p-2 rounded">
                    <p className="revoult-black-text">
                      {index + 1}. {participant.userName}{" "}
                      {participant.userSurname} - {participant.userEmail} -
                      Score: {participant.score}
                    </p>
                  </li>
                ))}
              </ul>
              <Button
                text="Close"
                onClick={closeModal}
                className="mt-4 revoult-black-button"
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyExamsPage;
