import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import UserIcon from "../assets/icons/UserIcon";
import PasswordIcon from "../assets/icons/PasswordIcon";
import LoginIcon from "../assets/icons/LoginIcon";
import BeautoxLogo from "../assets/logos/Beautox.svg";

import {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input
} from "@/components/ui/Input";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for session management
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("Login successful! Redirecting...");
        console.log("Login successful");

        // Save token, role, and username in localStorage for client-side checks
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);

        // Dispatch a custom event to notify other components (like UserProfile)
        window.dispatchEvent(new Event("userProfileUpdated"));

        // Redirect based on role (placeholder routes for now)
        if (data.role === "admin") {
          navigate("/adminDashboard");
        } else if (data.role === "receptionist") {
          navigate("/receptionistDashboard");
        } else if (data.role === "aesthetician") {
          navigate("/aestheticianDashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setErrorMessage(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-12">
      <div className="h-screen col-span-7">
        <img
          src="/src/assets/images/Beautox Login Image.png"
          alt="Beautox Login Image"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="user-login fcc col-span-5 flex flex-row items-center justify-center">
        <div className="login-container w-[90%]">
          <img
            src={BeautoxLogo}
            alt="Beautox Logo"
            className="mb-4 m-auto w-2/5"
          />
          <h2 className="font-semibold leading-[67.2px] text-[48px] text-center">
            Welcome to PRISM,
          </h2>
          <p className="leading-8 text-center">
            BEAUTOX’S PATIENT RECORDS, INTEGRATION, SCHEDULING, AND MANAGEMENT
          </p>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mt-2">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="text-green-500 text-sm text-center mt-2">
              {successMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <InputContainer>
              <InputLabel>Username</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIcon />
                </InputIcon>
                <Input
                  type="text"
                  id="username"
                  className="text-input"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. john_doe123"
                  required
                />
              </InputTextField>
            </InputContainer>

            <InputContainer>
              <InputLabel>Password</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PasswordIcon />
                </InputIcon>
                <Input
                  type="password"
                  id="password"
                  className="text-input"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. P@ssw0rd123"
                  value={password}
                  required
                />
              </InputTextField>
            </InputContainer>

            <p className="text-customNeutral-300 text-xs font-bold leading-5 text-center">
              FORGOT PASSWORD?{" "}
              <a href="" className="underline">
                CLICK HERE
              </a>
            </p>

            <Button>
              <LoginIcon size={24} />
              LOGIN
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
