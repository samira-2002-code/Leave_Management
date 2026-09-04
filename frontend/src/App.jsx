import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LeaveRequest from "./pages/LeaveRequest";
import Requests from "./pages/Requests";
import Manager from "./pages/Manager";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/leave-request"
            element={<LeaveRequest />}
          />

          <Route
            path="/requests"
            element={<Requests />}
          />

          <Route
            path="/manager"
            element={<Manager />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;