import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout"; // Optional
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotFound from "./pages/NotFound";
import IndexPage from "./pages/IndexPage";
import Dashboard from "./pages/Dashboard";
import CreateExamPage from "./pages/CreateExam";
import ExamPage from "./pages/ExamPage";
import ExamResultPage from "./pages/ExamResultPage";
import MyExamsPage from "./pages/MyExamsPage";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/exam/:id/view"
          element={<ProtectedRoute element={<ExamResultPage />} />}
        />
        <Route
          path="/dashboard/new"
          element={<ProtectedRoute element={<CreateExamPage />} />}
        />
        <Route
          path="/exam/:id"
          element={<ProtectedRoute element={<ExamPage />} />}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/dashboard/my-exams"
          element={<ProtectedRoute element={<MyExamsPage />} />}
        />
        <Route path="/" element={<PublicRoute element={<IndexPage />} />} />
        <Route
          path="login"
          element={<PublicRoute element={<LoginPage />} />}
        />{" "}
        {/* Protected as Public */}
        <Route
          path="register"
          element={<PublicRoute element={<SignUpPage />} />}
        />{" "}
        {/* Protected as Public */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
