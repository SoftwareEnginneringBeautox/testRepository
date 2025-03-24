import React from "react";
import "../App.css";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from "@/components/ui/InputOTP";

import { Button } from "@/components/ui/Button";

function ForgotPassword() {
  return (
    <section className="flex flex-col justify-center items-center bg-faintingLight-400 min-h-screen">
      <form
        action=""
        className="w-full flex flex-col justify-center items-center gap-4"
      >
        <h3 className="text-4xl font-semibold">FORGOT YOUR PASSWORD?</h3>
        <p>
          Kindly input the <span className="font-semibold">6-digit code</span>{" "}
          we have sent through your email to verify your account
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
        <Button>SUBMIT CODE</Button>
        <p>
          Didn't get the code?{" "}
          <button className="underline hover:text-reflexBlue-400 font-semibold">
            CLICK HERE TO RESEND A CODE
          </button>
        </p>
      </form>
    </section>
  );
}

export default ForgotPassword;
