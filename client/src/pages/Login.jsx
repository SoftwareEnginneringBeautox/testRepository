import { useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/Button";
import UserIcon from "../assets/icons/UserIcon";
import PasswordIcon from "../assets/icons/PasswordIcon";
import LoginIcon from "../assets/icons/LoginIcon";
import BeautoxLogo from "../assets/logos/Beautox.svg";
import axios from "axios";
import ForgotPassword from "@/components/modals/ForgotPassword";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import { LoaderWrapper, Loader } from "@/components/ui/Loader";
// Import the hook for reCAPTCHA v3
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input
} from "@/components/ui/Input";

function Login() {
  // Use a fallback URL if VITE_API_URL is not defined.
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState("");
  const { theme, setTheme } = useTheme();
  const { currentModal, openModal, closeModal } = useModal();
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Initialize theme if not set in localStorage
  //   if (!localStorage.getItem("vite-ui-theme")) {
  //     localStorage.setItem("vite-ui-theme", "system");
  //   }
  //   // Dispatch a custom event to notify that the theme has changed
  //   window.dispatchEvent(new Event("themeChanged"));

  //   // Apply the "light" theme specifically for the login page
  //   const root = document.documentElement;
  //   root.classList.remove("dark", "light");
  //   root.classList.add("light");

  //   return () => {
  //     // When leaving the login page, restore the theme from localStorage
  //     const storedTheme = localStorage.getItem("vite-ui-theme") || "system";
  //     root.classList.remove("dark", "light");
  //     if (storedTheme === "system") {
  //       const systemPrefersDark = window.matchMedia(
  //         "(prefers-color-scheme: dark)"
  //       ).matches;
  //       root.classList.add(systemPrefersDark ? "dark" : "light");
  //     } else {
  //       root.classList.add(storedTheme);
  //     }
  //   };
  // }, []);

  // Get executeRecaptcha function from the v3 hook
  const { executeRecaptcha } = useGoogleReCaptcha();

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
    setRecaptchaError("");

    if (!executeRecaptcha) {
      console.error("reCAPTCHA not yet available");
      setRecaptchaError(
        "reCAPTCHA is not yet available. Please try again in a moment."
      );
      return;
    }

    try {
      setIsLoading(true);
      // Execute reCAPTCHA for action "login" and get the token
      const token = await executeRecaptcha("login");

      if (!token) {
        setRecaptchaError("reCAPTCHA verification failed. Please try again.");
        setIsLoading(false); // ✅ Stop loading on reCAPTCHA failure
        return;
      }

      // Trim the username input
      const trimmedUsername = username.trim();

      console.log("Attempting login for:", trimmedUsername);
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        {
          username: trimmedUsername,
          password,
          recaptchaToken: token
        },
        { withCredentials: true }
      );

      // Process the response from the server
      if (response.data.success) {
        setSuccessMessage("Login successful! Redirecting...");
        console.log("Login successful for:", trimmedUsername);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("loginTime", Date.now());
        localStorage.setItem("login", Date.now());
        window.dispatchEvent(new Event("userProfileUpdated"));

        // Redirect based on role
        if (response.data.role === "admin") {
          navigate("/AdminDashboard");
        } else if (
          response.data.role === "receptionist" ||
          response.data.role === "aesthetician"
        ) {
          navigate("/StaffDashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.log(
          `Login failed for "${trimmedUsername}":`,
          response.data.message
        );

        // Special handling for archived accounts
        if (response.data.message?.toLowerCase().includes("archived")) {
          setErrorMessage(
            "Your account has been archived. Please contact your administrator."
          );
        } else {
          setErrorMessage(
            response.data.message || "Invalid username or password"
          );
        }
        setIsLoading(false); // ✅ Stop loading on login failure
      }
    } catch (error) {
      // Also handle the 403 status specifically for archived accounts
      if (
        error.response?.status === 403 &&
        error.response.data?.message?.toLowerCase().includes("archived")
      ) {
        setErrorMessage(
          "Your account has been archived. Please contact your administrator."
        );
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
      setIsLoading(false); // ✅ Stop loading on error
    }
  };

  return (
    <div className="min-h-screen">
      {isLoading && (
        <LoaderWrapper fullScreen={true} overlay={true}>
          <Loader size={100} text="Logging in..." />
        </LoaderWrapper>
      )}
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
          <div className="absolute inset-0 bg-white/20"></div>
          <div className="absolute inset-0 bg-purple-900/5 backdrop-blur-[1px]"></div>
        </div>

        {/* Login Card */}
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="w-[320px] bg-white rounded-[24px] shadow-lg p-5">
            <div className="flex flex-col items-center mb-4">
              <img
                src={BeautoxLogo}
                alt="Beautox Logo"
                className="w-10 h-auto mb-2.5"
              />
              <h2 className="text-lg font-semibold text-center mb-1">
                Welcome to PRISM,
              </h2>
              <p className="text-[10px] text-center mb-3 max-w-[260px] tracking-wide uppercase">
                BEAUTOX&apos;S PATIENT RECORDS, INTEGRATION, SCHEDULING, AND
                MANAGEMENT
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-2.5 py-1.5 rounded-md text-[11px] text-center mb-3">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-2.5 py-1.5 rounded-md text-[11px] text-center mb-3">
                {successMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <InputContainer className="transition-all duration-200">
                <InputLabel>Username</InputLabel>
                <InputTextField>
                  <InputIcon>
                    <UserIcon />
                  </InputIcon>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-input text-xs sm:pl-2 text-left placeholder:text-left"
                    placeholder="e.g. john_doe123"
                    required
                  />
                </InputTextField>
              </InputContainer>

              <InputContainer className="transition-all duration-200">
                <InputLabel>Password</InputLabel>
                <InputTextField>
                  <InputIcon>
                    <PasswordIcon />
                  </InputIcon>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-input text-xs sm:pl-2 text-left placeholder:text-left"
                    placeholder="e.g. P@ssw0rd123"
                    required
                  />
                </InputTextField>
              </InputContainer>

              {/* In reCAPTCHA v3, there is no visible widget */}
              {recaptchaError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-2.5 py-1.5 rounded-md text-[11px] text-center mb-2">
                  {recaptchaError}
                </div>
              )}

              {/* Forgot password link */}
              <p className="text-gray-500 text-[10px] font-bold text-center mb-2.5">
                FORGOT PASSWORD?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openModal("forgotPassword");
                  }}
                  className="underline font-bold"
                >
                  CLICK HERE
                </a>
              </p>

              {/* Buttons */}
              <div className="space-y-2">
                <Button type="submit" fullWidth="true">
                  <LoginIcon className="sm:w-3.5 sm:h-3.5" />
                  <span>LOGIN</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  fullWidth="true"
                >
                  <ChevronLeftIcon />
                  VISIT BEAUTOX
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none hidden lg:block"></div>
        </div>

        <div className="flex items-center justify-center md:col-span-5 lg:col-span-4 py-6 px-4 sm:px-6 md:px-8">
          <div className="w-full max-w-md mx-auto">
            <div className="flex flex-col items-center mb-6">
              <img
                src={BeautoxLogo}
                alt="Beautox Logo"
                className="mb-4 w-32 sm:w-36 md:w-40 lg:w-44 h-auto"
              />
              <h2 className="font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-2 leading-tight">
                Welcome to PRISM,
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-center mb-6 max-w-sm px-2">
                BEAUTOX&apos;S PATIENT RECORDS, INTEGRATION, SCHEDULING, AND
                MANAGEMENT
              </p>
            </div>

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

            <form
              data-cy="login-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 sm:gap-5"
            >
              <InputContainer className="transition-all duration-200">
                <InputLabel className="text-xs sm:text-sm">Username</InputLabel>
                <InputTextField className="mt-1 sm:mt-2">
                  <InputIcon className="text-gray-400">
                    <UserIcon className="sm:w-5 sm:h-5" />
                  </InputIcon>
                  <Input
                    data-cy="login-username"
                    type="text"
                    id="username"
                    className="text-sm sm:text-base"
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={(e) => setUsername(e.target.value.trim())}
                    placeholder="e.g. john_doe123"
                    required
                  />
                </InputTextField>
              </InputContainer>

              <InputContainer className="transition-all duration-200">
                <InputLabel className="text-xs sm:text-sm">Password</InputLabel>
                <InputTextField>
                  <InputIcon>
                    <PasswordIcon className="sm:w-5 sm:h-5" />
                  </InputIcon>
                  <Input
                    data-cy="login-password"
                    type="password"
                    id="password"
                    className="text-sm sm:text-base"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="e.g. P@ssw0rd123"
                    value={password}
                    required
                  />
                </InputTextField>
              </InputContainer>

              {recaptchaError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm text-center mb-3">
                  {recaptchaError}
                </div>
              )}

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

              <div className="space-y-3 pt-4">
                <Button type="submit" fullWidth="true" data-cy="login-submit">
                  <LoginIcon />
                  <span>LOGIN</span>
                </Button>

                <Button
                  variant="outline"
                  fullWidth="true"
                  onClick={() => navigate("/")}
                  type="button"
                  className="w-full"
                >
                  <ChevronLeftIcon />
                  RETURN
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {currentModal === "forgotPassword" && (
        <ForgotPassword isOpen={true} onClose={closeModal} />
      )}
    </div>
  );
}

export default Login;
