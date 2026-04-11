import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If normal user already logged in → go home
  if (user && !user.is_staff) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRoute;