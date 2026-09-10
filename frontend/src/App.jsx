import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import LeaveRequest from "./pages/LeaveRequest";
import Requests from "./pages/Requests";
import Manager from "./pages/Manager";

import HRDashboard from "./pages/HR/HRDashboard";
import Employees from "./pages/HR/Employees";
import LeaveRequests from "./pages/HR/LeaveRequests";
import LeaveTypes from "./pages/HR/LeaveTypes";
import LeaveBalances from "./pages/HR/LeaveBalances";
import CalendarPage from "./pages/HR/CalendarPage";
import Reports from "./pages/HR/Reports";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leave-request" element={<LeaveRequest />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/calendar" element={<CalendarPage />} />

          <Route element={<ProtectedRoute roles={["manager", "admin"]} />}>
            <Route path="/manager" element={<Manager />} />
          </Route>

          <Route element={<ProtectedRoute roles={["hr", "admin"]} />}>
            <Route path="/hr" element={<HRDashboard />} />
            <Route path="/hr/employees" element={<Employees />} />
            <Route path="/hr/leave-requests" element={<LeaveRequests />} />
            <Route path="/hr/leave-types" element={<LeaveTypes />} />
            <Route path="/hr/leave-balances" element={<LeaveBalances />} />
            <Route path="/hr/calendar" element={<CalendarPage />} />
            <Route path="/hr/reports" element={<Reports />} />
          </Route>

        </Route>

        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;