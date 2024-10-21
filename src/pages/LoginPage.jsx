import Button from "../components/Button";
import Field from "../components/Field";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Layout from "../components/Layout";
import axios from "axios";

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate email
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email.");
      return; // Stop further processing
    } else {
      setEmailError("");
    }

    try {
      // Fetch all users from the server
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data;

      console.log(email);
      console.log(password);

      // Find the user with the matching email
      const user = users.find((user) => user.email === email);

      console.log("Fetched Users:", users);
      console.log("User:", user);

      if (!user) {
        setLoginError("User with this email does not exist.");
      } else if (user.password !== password) {
        setLoginError("Incorrect password.");
      } else {
        // Successfully logged in
        console.log("User logged in successfully:", user);
        setLoginError(""); // Clear error on successful login
        // You can redirect to another page or handle login state here
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoginError("An error occurred while trying to log in.");
    }
  };

  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isRetina = useMediaQuery({ query: "(max-width: 600px)" });

  return (
    <Layout>
      <div className="flex-grow flex items-center justify-center">
        <div
          className={`mx-auto ${
            isRetina ? "w-full px-4" : isBigScreen ? "w-1/4" : "w-1/5"
          }`}
        >
          <h1
            className={`font-medium mb-2 ${
              isBigScreen ? "text-7xl" : "text-5xl"
            }  `}
          >
            Welcome back
          </h1>
          {/* font sizes  for big screen */}
          <p
            className={`text-gray-600 ml-1 mb-3 ${
              isBigScreen ? "text-lg" : "text-base"
            }`}
          >
            Enter the email and password to access to the account
          </p>
          <div className="flex flex-col gap-4">
            {emailError && (
              <p className="ml-1 text-red-500 text-sm mb-1 font-semibold">
                {emailError}
              </p>
            )}
            {loginError && (
              <p className="ml-1 text-red-500 text-sm mb-1 font-semibold">
                {loginError}
              </p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field
                text="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Field
                text="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <a href="" className="ml-1 text-blue-600 font-medium">
                Forgot Password?
              </a>
              <Button
                text="Continue"
                onClick={handleSubmit}
                disabled={!email || !password}
              />
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;
