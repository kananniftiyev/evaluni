import Button from "../components/Button";
import Field from "../components/Field";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Layout from "../components/Layout";

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate email
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email.");
    } else {
      setEmailError("");
      // Process form submission (e.g., API call)
      console.log("Email:", email);
      console.log("Password:", password);
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
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;
