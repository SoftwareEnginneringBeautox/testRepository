import React, { useState } from "react";
import axios from "axios";

import { LoaderWrapper, Loader } from "@/components/ui/Loader";

import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalBody
} from "@/components/ui/Modal";

import {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input
} from "@/components/ui/Input";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from "@/components/ui/InputOTP";

import { Button } from "@/components/ui/Button";

import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";
import EmailIcon from "@/assets/icons/EmailIcon";
import PasswordIcon from "@/assets/icons/PasswordIcon";
import ConfirmIcon from "@/assets/icons/ConfirmIcon";

function ForgotPassword({ isOpen, onClose }) {
  // 1 = email, 2 = otp, 3 = reset password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when sending OTP
    setMessage(""); // Clear any previous messages

    try {
      await axios.post("http://localhost:4000/forgot-password", { email });
      setStep(2);
      setMessage("OTP sent to your email.");
    } catch (err) {
      console.error("Failed to send OTP:", err);
      setMessage("Failed to send OTP. Make sure the email is correct.");
    } finally {
      setIsLoading(false); // Ensure loading is set to false regardless of outcome
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when verifying OTP
    setMessage(""); // Clear any previous messages

    try {
      console.log("Verifying OTP:", otp);
      const response = await axios.post("http://localhost:4000/verify-otp", {
        email,
        otp
      });

      console.log("Server Response:", response.data);

      if (response.data.success) {
        setStep(3);
        console.log("Step set to 3");
        setMessage("OTP verified. Enter your new password.");
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setMessage("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false); // Ensure loading is set to false regardless of outcome
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true); // Set loading state
    setMessage(""); // Clear previous messages

    try {
      // Add actual reset password implementation here
      await axios.post("http://localhost:4000/reset-password", {
        email,
        otp,
        newPassword
      });
      setMessage("Password reset successful!");
      // Optional: close modal or navigate to login after successful reset
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error resetting password:", err);
      setMessage("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false); // Ensure loading is set to false regardless of outcome
    }
  };

  const resendOTP = async () => {
    setIsLoading(true); // Set loading state
    setMessage(""); // Clear previous messages

    try {
      await axios.post("http://localhost:4000/forgot-password", { email });
      setMessage("A new OTP has been sent.");
    } catch (err) {
      setMessage("Failed to resend OTP.");
    } finally {
      setIsLoading(false); // Ensure loading is set to false regardless of outcome
    }
  };

  if (!isOpen) return null;

  return (
    <ModalContainer data-cy="forgot-password-modal">
      {isLoading && (
        <LoaderWrapper fullScreen={true} overlay={true}>
          <Loader size={100} text="Processing..." />
        </LoaderWrapper>
      )}
      <ModalHeader>
        <ModalTitle>FORGOT YOUR PASSWORD?</ModalTitle>
      </ModalHeader>
      <ModalBody>
        {step === 1 ? (
          <form onSubmit={sendOTP} className="flex flex-col gap-4 items-center">
            <div className="flex gap-4 flex-col w-full">
              <p>Kindly input the email of your account.</p>
              <InputContainer data-cy="forgot-email-container">
                <InputLabel>Email</InputLabel>
                <InputTextField>
                  <InputIcon>
                    <EmailIcon />
                  </InputIcon>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-cy="forgot-email"
                  />
                </InputTextField>
              </InputContainer>
            </div>
            <div className="flex gap-4 w-full">
              <Button variant="outline" onClick={onClose} className="w-1/2">
                <ChevronLeftIcon /> BACK
              </Button>
              <Button data-cy="submit-email" type="submit" className="w-1/2">
                SUBMIT <ChevronRightIcon />
              </Button>
            </div>
            {message && <p className="text-red-500">{message}</p>}
          </form>
        ) : step === 2 ? (
          <form
            onSubmit={verifyOTP}
            className="flex flex-col gap-4 items-center"
          >
            <p>Enter the 6-digit code sent to your email.</p>
            <InputOTP
              data-cy="otp-input"
              value={otp}
              onChange={setOtp}
              maxLength={6}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <button
              type="button"
              onClick={resendOTP}
              className="underline font-semibold"
            >
              CLICK HERE TO RESEND
            </button>
            <div className="flex gap-4 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-1/2"
              >
                <ChevronLeftIcon /> BACK
              </Button>
              <Button data-cy="submit-otp" type="submit" className="w-1/2">
                SUBMIT <ChevronRightIcon />
              </Button>
            </div>
            {message && <p className="text-red-500">{message}</p>}
          </form>
        ) : (
          <form
            onSubmit={handleResetPassword}
            className="flex flex-col gap-4 items-center"
          >
            <div className="w-full">
              <p>
                Enter a new password for your account and retype it to verify.
              </p>
              <InputContainer>
                <InputLabel>New Password</InputLabel>
                <InputTextField>
                  <InputIcon>
                    <PasswordIcon />
                  </InputIcon>
                  <Input
                    data-cy="new-password"
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </InputTextField>
              </InputContainer>

              <InputContainer>
                <InputLabel>Confirm Password</InputLabel>
                <InputTextField>
                  <InputIcon>
                    <ConfirmIcon />
                  </InputIcon>
                  <Input
                    data-cy="confirm-password"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </InputTextField>
              </InputContainer>
            </div>

            <div className="flex gap-4 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-1/2"
              >
                <ChevronLeftIcon /> BACK
              </Button>
              <Button data-cy="submit-reset" type="submit" className="w-1/2">
                RESET PASSWORD <ChevronRightIcon />
              </Button>
            </div>

            {message && (
              <p
                className={
                  message.includes("successful")
                    ? "text-success-400"
                    : "text-error-400"
                }
              >
                {message}
              </p>
            )}
          </form>
        )}
      </ModalBody>
    </ModalContainer>
  );
}

export default ForgotPassword;
