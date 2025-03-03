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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="w-full">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/Login" index element={<Login />} />

          <Route path="/AdminDashboard" element={<AdministratorDashboard />} />
          <Route path="/StaffDashboard" element={<StaffDashboard />} />
          <Route
            path="/PatientRecordsDatabase"
            element={<PatientRecordsDatabase />}
          />
          <Route
            path="/AdministratorServices"
            element={<AdministratorServices />}
          />
          <Route
            path="/ScheduleAppointment"
            element={<ScheduleAppointment />}
          />
          <Route path="/BookingCalendar" element={<BookingCalendar />} />
          <Route
            path="/FinancialOverview"
            element={
              <ProtectedRoute>
                <Fin />
              </ProtectedRoute>
            }
          />
        </Routes>
        {/* Protected route example */}
      </BrowserRouter>
    </div>
  );
}

export default App;
