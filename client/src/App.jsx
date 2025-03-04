import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Fin from "./pages/FinancialOverview";
import AdministratorDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import PatientRecordsDatabase from "./pages/PatientRecordsDatabase";
import AdministratorServices from "./pages/AdministratorServices";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import BookingCalendar from "./pages/BookingCalendar";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorPage from "./errors/Error404";

function App() {
  return (
    <Routes>
      {/* The root route ("/") uses <Layout> as a wrapper */}
      <Route path="/" element={<Layout />}>
        {/* Index route => renders at "/" */}
        <Route index element={<Login />} />
        
        {/* /login */}
        <Route path="login" element={<Login />} />

        {/* /AdminDashboard */}
        <Route path="AdminDashboard" element={<AdministratorDashboard />} />

        {/* /StaffDashboard */}
        <Route path="StaffDashboard" element={<StaffDashboard />} />

        {/* /PatientRecordsDatabase */}
        <Route path="PatientRecordsDatabase" element={<PatientRecordsDatabase />} />

        {/* /AdministratorServices */}
        <Route path="AdministratorServices" element={<AdministratorServices />} />

        {/* /ScheduleAppointment */}
        <Route path="ScheduleAppointment" element={<ScheduleAppointment />} />

        {/* /BookingCalendar */}
        <Route path="BookingCalendar" element={<BookingCalendar />} />

        <Route path="*" element={<ErrorPage />} />

        {/* /FinancialOverview (Protected) */}
        <Route
          path="FinancialOverview"
          element={
            <ProtectedRoute>
              <Fin />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
