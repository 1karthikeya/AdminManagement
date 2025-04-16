import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/admin/reset-password", {
        email,
        newPassword,
      });
  
      setResetMessage(response.data);
    } catch (error) {
      setResetMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-form" onSubmit={handleResetPassword}>
        <h3>Reset Password</h3>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Old Password</label>
        <input
          type="password"
          placeholder="Enter old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit">Update Password</button>
        <p>{resetMessage}</p>

        <p className="back-to-login" onClick={() => navigate("/user-login")}>
          Back to Login
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
