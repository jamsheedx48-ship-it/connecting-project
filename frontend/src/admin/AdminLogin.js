import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./css/AdminLogin.css";
import { toast } from "react-toastify";
import { replace, useNavigate } from "react-router-dom";
import AdminAPI from "../api/adminAPI";
import { useContext } from "react";
import { AdminAuthContext } from "../context/AdminAuthContext";

const AdminLogin = () => {
  const { login } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const msg=localStorage.getItem("flashMessage")


    if(msg){
      localStorage.removeItem("flashMessage")
      setTimeout(()=>{
        toast.error(msg)
      },300)
    }
  
  },[])

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await AdminAPI.post("login/", {
        email: email,
        password: password,
      });

      toast.success("Login success");
      login(res.data)
      
    } catch (err) {
      console.log(err);

      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Invalid email or password";

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="admin-login-box">
        <h2>Admin Login</h2>

        <form>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />{" "}
          <br />
          <br />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <br />
          <br />
          <Button
            variant="dark"
            className="admin-login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
