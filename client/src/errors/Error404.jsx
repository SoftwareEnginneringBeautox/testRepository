import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Button } from "@/components/ui/Button";
import ChevronLeftIcon from "../assets/icons/ChevronLeftIcon";
import QuestionBoxIcon from "../assets/icons/QuestionBoxIcon";

function Error404() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  // Countdown effect: decrement the counter every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // When countdown reaches 0, trigger redirection
  useEffect(() => {
    if (countdown <= 0) {
      handleRedirect();
    }
  }, [countdown]);

  const handleRedirect = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // If the user is logged in, try to navigate to the previous page
      if (window.history.length > 2) {
        navigate(-1);
      } else {
        // Fallback: redirect to a default dashboard route
        navigate("/dashboard");
      }
    } else {
      // If not logged in, send the user to the login page
      navigate("/login");
    }
  };

  return (
    <div className="bg-faintingLight-100 flex flex-col justify-center items-center w-screen h-screen">
      <div className="flex gap-[2.25rem]">
        <QuestionBoxIcon size={180} />
        <div className="flex flex-col gap-[1.2rem]">
          <div className="flex flex-col text-left">
            <h2 className="font-semibold text-5xl leading-[4.2rem]">
              ERROR 404 - PAGE NOT FOUND
            </h2>
            <p className="text-[1.25rem] leading-8">
              The system could not find what you were looking for, kindly return
              and try again.
            </p>
            <p className="text-[1rem] text-gray-600 mt-2">
              Redirecting in {countdown} second{countdown !== 1 && "s"}...
            </p>
          </div>
          <Button
            text="RETURN"
            leftIcon={<ChevronLeftIcon />}
            onClick={handleRedirect}
          >Go Back</Button>
        </div>
      </div>
    </div>
  );
}

export default Error404;
