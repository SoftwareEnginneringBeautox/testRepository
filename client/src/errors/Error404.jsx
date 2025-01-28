import React from "react";
import "./App.css";
import CTAButton from "../Components";
import ChevronLeftIcon from "../assets/icons/ChevronLeftIcon";
import QuestionBoxIcon from "../assets/icons/QuestionBoxIcon";

function Error404() {
  return (
    <div className="bg-faintingLight-100 flex flex-row justify-center items-center w-screen h-screen">
      <div className="flex gap-[2.25rem]">
        <QuestionBoxIcon size={180} />
        <div className="flex flex-col gap-[1.2rem]">
          <div className="flex flex-col text-left">
            <h2 className=" font-semibold text-5xl leading-[4.2rem]">
              ERROR 404 - PAGE NOT FOUND
            </h2>
            <p className="text-[1.25rem] leading-8">
              The system could not find what you were looking for, kindly return
              and try again.
            </p>
          </div>
          <CTAButton text="RETURN" leftIcon={<ChevronLeftIcon />} />
        </div>
      </div>
    </div>
  );
}

export default Error404;
