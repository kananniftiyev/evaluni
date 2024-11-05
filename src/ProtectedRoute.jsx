import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("user"); // Replace with your auth logic
};

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};


export default ProtectedRoute;
