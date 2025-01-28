import React from "react";
import "./App.css";
import { CTAButton, OutlineButton, Pagination } from "./Components";
import { useState } from "react";
import ChevronLeftIcon from "./assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "./assets/icons/ChevronRightIcon";
import ChevronDownIcon from "./assets/icons/ChevronDownIcon";

import FilterIcon from "./assets/icons/FilterIcon";
import DownloadIcon from "./assets/icons/DownloadIcon";
import BeautoxPieChart from "./components/BeautoxPieChart";
import SalesChart from "./components/SalesChart";
import PlusIcon from "./assets/icons/PlusIcon";

import UserIcon from "./assets/icons/UserIcon";
import PasswordIcon from "./assets/icons/PasswordIcon";
import LoginIcon from "./assets/icons/LoginIcon";
import BeautoxLogo from "./assets/logos/Beautox.svg";

import MonthlyBookingPanel from "./components/MonthlyBookingPanel";
import WeeklyBookingPanel from "./components/WeeklyBookingPanel";
import QuestionBoxIcon from "./assets/icons/QuestionBoxIcon";
import TimeoutIcon from "./assets/icons/TimeoutIcon";

import SettingsIcon from "./assets/icons/SettingsIcon";
import PackageIcon from "./assets/icons/PackageIcon";
import EllipsisIcon from "./assets/icons/EllipsisIcon";
import EmailIcon from "./assets/icons/EmailIcon";
import CalendarIcon from "./assets/icons/CalendarIcon";
import ClockIcon from "./assets/icons/ClockIcon";
import AgeIcon from "./assets/icons/AgeIcon";
import ArrowNorthEastIcon from "./assets/icons/ArrowNorthEastIcon";
import UserIDIcon from "./assets/icons/UserIDIcon";

import { BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./Login";
import Fin from "./FinancialOverview";



function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("monthly");

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const getStartOfWeek = (date) => {
    const startDate = date.getDate() - date.getDay();
    return new Date(date.setDate(startDate));
  };

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  const calendar = [];
  let currentWeek = [];

  for (let i = startDate; i <= lastDayOfMonth; i.setDate(i.getDate() + 1)) {
    const currentDate = new Date(i);
    if (currentDate.getMonth() === month) {
      currentWeek.push(currentDate);
    } else {
      currentWeek.push(null);
    }

    if (currentWeek.length === 7) {
      calendar.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    calendar.push(currentWeek);
  }

  const handlePrevious = () => {
    if (view === "monthly") {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const handleNext = () => {
    if (view === "monthly") {
      setCurrentDate(new Date(year, month + 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const events = [
    {
      day: "WED",
      startTime: "9:00AM",
      endTime: "10:30AM",
      name: "Alice Alex",
      description: "Me So Sexy Package"
    },
    {
      day: "FRI",
      startTime: "5:00PM",
      endTime: "6:00PM",
      name: "Violet Jessica",
      description: "Brazilian"
    }
  ];

  return (
    //Router
   
    // LOGIN
    // <div className="min-h-screen grid grid-cols-12">
    //   <div className="h-screen col-span-7 ">
    //     <img
    //       src="/src/assets/images/Beautox Login Image.png"
    //       alt="Beautox Login Image"
    //       className="h-full w-full object-cover"
    //     />
    //   </div>

    //   <div className="user-login fcc col-span-5 flex flex-row items-center justify-center">
    //     <div className="login-container w-[90%]">
    //       <img
    //         src={BeautoxLogo}
    //         alt="Beautox Logo"
    //         className="mb-4 m-auto w-2/5"
    //       />
    //       {/* <BeautoxLogo fill="" /> */}
    //       <h2 className="font-semibold leading-[67.2px] text-[48px] text-center">
    //         Welcome to PRISM,
    //       </h2>
    //       <p className="leading-8 text-center">
    //         BEAUTOX’S PATIENT RECORDS, INTEGRATION, SCHEDULING, AND MANAGEMENT
    //       </p>

    //       <form action="" className="flex flex-col gap-4 mt-4">
    //         <div className="input-container">
    //           <label htmlFor="" className="input-field-label">
    //             Username
    //           </label>

    //           <div className="input-field">
    //             <UserIcon size={24} />
    //             <input
    //               type="text"
    //               className="text-input"
    //               placeholder="e.g. john_doe123"
    //               required
    //             />
    //           </div>
    //         </div>

    //         <div className="input-container">
    //           <label htmlFor="" className="input-field-label">
    //             Password
    //           </label>

    //           <div className="input-field">
    //             <PasswordIcon size={24} />
    //             <input
    //               type="password"
    //               className="text-input"
    //               placeholder="e.g. P@ssw0rd123"
    //               required
    //             />
    //           </div>
    //         </div>

    //         <p className="text-customNeutral-300 text-xs font-bold leading-5 text-center">
    //           FORGOT PASSWORD?{" "}
    //           <a href="" className="underline">
    //             CLICK HERE
    //           </a>
    //         </p>

    //         <CTAButton text="LOGIN" leftIcon={<LoginIcon size={24} />} />
    //       </form>
    //     </div>
    //   </div>
    // </div>
    // ====================================================================================

    // LOGIN CAPTCHA
    // <div className="min-h-screen grid grid-cols-12">
    //   <div className="h-screen col-span-7 ">
    //     <img
    //       src="/src/assets/images/Beautox Login Image.png"
    //       alt="Beautox Login Image"
    //       className="h-full w-full object-cover"
    //     />
    //   </div>

    //   <div className="user-login fcc col-span-5  flex flex-row items-center justify-center">
    //     <div className="login-container w-[90%]">
    //       <img
    //         src={BeautoxLogo}
    //         alt="Beautox Logo"
    //         className="mb-4 m-auto w-2/5"
    //       />
    //       <h2 className="font-semibold leading-[67.2px] text-[48px] text-center">
    //         Welcome to PRISM,
    //       </h2>
    //       <p className="leading-8 text-center">
    //         BEAUTOX’S PATIENT RECORDS, INTEGRATION, SCHEDULING, AND MANAGEMENT
    //       </p>
    //       <form action="" className="flex flex-col gap-4 mt-4">
    //         <div className="captcha-container">
    //           <div className="fcc-r font-semibold p-[2.25rem_12.22rem] bg-neutral-100 rounded-lg gap-2 border-2 border-neutral-200 focus-within:border-lavender-400 text-center">
    //             [CAPTCHA TEXT HERE]
    //           </div>
    //         </div>

    //         <div className="input-container">
    //           <label htmlFor="" className="input-field-label">
    //             Enter the text
    //           </label>
    //           <div className="input-field">
    //             <input
    //               type="text"
    //               className="text-input"
    //               placeholder="Enter the text"
    //             />
    //           </div>
    //         </div>

    //         <CTAButton text="LOGIN" leftIcon={<LoginIcon size={24} />} />
    //       </form>
    //     </div>
    //   </div>
    // </div>
    // ====================================================================================

    // ERROR 404
    // <div className="bg-faintingLight-100 flex flex-row justify-center items-center w-screen h-screen">
    //   <div className="flex gap-[2.25rem]">
    //     <QuestionBoxIcon size={180} />
    //     <div className="flex flex-col gap-[1.2rem]">
    //       <div className="flex flex-col text-left">
    //         <h2 className=" font-semibold text-5xl leading-[4.2rem]">
    //           ERROR 404 - PAGE NOT FOUND
    //         </h2>
    //         <p className="text-[1.25rem] leading-8">
    //           The system could not find what you were looking for, kindly return
    //           and try again.
    //         </p>
    //       </div>
    //       <CTAButton text="RETURN" leftIcon={<ChevronLeftIcon />} />
    //     </div>
    //   </div>
    // </div>
    // ====================================================================================

    // SESSION TIMEOUT ERROR
    // <div className="bg-faintingLight-100 flex flex-row justify-center items-center w-screen h-screen">
    //   <div className="flex gap-[2.25rem] items-center justify-center">
    //     <TimeoutIcon size={204} />
    //     <div className="flex flex-col gap-[0.75rem] max-w-[60%] justify-center text-left">
    //       <div className="flex flex-col">
    //         <h2 className=" font-semibold text-5xl leading-[4.2rem]">
    //           ERROR - SESSION TIMED OUT
    //         </h2>
    //         <p className="text-[1.25rem] leading-8">
    //           You have been logged out because your session timed out, Kindly
    //           login again to continue where you left off.
    //         </p>
    //       </div>
    //       <CTAButton text="RETURN AND LOGIN" leftIcon={<LoginIcon />} />
    //     </div>
    //   </div>
    // </div>
    // ====================================================================================

    // ADMIN SERVICES AND SCHEDULE APPOINTMENT
    // <>
    //   <h4 className="text-[2rem] leading-[44.8px] font-semibold">
    //     ADMINISTRATOR SERVICES
    //   </h4>
    //   <table className="PRISM-table">
    //     <thead>
    //       <tr>
    //         <th>PRODUCT ID</th>
    //         <th>PACKAGE</th>
    //         <th>TREATMENT</th>
    //         <th>SESSIONS</th>
    //         <th>PRICE</th>
    //         <th className="flex justify-center items-center h-full">
    //           <button className="flex items-center justify-center h-12 w-ful">
    //             <SettingsIcon />
    //           </button>
    //         </th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       <tr>
    //         <td>1</td>
    //         <td>2</td>
    //         <td>3</td>
    //         <td>4</td>
    //         <td>5</td>
    //         <td>
    //           <button className="flex items-center justify-center h-8 w-full">
    //             <EllipsisIcon />
    //           </button>
    //         </td>
    //       </tr>
    //       <tr>
    //         <td>1</td>
    //         <td>2</td>
    //         <td>3</td>
    //         <td>4</td>
    //         <td>5</td>
    //         <td></td>
    //       </tr>
    //       <tr>
    //         <Pagination />
    //       </tr>
    //     </tbody>
    //   </table>
    //   <div className="w-full flex justify-end gap-4 mb-[10%]">
    //     <OutlineButton
    //       text="RETURN"
    //       leftIcon={<ChevronLeftIcon />}
    //       className="items-end"
    //     />

    //     <CTAButton
    //       text="ADD NEW PACKAGE"
    //       leftIcon={<PlusIcon />}
    //       rightIcon={<PackageIcon />}
    //       className="items-end"
    //     />
    //   </div>
    //   <br />
    //   <hr />
    //   <br />
    //   <h4 className="text-[2rem] leading-[44.8px] font-semibold">
    //     SCHEDULE APPOINTMENT
    //   </h4>
    //   <form action="" className="flex flex-col gap-5">
    //     <div className="input-container">
    //       <label htmlFor="" className="input-field-label">
    //         NAME
    //       </label>

    //       <div className="input-field">
    //         <UserIcon />
    //         <input
    //           type="text"
    //           className="text-input"
    //           placeholder="Full name"
    //           required
    //         />
    //       </div>
    //     </div>
    //     <div className="input-container">
    //       <label htmlFor="" className="input-field-label">
    //         CONTACT NUMBER
    //       </label>

    //       <div className="input-field">
    //         <UserIDIcon />
    //         <input
    //           type="tel"
    //           className="text-input"
    //           placeholder="Contact Number"
    //           required
    //         />
    //       </div>
    //     </div>
    //     <div className="input-container">
    //       <label htmlFor="" className="input-field-label">
    //         AGE
    //       </label>

    //       <div className="input-field">
    //         <AgeIcon />
    //         <input
    //           type="number"
    //           className="text-input"
    //           placeholder="Age"
    //           required
    //         />
    //       </div>
    //     </div>
    //     <div className="input-container">
    //       <label htmlFor="" className="input-field-label">
    //         EMAIL
    //       </label>

    //       <div className="input-field">
    //         <EmailIcon />
    //         <input
    //           type="text"
    //           className="text-input"
    //           placeholder="Email"
    //           required
    //         />
    //       </div>
    //     </div>

    //     <div className="input-container flex flex-row w-full">
    //       <div className="input-container flex-1  ">
    //         <label htmlFor="" className="input-field-label">
    //           DATE OF SESSION
    //         </label>

    //         <div className="input-field">
    //           <CalendarIcon />
    //           <input
    //             type="date"
    //             className="text-input"
    //             placeholder="Date of Session"
    //             required
    //           />
    //         </div>
    //       </div>{" "}
    //       <div className="input-container flex-1">
    //         <label htmlFor="" className="input-field-label">
    //           TIME OF SESSION
    //         </label>

    //         <div className="input-field">
    //           <ClockIcon />
    //           <input
    //             type="time"
    //             className="text-input"
    //             placeholder="e.g. john_doe123"
    //             required
    //           />
    //         </div>
    //       </div>
    //     </div>
    //     <div className="flex flex-row gap-2 w-full">
    //       <OutlineButton
    //         text="RETURN"
    //         leftIcon={<ChevronLeftIcon />}
    //         fullWidth={true}
    //       />

    //       <CTAButton
    //         text="SUBMIT SCHEDULE APPOINTMENT"
    //         leftIcon={<ArrowNorthEastIcon size={16} />}
    //         fullWidth={true}
    //       />
    //     </div>
    //   </form>
    // </>
    // ====================================================================================

    // FINANCIAL OVERVIEW
    // <div className="flex flex-col text-left w-full gap-4">
    //   <div>
    //     <h1 className="text-[40px] leading-[56px] font-bold">
    //       FINANCIAL OVERVIEW
    //     </h1>
    //     <p>Summary of finances within Beautox</p>
    //   </div>
    //   <h2 className="font-bold text-[2rem]">SALES TRACKER</h2>
    //   <SalesChart />
    //   <div className="w-full flex justify-end">
    //     <CTAButton
    //       text="FILTER BY"
    //       rightIcon={<FilterIcon />}
    //       className="items-end"
    //     />
    //   </div>
    //   <table className="PRISM-table">
    //     <thead>
    //       <tr>
    //         <th>CLIENT</th>
    //         <th>PERSON IN CHARGE</th>
    //         <th>DATE TRANSACTED</th>
    //         <th>PAYMENT METHOD</th>
    //         <th>PACKAGES</th>
    //         <th>TREATMENT</th>
    //         <th>PAYMENT</th>
    //         <th>REFERENCE NO.</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       <tr>
    //         <td>Data 1.1</td>
    //         <td>Data 1.2</td>
    //         <td>Data 1.3</td>
    //         <td>Data 1.4</td>
    //         <td>Data 1.5</td>
    //         <td>Data 1.6</td>
    //         <td>Data 1.7</td>
    //         <td>Data 1.8</td>
    //       </tr>
    //       <tr>
    //         <td>Data 2.1</td>
    //         <td>Data 2.2</td>
    //         <td>Data 2.3</td>
    //         <td>Data 2.4</td>
    //         <td>Data 2.5</td>
    //         <td>Data 2.6</td>
    //         <td>Data 2.7</td>
    //         <td>Data 2.8</td>
    //       </tr>
    //       <tr>
    //         <td>Data 3.1</td>
    //         <td>Data 3.2</td>
    //         <td>Data 3.3</td>
    //         <td>Data 3.4</td>
    //         <td>Data 3.5</td>
    //         <td>Data 3.6</td>
    //         <td>Data 3.7</td>
    //         <td>Data 3.8</td>
    //       </tr>
    //       <tr>
    //         <Pagination />
    //       </tr>
    //     </tbody>
    //   </table>
    //   <div className="w-full flex justify-end gap-4">
    //     <OutlineButton
    //       text="RETURN"
    //       leftIcon={<ChevronLeftIcon />}
    //       className="items-end"
    //     />
    //     <CTAButton
    //       text="DOWNLOAD SALES REPORT"
    //       leftIcon={<DownloadIcon />}
    //       className="items-end"
    //     />
    //   </div>
    //   <h2 className="font-bold text-[2rem]">MONTHLY EXPENSES TRACKER</h2>
    //   <div className="grid gap-14">
    //     <div className="flex w-full gap-8">
    //       <BeautoxPieChart className="shadow-custom" />
    //       <table className="PRISM-table">
    //         <thead>
    //           <tr>
    //             <th className="text-left">CATEGORIES</th>
    //           </tr>
    //         </thead>
    //         <tbody className="text-left">
    //           <tr>
    //             <td>CATEGORY 1</td>
    //           </tr>
    //           <tr>
    //             <td>CATEGORY 2</td>
    //           </tr>
    //           <tr>
    //             <td>CATEGORY 3</td>
    //           </tr>
    //           <tr>
    //             <td>CATEGORY 4</td>
    //           </tr>
    //           <tr>
    //             <td>CATEGORY 5</td>
    //           </tr>
    //         </tbody>
    //       </table>
    //     </div>
    //     <table className="PRISM-table">
    //       <thead>
    //         <tr>
    //           <th>DATE</th>
    //           <th>CATEGORY</th>
    //           <th>EXPENSE</th>
    //           <th></th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         <tr>
    //           <td>1</td>
    //           <td>2</td>
    //           <td>3</td>
    //           <td>4</td>
    //         </tr>
    //         <tr>
    //           <td>1</td>
    //           <td>2</td>
    //           <td>3</td>
    //           <td>4</td>
    //         </tr>
    //       </tbody>
    //     </table>
    //     <div className="w-full rounded-lg p-4 border-2 border-lavender-400 text-center text-3xl leading-[67.2px] ">
    //       TOTAL PROFIT <span className="font-bold">PHP 200,000</span>
    //     </div>
    //     <div className="w-full flex justify-end gap-4 mb-[10%]">
    //       <OutlineButton
    //         text="RETURN"
    //         leftIcon={<ChevronLeftIcon />}
    //         className="items-end"
    //       />
    //       <CTAButton
    //         text="ADD ADDITIONAL EXPENSES"
    //         leftIcon={<PlusIcon />}
    //         className="items-end"
    //       />
    //       <CTAButton
    //         text="DOWNLOAD SALES REPORT"
    //         leftIcon={<DownloadIcon />}
    //         className="items-end"
    //       />
    //     </div>
    //   </div>
    // </div>
    // ====================================================================================
<div>
      <BrowserRouter>
        <Routes>
         <Route index element={<Login />} />
         <Route path="/Financial" element={<Fin />} />
        </Routes>
      </BrowserRouter>
      </div>
    // CURRENT APP (BOOKING)
    // <>
    //   <div class = "routing">
    //   <BrowserRouter>
    //     <Routes>
    //      <route index element={<Login />} />
    //     </Routes>
    //   </BrowserRouter>
    //   </div>
    //   <h3 className="text-[2.5rem] leading-[3.75rem] font-semibold">
    //     BOOKING CALENDAR
    //   </h3>
    //   <div
    //     id="booking-container"
    //     className="flex flex-col shadow-custom items-center rounded-lg py-8 bg-ash-100 mb-16"
    //   >
    //     {/* Header Section */}
    //     <div className="flex flex-row justify-between w-[95%] mb-4">
    //       <div className="flex flex-row items-center gap-2">
    //         <button
    //           className="border border-transparent p-1 rounded hover:border-lavender-400 text-lavender-400"
    //           onClick={handlePrevious}
    //         >
    //           <ChevronLeftIcon />
    //         </button>
    //         <h2 className="text-xl font-semibold">
    //           {view === "monthly"
    //             ? `${currentDate.toLocaleString("default", {
    //                 month: "long"
    //               })} ${year}`
    //             : `${getStartOfWeek(currentDate).toLocaleDateString("en-US", {
    //                 month: "long",
    //                 day: "numeric"
    //               })} - ${new Date(
    //                 getStartOfWeek(currentDate).getTime() +
    //                   6 * 24 * 60 * 60 * 1000
    //               ).toLocaleDateString("en-US", {
    //                 month: "long",
    //                 day: "numeric"
    //               })}`}
    //         </h2>

    //         <button
    //           className="border border-transparent p-1 rounded hover:border-lavender-400 text-lavender-400"
    //           onClick={handleNext}
    //         >
    //           <ChevronRightIcon />
    //         </button>
    //       </div>
    //       <div className="flex flex-row gap-4">
    //         <div className="flex gap-2 text-xl">
    //           <div className="flex gap-8 mr-8">
    //             <button
    //               onClick={() => setView("monthly")}
    //               className="relative inline-block px-2 py-1 font-semibold overflow-hidden group"
    //             >
    //               MONTHLY
    //               <span
    //                 className={`absolute left-0 bottom-0 block w-0 h-0.5 bg-lavender-400 transition-all duration-300 ${
    //                   view === "monthly" ? "w-full" : "group-hover:w-full"
    //                 }`}
    //               ></span>
    //             </button>

    //             <button
    //               onClick={() => setView("weekly")}
    //               className="relative inline-block px-2 py-1 font-semibold overflow-hidden group"
    //             >
    //               WEEKLY
    //               <span
    //                 className={`absolute left-0 bottom-0 block w-0 h-0.5 bg-lavender-400 transition-all duration-300 ${
    //                   view === "weekly" ? "w-full" : "group-hover:w-full"
    //                 }`}
    //               ></span>
    //             </button>
    //           </div>
    //           <CTAButton
    //             text="FILTER DROPDOWN PLACEHOLDER"
    //             rightIcon={<ChevronDownIcon />}
    //           />
    //         </div>
    //       </div>
    //     </div>

    //     {/* Calendar Views */}
    //     <div className="w-full flex justify-center items-center gap-6">
    //       {view === "monthly" ? (
    //         <MonthlyBookingPanel
    //           currentDate={currentDate}
    //           handlePreviousMonth={handlePrevious}
    //           handleNextMonth={handleNext}
    //           calendarDays={calendar}
    //         />
    //       ) : (
    //         <WeeklyBookingPanel currentDate={currentDate} events={events} />
    //       )}
    //     </div>
    //   </div>
    //   {/* <p>eli</p> */}
    // </>
  );
}

export default App;
