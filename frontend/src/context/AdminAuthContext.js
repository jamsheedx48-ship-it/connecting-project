import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [admin, setAdmin] = useState(
        localStorage.getItem("username")
    );

    // 🔐 ADMIN LOGIN
    const login = (data) => {
        localStorage.setItem("AdminToken", data.access);
        localStorage.setItem("AdminRefresh", data.refresh);
        localStorage.setItem("username", data.username);

        setAdmin(data.username);

        navigate("/adminpanel"); // go to admin dashboard
    };

    // 🚪 ADMIN LOGOUT
    const logout = () => {
        localStorage.removeItem("AdminToken");
        localStorage.removeItem("AdminRefresh");
        localStorage.removeItem("username");

        setAdmin(null);

        // sync across tabs
        localStorage.setItem("admin_logout", Date.now());

        navigate("/admin");
    };

    // 🔄 sync between tabs
    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === "AdminToken" || event.key === "admin_logout") {
                const currentAdmin = localStorage.getItem("admin_username");
                setAdmin(currentAdmin);
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return (
        <AdminAuthContext.Provider value={{ admin, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};