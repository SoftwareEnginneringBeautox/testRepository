import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import FinancialOverview from "./pages/FinancialOverview";
import AdministratorDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import PatientRecordsDatabase from "./pages/PatientRecordsDatabase";
import AdministratorServices from "./pages/AdministratorServices";
import BookingCalendar from "./pages/BookingCalendar";
import ErrorPage from "./errors/Error404";
import LandingPage from "@/pages/LandingPage";
import ForgotPassword from "@/pages/ForgotPassword";
import StaffServices from "@/pages/StaffServices";

// PublicRoute prevents logged-in users from accessing login/landing pages.
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").trim().toLowerCase();

  // If a user is already logged in, send them to their appropriate dashboard.
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

// AdminRoute protects admin-only pages.
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").trim().toLowerCase();

  // If not logged in, redirect to login.
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // If logged in but not an admin, redirect to the staff dashboard.
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
        {/* Public routes (accessible only if not logged in) */}
        <Route
          index
          element={
            <PublicRoute>
              <LandingPage />
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

        {/* Admin-only routes (using wildcard to capture any trailing query parameters) */}
        <Route
          path="AdminDashboard/*"
          element={
            <AdminRoute>
              <AdministratorDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="AdministratorServices/*"
          element={
            <AdminRoute>
              <AdministratorServices />
            </AdminRoute>
          }
        />
        <Route
          path="StaffServices/*"
          element={
            <AdminRoute>
              <StaffServices />
            </AdminRoute>
          }
        />

        {/* Other routes */}
        <Route path="StaffDashboard" element={<StaffDashboard />} />
        <Route
          path="PatientRecordsDatabase"
          element={<PatientRecordsDatabase />}
        />
        {/* <Route path="ScheduleAppointment" element={<ScheduleAppointment />} /> */}
        <Route path="BookingCalendar" element={<BookingCalendar />} />

        <Route path="ForgotPassword" element={<ForgotPassword />} />

        {/* Protected route example */}
        <Route
          path="FinancialOverview"
          element={
            <ProtectedRoute>
              <FinancialOverview />
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
