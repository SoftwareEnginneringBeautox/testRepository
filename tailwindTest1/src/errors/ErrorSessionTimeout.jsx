import React from "react";
import "./App.css";
import CTAButton from "../Components";
import TimeoutIcon from "../assets/icons/TimeoutIcon";

function ErrorSessionTimeout() {
  return (
    <div className="bg-faintingLight-100 flex flex-row justify-center items-center w-screen h-screen">
      <div className="flex gap-[2.25rem] items-center justify-center">
        <TimeoutIcon size={204} />
        <div className="flex flex-col gap-[0.75rem] max-w-[60%] justify-center text-left">
          <div className="flex flex-col">
            <h2 className=" font-semibold text-5xl leading-[4.2rem]">
              ERROR - SESSION TIMED OUT
            </h2>
            <p className="text-[1.25rem] leading-8">
              You have been logged out because your session timed out, Kindly
              login again to continue where you left off.
            </p>
          </div>
          <CTAButton text="RETURN AND LOGIN" leftIcon={<LoginIcon />} />
        </div>
      </div>
    </div>
  );
}

export default ErrorSessionTimeout;
