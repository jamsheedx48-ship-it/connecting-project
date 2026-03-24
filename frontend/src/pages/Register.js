import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Reg.css";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../api/axios";
import { Toast } from "react-bootstrap";
const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Enter a valid name");
      return;
    }
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    const usernamePattern = /^[A-Za-z0-9_]+$/;
    if (!usernamePattern.test(username)) {
      toast.error("Username can only contain letters, numbers and underscore");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Invalid email address");
      return;
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordPattern.test(password)) {
      toast.error(
        "Password must contain uppercase, lowercase, number and be at least 8 characters",
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const user = {
      username: username,
      email: email,
      password: password,
      confirm_password:confirmPassword
    };

    try {
      const res = await API.post("accounts/send-otp/", user);

      toast.success(`OTP sent to ${email}`);
      setStep(2);
    } catch (error) {
      console.log(error.response?.data);

      const err = error.response?.data;
      if (err?.email) {
        toast.error(err.email[0]);
      } else if (err?.username) {
        toast.error(err.username[0]);
      }else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      await API.post("accounts/verify-otp/", {
        username: username,
        email: email,
        password:password,
        confirm_password:confirmPassword,
        otp: otp,
      });
      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      const err = error.response?.data;

      if (err?.error) {
        toast.error(err.error);
      } else {
        toast.error("Invalid OTP");
      }
    }
  };

  return (
    <>
      <div className="auth-container">
        <h2>Register</h2>
        <form onSubmit={step===1 ? handleSendOTP :(e)=>e.preventDefault()}>
          {step === 1 && (
            <>
              <input
                type="text"
                placeholder="Your Name"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <br />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <br />

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <br />
              <br />

              <button type="submit">Send OTP</button>
              <p>
                {" "}
                <small>Already have an account?</small>{" "}
                <Link to="/login">
                  <span>Login</span>
                </Link>
              </p>
            </>
          )}

          {step===2 && (
            <>
            <p>Enter OTP sent to <b>{email}</b></p>

            <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            maxLength={6}
            onChange={(e)=>setOtp(e.target.value)}
            />
            <br/> <br/>
            <button type="button" onClick={handleVerifyOTP}>
              Verify & Register
            </button>
            <button type="button" onClick={()=>setStep(1)} style={{ marginTop: "10px", background: "gray" }}>
              Edit Details
            </button>
            </>
          )}
        </form>
      </div>
    </>
  );
};
export default Register;
