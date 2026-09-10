import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ roles }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (roles?.length && !roles.some((role) => user.roles?.includes(role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;