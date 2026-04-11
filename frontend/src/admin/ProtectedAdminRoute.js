import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContext";

const ProtectedAdminRoute = ({ children }) => {
    const { admin } = useContext(AdminAuthContext);

    if (!admin) {
        return <Navigate to="/admin" relative />;
    }

    return children;
};

export default ProtectedAdminRoute;