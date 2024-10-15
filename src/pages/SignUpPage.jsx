import { useState } from "react";
import Button from "../components/Button";
import Field from "../components/Field";
import Layout from "../components/Layout";
import "../responsive.css";

const SignUpPage = () => {
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

  const handleSubmit = (event) => {
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

    // If form is valid, proceed with form submission
    if (valid) {
      console.log("Form Data:", formData);
      // Your form submission logic (e.g., API call) goes here
    }
  };

  return (
    <Layout>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-1/5 mx-auto">
          <h1 className="text-5xl font-medium mb-2">Welcome</h1>
          <p className="text-gray-600 ml-1 mb-3">
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
