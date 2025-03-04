import { Routes, Route, Navigate } from "react-router-dom";

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

// PublicRoute prevents logged-in users from accessing login pages.
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If the user is already logged in, redirect them to the correct dashboard.
  if (token) {
    if (role === "admin") {
      return <Navigate to="/AdminDashboard" replace />;
    } else if (role === "receptionist" || role === "aesthetician") {
      return <Navigate to="/StaffDashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }
  return children;
}

// AdminRoute protects admin-only routes.
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If not logged in, redirect to login.
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // If logged in but not an admin, redirect to staff dashboard.
  if (role !== "admin") {
    return <Navigate to="/StaffDashboard" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      {/* The root route ("/") uses <Layout> as a wrapper */}
      <Route path="/" element={<Layout />}>
        {/* Public routes: accessible only if not logged in */}
        <Route
          index
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="AdminDashboard"
          element={
            <AdminRoute>
              <AdministratorDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="AdministratorServices"
          element={
            <AdminRoute>
              <AdministratorServices />
            </AdminRoute>
          }
        />

        {/* Other routes (accessible once logged in) */}
        <Route path="StaffDashboard" element={<StaffDashboard />} />
        <Route
          path="PatientRecordsDatabase"
          element={<PatientRecordsDatabase />}
        />
        <Route path="ScheduleAppointment" element={<ScheduleAppointment />} />
        <Route path="BookingCalendar" element={<BookingCalendar />} />

        {/* Protected route example */}
        <Route
          path="FinancialOverview"
          element={
            <ProtectedRoute>
              <Fin />
            </ProtectedRoute>
          }
        />

        {/* Catch-all error page */}
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}

export default App;
