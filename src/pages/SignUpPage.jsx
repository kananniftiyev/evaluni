import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Button from "../components/Button";
import Field from "../components/Field";
import Layout from "../components/Layout";
import { useMediaQuery } from "react-responsive";
import axios from "axios";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear errors for the respective field when the user types
    if (name === "email") {
      setErrors((prevErrors) => ({ ...prevErrors, emailError: "" }));
    }
    if (name === "confirmPassword" || name === "password") {
      setErrors((prevErrors) => ({ ...prevErrors, passwordError: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let valid = true;
    let newErrors = { emailError: "", passwordError: "" };

    // Validate email
    if (!emailRegex.test(formData.email)) {
      newErrors.emailError = "Please enter a valid email.";
      valid = false;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.passwordError = "Passwords do not match.";
      valid = false;
    }

    // Set errors if any
    setErrors(newErrors);

    // If form is valid, proceed with checking for existing email
    if (valid) {
      try {
        // First, check if the email already exists
        const response = await axios.get("http://localhost:3000/users");
        const existingUsers = response.data;

        const userExists = existingUsers.some(
          (user) => user.email === formData.email
        );

        if (userExists) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            emailError: "Email is already registered.",
          }));
        } else {
          // Proceed with registration if email is not taken
          const newUser = {
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
            password: formData.password, // In a real app, encrypt this!
            role: "student", // Assuming the role is 'student'
          };

          const postResponse = await axios.post(
            "http://localhost:3000/users",
            newUser,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (postResponse.status === 201) {
            navigate("/login");
          } else {
            console.error("Failed to register user.");
          }
        }
      } catch (error) {
        console.error("Error during the request:", error);
      }
    }
  };

  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isRetina = useMediaQuery({ query: "(max-width: 600px)" });

  return (
    <Layout>
      <div className="flex-grow flex items-center justify-center">
        <div className={`mx-auto ${isRetina ? "w-full px-4" : "w-1/5"}`}>
          <h1
            className={`font-medium mb-2 ${
              isBigScreen ? "text-7xl" : "text-5xl"
            }  `}
          >
            Welcome
          </h1>
          <p
            className={`text-gray-600 ml-1 mb-3 ${
              isBigScreen ? "text-lg" : "text-base"
            }`}
          >
            Enter the email and password to access to the account
          </p>
          {errors.emailError && (
            <p className="ml-1 text-red-500 text-sm mb-1 font-semibold">
              {errors.emailError}
            </p>
          )}
          {errors.passwordError && (
            <p className="ml-1 text-red-500 text-sm mb-1 font-semibold">
              {errors.passwordError}
            </p>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field
              text="Name"
              name="name"
              value={formData.name} // Controlled input
              onChange={handleInputChange}
            />
            <Field
              text="Surname"
              name="surname"
              value={formData.surname} // Controlled input
              onChange={handleInputChange}
            />

            <Field
              text="Email"
              type="email"
              name="email"
              red={!!errors.emailError}
              value={formData.email} // Controlled input
              onChange={handleInputChange}
            />

            <Field
              text="Password"
              type="password"
              name="password"
              value={formData.password}
              red={!!errors.passwordError} // Controlled input
              onChange={handleInputChange}
            />
            <Field
              text="Confirm Password"
              type="password"
              name="confirmPassword"
              red={!!errors.passwordError}
              value={formData.confirmPassword} // Controlled input
              onChange={handleInputChange}
            />
            <Button
              text="Sign up"
              onClick={handleSubmit}
              disabled={
                !formData.name ||
                !formData.surname ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword
              }
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SignUpPage;
