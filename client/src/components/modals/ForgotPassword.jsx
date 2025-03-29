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

function ForgotPassword({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1 = email, 2 = otp
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
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
      await axios.post("http://localhost:4000/verify-otp", { email, otp });
      setMessage("OTP verified. Redirect to reset password or continue.");
      // Optional: Add reset password modal or redirect
    } catch (err) {
      console.error("OTP verification failed:", err);
      setMessage("Invalid or expired OTP.");
    }
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
          <form
            onSubmit={sendOTP}
            className="w-full flex flex-col justify-center items-center gap-4"
          >
            <p className="text-left">Kindly input the email of your account.</p>
            <InputContainer>
              <InputLabel>Email</InputLabel>
              <InputTextField>
                <InputIcon>
                  <EmailIcon />
                </InputIcon>
                <Input
                  type="email"
                  id="email"
                  className="text-input"
                  placeholder="Kindly input your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputTextField>
            </InputContainer>
            <div className="flex flex-row gap-4 mt-4 w-full">
              <Button variant="outline" className="w-1/2" onClick={onClose}>
                <ChevronLeftIcon /> BACK
              </Button>
              <Button type="submit" className="w-1/2">
                SUBMIT
                <ChevronRightIcon />
              </Button>
            </div>
            {message && (
              <p className="text-sm text-center text-red-500">{message}</p>
            )}
          </form>
        ) : (
          <form
            onSubmit={verifyOTP}
            className="w-full flex flex-col justify-center items-center gap-4"
          >
            <p className="text-center">
              Kindly input the{" "}
              <span className="font-semibold">6-digit code</span> we have sent
              to your email.
            </p>
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
            <p>
              Didn't get the code?{" "}
              <button
                type="button"
                onClick={resendOTP}
                className="underline hover:text-reflexBlue-400 font-semibold"
              >
                CLICK HERE TO RESEND
              </button>
            </p>
            <div className="flex flex-row gap-4 mt-4 w-full">
              <Button
                variant="outline"
                className="w-1/2"
                onClick={() => setStep(1)}
              >
                <ChevronLeftIcon /> BACK
              </Button>
              <Button type="submit" className="w-1/2">
                SUBMIT
                <ChevronRightIcon />
              </Button>
            </div>
            {message && (
              <p className="text-sm text-center text-red-500">{message}</p>
            )}
          </form>
        )}
      </ModalBody>
    </ModalContainer>
  );
}

export default ForgotPassword;
