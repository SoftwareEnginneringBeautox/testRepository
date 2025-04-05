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
  // Use a fallback URL if REACT_APP_API_URL is not defined.
  const API_BASE_URL = import.meta.env.VITE_API_URL; 
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
        `${API_BASE_URL}/login`,
        { username: trimmedUsername, password },
        { withCredentials: true }
      );

      // If the response is HTML, log the text to help debug.
      if (typeof response.data === "string" && response.data.startsWith("<!doctype html>")) {
        console.error("Received unexpected HTML response:", response.data);
        setErrorMessage("Login failed due to server misconfiguration.");
        return;
      }

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
        } else if (data.role === "receptionist" || data.role === "aesthetician") {
          navigate("/StaffDashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.log(`Login failed for "${trimmedUsername}":`, data.message);
        setErrorMessage(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error(`Error during login attempt for "${trimmedUsername}":`, error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-12">
      {/* Image section - Improved responsiveness */}
      <div className="hidden md:block md:col-span-7 lg:col-span-8 h-screen relative overflow-hidden">
        <picture>
          <source media="(min-width: 1536px)" srcSet="/images/BeautoxLoginImage.png" />
          <source media="(min-width: 1024px)" srcSet="/images/BeautoxLoginImage.png" />
          <source media="(min-width: 768px)" srcSet="/images/BeautoxLoginImage-md.png" />
          <img
            src="/images/BeautoxLoginImage.png"
            alt="Beautox Login"
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
            sizes="(min-width: 768px) 60vw, 100vw"
          />
        </picture>
        {/* Optional gradient overlay for better text visibility if needed */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none hidden lg:block"></div>
      </div>

      {/* Login form section - Full width on mobile, proportional on larger screens */}
      <div className="flex-1 flex items-center justify-center md:col-span-5 lg:col-span-4 py-6 px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-md mx-auto">
          <div className="flex flex-col items-center">
            {/* Responsive logo */}
            <img
              src={BeautoxLogo}
              alt="Beautox Logo"
              className="mb-4 w-32 sm:w-36 md:w-40 lg:w-44 h-auto"
            />
            
            {/* Responsive heading */}
            <h2 className="font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-2 leading-tight">
              Welcome to PRISM,
            </h2>
            
            {/* Responsive paragraph */}
            <p className="text-xs sm:text-sm md:text-base text-center mb-6 max-w-sm px-2">
              BEAUTOX'S PATIENT RECORDS, INTEGRATION, SCHEDULING, AND MANAGEMENT
            </p>
          </div>

          {/* Alert messages */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm text-center mb-4">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-md text-sm text-center mb-4">
              {successMessage}
            </div>
          )}

          {/* Login form */}
          <form data-cy="login-form" onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
            <InputContainer className="transition-all duration-200">
              <InputLabel className="text-xs sm:text-sm">Username</InputLabel>
              <InputTextField className="mt-1 sm:mt-2">
                <InputIcon className="text-gray-400">
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </InputIcon>
                <Input
                  data-cy="login-username"
                  type="text"
                  id="username"
                  className="text-input text-sm sm:text-base h-10 sm:h-12"
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={(e) => setUsername(e.target.value.trim())}
                  placeholder="e.g. john_doe123"
                  required
                />
              </InputTextField>
            </InputContainer>

            <InputContainer className="transition-all duration-200">
              <InputLabel className="text-xs sm:text-sm">Password</InputLabel>
              <InputTextField className="mt-1 sm:mt-2">
                <InputIcon className="text-gray-400">
                  <PasswordIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </InputIcon>
                <Input
                  data-cy="login-password"
                  type="password"
                  id="password"
                  className="text-input text-sm sm:text-base h-10 sm:h-12"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. P@ssw0rd123"
                  value={password}
                  required
                />
              </InputTextField>
            </InputContainer>

            {/* Forgot password link */}
            <p className="text-customNeutral-300 text-xs font-bold leading-5 text-center transition-all duration-200 hover:text-customNeutral-400">
              FORGOT PASSWORD?{" "}
              <a
                data-cy="forgot-password-link"
                href="#"
                className="underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
                onClick={(e) => {
                  e.preventDefault();
                  openModal("forgotPassword");
                }}
              >
                CLICK HERE
              </a>
            </p>

            {/* Responsive button */}
            <Button 
              className="mt-2 py-2 sm:py-3 text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2"
              type="submit"
              data-cy="login-submit"
            >
              <LoginIcon size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>LOGIN</span>
            </Button>
          </form>
        </div>

        {/* Forgot Password Modal */}
        {currentModal === "forgotPassword" && (
          <ForgotPassword isOpen={true} onClose={closeModal} />
        )}
      </div>
    </div>
  );
}

export default Login;