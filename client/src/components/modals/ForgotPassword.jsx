import React, { useState } from "react";
import axios from "axios";

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
  const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const sendOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/forgot-password", { email });
      setStep(2);
      setMessage("OTP sent to your email.");
    } catch (err) {
      console.error("Failed to send OTP:", err);
      setMessage("Failed to send OTP. Make sure the email is correct.");
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
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
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setMessage("Password reset functionality will be implemented soon.");
  };

  const resendOTP = async () => {
    try {
      await axios.post("http://localhost:4000/forgot-password", { email });
      setMessage("A new OTP has been sent.");
    } catch (err) {
      setMessage("Failed to resend OTP.");
    }
  };

  if (!isOpen) return null;

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalTitle>FORGOT YOUR PASSWORD?</ModalTitle>
      </ModalHeader>
      <ModalBody>
        {step === 1 ? (
          <form onSubmit={sendOTP} className="flex flex-col gap-4 items-center">
            <p>Kindly input the email of your account.</p>
            <InputContainer>
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
                />
              </InputTextField>
            </InputContainer>
            <div className="flex gap-4 w-full">
              <Button variant="outline" onClick={onClose} className="w-1/2">
                <ChevronLeftIcon /> BACK
              </Button>
              <Button type="submit" className="w-1/2">
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
            <InputOTP value={otp} onChange={setOtp} maxLength={6}>
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
            <button onClick={resendOTP} className="underline font-semibold">
              CLICK HERE TO RESEND
            </button>
            <div className="flex gap-4 w-full">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="w-1/2"
              >
                <ChevronLeftIcon /> BACK
              </Button>
              <Button type="submit" className="w-1/2">
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
                  type="password"
                  placeholder="New Password"
                  // value={newPassword}
                  // onChange={(e) => setNewPassword(e.target.value)}
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
                  type="password"
                  placeholder="Confirm Password"
                  // value={confirmPassword}
                  // onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </InputTextField>
            </InputContainer>

            <div className="flex gap-4 w-full">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="w-1/2"
              >
                <ChevronLeftIcon /> BACK
              </Button>
              <Button type="submit" className="w-1/2">
                RESET PASSWORD <ChevronRightIcon />
              </Button>
            </div>

            {message && <p className="text-red-500">{message}</p>}
          </form>
        )}
      </ModalBody>
    </ModalContainer>
  );
}

export default ForgotPassword;
