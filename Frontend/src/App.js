import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./component/Admin";
import AdminDash from "./component/AdminDash";
import "./App.css";
import Attendance from "./component/Attendance";
import UserLogin from "./component/UserLogin";
import UserDash from "./component/UserDash";
import Profile from "./component/Profile";
import Fees from "./component/Fees";
import ForgotPassword from "./component/ForgotPassword";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Admin />} />
        <Route path="/admin-dash" element={<AdminDash />} />
        
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-dash" element={<UserDash />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Attendence" element={<Attendance />} />
        <Route path="/Fees" element={<Fees/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;