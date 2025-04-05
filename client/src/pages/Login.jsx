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
    <div className="min-h-screen">
      {/* Mobile and Tablet View (smaller than xl screens) */}
      <div className="xl:hidden min-h-screen relative">
        {/* Background Image with Overlay */}
        <div 
          className="fixed inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/images/BeautoxLoginImage.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed"
          }}
        >
          {/* White overlay with transparency */}
          <div className="absolute inset-0 bg-white/20"></div>
          {/* Purple overlay with blur */}
          <div className="absolute inset-0 bg-purple-900/5 backdrop-blur-[1px]"></div>
        </div>

        {/* Login Card */}
        <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] bg-white rounded-3xl shadow-lg p-6 sm:p-8">
            <div className="flex flex-col items-center mb-6 sm:mb-8">
              <img
                src={BeautoxLogo}
                alt="Beautox Logo"
                className="w-14 sm:w-16 md:w-20 h-auto mb-5 sm:mb-6"
              />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2">
                Welcome to PRISM,
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 text-center max-w-[280px] mx-auto">
                BEAUTOX PATIENT RECORDS, INTEGRATION, SCHEDULING AND MANAGEMENT
              </p>
            </div>

            {/* Alert Messages */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-xs sm:text-sm text-center mb-4">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-md text-xs sm:text-sm text-center mb-4">
                {successMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 w-full">
              <div className="w-full">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Username
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Password
                </label>
                <div className="relative w-full">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-3 w-3 sm:h-4 sm:w-4"
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openModal("forgotPassword");
                  }}
                  className="text-purple-600 hover:text-purple-500"
                >
                  Forgot password?
                </a>
              </div>

              <div className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-5 w-full">
                <Button 
                  type="submit"
                  className="w-full bg-purple-950 hover:bg-purple-900 text-white py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200"
                >
                  LOGIN
                </Button>

                <Button 
                  variant="outline"
                  onClick={() => navigate("/")}
                  type="button"
                  className="w-full bg-white border border-purple-950 text-gray-700 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  RETURN
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Desktop View (xl and larger screens) */}
      <div className="hidden xl:grid xl:grid-cols-12 min-h-screen">
        <div className="md:col-span-7 lg:col-span-8 h-screen relative overflow-hidden">
          <img
            src="/images/BeautoxLoginImage.png"
            alt="Beautox Login"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        </div>

        <div className="flex-1 flex items-center justify-center md:col-span-5 lg:col-span-4 py-6 px-4 sm:px-6 md:px-8">
          <div className="w-full max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <img
                src={BeautoxLogo}
                alt="Beautox Logo"
                className="mb-4 w-32 sm:w-36 md:w-40 lg:w-44 h-auto"
              />
              <h2 className="font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-2 leading-tight">
                Welcome to PRISM,
              </h2>
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
              <div className="space-y-3 pt-4">
                <Button 
                  type="submit"
                  className="w-full bg-purple-950 hover:bg-purple-900 text-white py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <LoginIcon className="w-5 h-5" />
                  <span>LOGIN</span>
                </Button>

                <Button 
                  variant="outline"
                  onClick={() => navigate("/")}
                  type="button"
                  className="w-full bg-white border border-purple-950 text-gray-700 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  RETURN
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {currentModal === "forgotPassword" && (
        <ForgotPassword isOpen={true} onClose={closeModal} />
      )}
    </div>
  );
}

export default Login;