import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContext";

const AdminAuthRoute = ({ children }) => {
  const { admin } = useContext(AdminAuthContext);

  // 🔒 If admin already logged in → go dashboard
  if (admin) {
    return <Navigate to="/adminpanel" replace />;
  }

  return children;
};

export default AdminAuthRoute;