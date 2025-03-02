import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Fin from "./pages/FinancialOverview";
import AdministratorDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import PatientRecordsDatabase from "./pages/PatientRecordsDatabase";
import AdministratorServices from "./pages/AdministratorServices";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import BookingCalendar from "./pages/BookingCalendar";

import Layout from "./components/Layout";

function App() {
  return (
    <div className="w-full">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/scheduleappointment"
            element={<ScheduleAppointment />}
          />

          {/* Protected Routes - Wrapped in Layout */}
          <Route element={<Layout />}>
            <Route path="/FinancialOverview" element={<Fin />} />
            <Route
              path="/AdminDashboard"
              element={<AdministratorDashboard />}
            />
            <Route path="/StaffDashboard" element={<StaffDashboard />} />
            <Route
              path="/PatientRecordsDatabase"
              element={<PatientRecordsDatabase />}
            />
            <Route
              path="/AdministratorServices"
              element={<AdministratorServices />}
            />
            <Route path="/BookingCalendar" element={<BookingCalendar />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
