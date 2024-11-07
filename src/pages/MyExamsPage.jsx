import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Layout from "../components/Layout";

const MyExamsPage = () => {
  const [user, setUser] = useState(null);
  const [createdExams, setCreatedExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        await fetch(`http://localhost:3000/exams/${examId}`, {
          method: "DELETE",
        });

        // Update the list of created exams
        setCreatedExams((prevExams) =>
          prevExams.filter((exam) => exam.id !== examId)
        );
      }
    } catch (error) {
      console.error("Error deleting the exam:", error);
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
    setParticipants([]);
  };

  return (
    <Layout>
      <div className="created-exams-page min-h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold">My Created Exams</h1>
        <ul className="space-y-4 mt-4">
          {createdExams.map((exam) => (
            <li key={exam.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{exam.title}</h2>
              <p>{exam.description}</p>
              <div className="flex gap-2">
                <Button
                  text="View Details"
                  onClick={() => viewExamDetails(exam.id)}
                />
                <Button
                  text="Delete Exam"
                  onClick={() => handleDeleteExam(exam.id)}
                  className="bg-red-500 text-white"
                />
              </div>
            </li>
          ))}
        </ul>

        {/* Modal for displaying leaderboard */}
        {isModalOpen && selectedExam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-lg font-semibold mb-4">
                Participants and Leaderboard
              </h2>
              <ul className="space-y-2">
                {participants.map((participant, index) => (
                  <li key={participant.id} className="bg-gray-50 p-2 rounded">
                    <p>
                      {index + 1}. {participant.userName}{" "}
                      {participant.userSurname} - {participant.userEmail} -
                      Score: {participant.score}
                    </p>
                  </li>
                ))}
              </ul>
              <Button text="Close" onClick={closeModal} className="mt-4" />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyExamsPage;
