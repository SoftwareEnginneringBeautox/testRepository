import React, { useState } from "react";

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
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setStep(2);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Simulate OTP verification
    console.log("OTP Submitted: ", otp);
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
            onSubmit={handleEmailSubmit}
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
          </form>
        ) : (
          <form
            onSubmit={handleOtpSubmit}
            className="w-full flex flex-col justify-center items-center gap-4"
          >
            <p>
              Kindly input the{" "}
              <span className="font-semibold">6-digit code</span> we have sent
              to your email.
            </p>
            <InputOTP maxLength={6}>
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
              <button className="underline hover:text-reflexBlue-400 font-semibold">
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
          </form>
        )}
      </ModalBody>
    </ModalContainer>
  );
}

export default ForgotPassword;
