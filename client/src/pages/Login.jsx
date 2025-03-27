import { useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import UserIcon from "../assets/icons/UserIcon";
import PasswordIcon from "../assets/icons/PasswordIcon";
import LoginIcon from "../assets/icons/LoginIcon";
import BeautoxLogo from "../assets/logos/Beautox.svg";
import axios from "axios";

import ForgotPassword from "@/components/modals/ForgotPassword";

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

  const { currentModal, openModal, closeModal } = useModal();

  const navigate = useNavigate();

  // Listen for login events from other tabs.
  useEffect(() => {
    const syncLogin = (event) => {
      if (event.key === "login") {
        window.location.reload();
      }
    };
    window.addEventListener("storage", syncLogin);
    return () => {
      window.removeEventListener("storage", syncLogin);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const trimmedUsername = username.trim();

    try {
      console.log("Attempting login for:", trimmedUsername);
      const response = await axios.post(
        "http://localhost:4000/login",
        { username: trimmedUsername, password },
        { withCredentials: true } // Ensure cookies are sent
      );

      const data = response.data;
      console.log("Received login response:", data);

      if (data.success) {
        setSuccessMessage("Login successful! Redirecting...");
        console.log("Login successful for:", trimmedUsername);

        // Save authentication details in localStorage.
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("loginTime", Date.now());
        localStorage.setItem("login", Date.now());

        window.dispatchEvent(new Event("userProfileUpdated"));

        // Redirect based on role.
        if (data.role === "admin") {
          navigate("/AdminDashboard");
        } else if (
          data.role === "receptionist" ||
          data.role === "aesthetician"
        ) {
          navigate("/StaffDashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.log(`Login failed for "${trimmedUsername}":`, data.message);
        setErrorMessage(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error(
        `Error during login attempt for "${trimmedUsername}":`,
        error
      );
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
                  onBlur={(e) => setUsername(e.target.value.trim())}
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
              <a
                href="#"
                className="underline"
                onClick={() => openModal("forgotPassword")}
              >
                CLICK HERE
              </a>
            </p>

            <Button>
              <LoginIcon size={24} />
              LOGIN
            </Button>
          </form>
        </div>
        {currentModal === "forgotPassword" && (
          <ForgotPassword isOpen={true} onClose={closeModal} />
        )}
      </div>
    </div>
  );
}

export default Login;
