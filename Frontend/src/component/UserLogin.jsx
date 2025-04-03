import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";
import axios from "axios";

const UserLogin = () => {
  const [focus, setFocus] = useState("");
  const [input, setInput] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleFocus = (inputType) => setFocus(inputType);
  const handleBlur = () => setFocus("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInput({ ...input, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://192.168.0.114:8080/api/login", input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Ensures cookies are sent if needed
      });

      if (response.status === 200) {
        localStorage.setItem("userEmail", input.email); // Store email after successful login
        alert(response.data);
        navigate("/user-dash"); // Redirect to user dashboard
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Failed to login. Please check your credentials and try again.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navbarContent}>
          <h3 style={styles.navbarBrand}>CodeBegun</h3>
          <h3 className="wlcm">Welcome to User's Page!</h3>
          <ul style={styles.navbarMenu}>
            <li><a href="/" style={styles.navbarLink}>Admin Login</a></li>
          </ul>
        </div>
      </nav>

      <div className="container">
        <form className="uform" onSubmit={handleSubmit}>
          <div className="userlogin">
            <h3 id="ul">User Login</h3>
          </div>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={input.email}
            onChange={handleChange}
            onFocus={() => handleFocus("email")}
            onBlur={handleBlur}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={input.password}
            onChange={handleChange}
            onFocus={() => handleFocus("password")}
            onBlur={handleBlur}
            required
          />

          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>

          <p
  style={{
    textAlign: "center",
    display: "block",
    marginTop: "10px",
    cursor: "pointer",
    color: "skyblue", // Default color
    fontSize: "14px",
    transition: "color 0.3s ease", // Smooth transition
  }}
  className="forgot-password"
  onMouseEnter={(e) => (e.target.style.color = "red")} // Changes to red on hover
  onMouseLeave={(e) => (e.target.style.color = "black")} // Changes back to white
  onClick={() => navigate("/forgot-password")}
>
  Forgot Password?
</p>
        </form>

        

        {/* Animated Panda */}
        <div className="ear-l"></div>
        <div className="ear-r"></div>
        <div className="panda-face">
          <div className="blush-l"></div>
          <div className="blush-r"></div>
          <div className="eye-l">
            <div
              className="eyeball-l"
              style={{
                left: focus === "email" ? "0.75em" : "0.6em",
                top: focus === "email" ? "1.12em" : "0.6em",
              }}
            ></div>
          </div>
          <div className="eye-r">
            <div
              className="eyeball-r"
              style={{
                right: focus === "email" ? "0.75em" : "0.6em",
                top: focus === "email" ? "1.12em" : "0.6em",
              }}
            ></div>
          </div>
          <div className="nose"></div>
          <div className="mouth"></div>
        </div>

        {/* Hands Animation */}
        <div
          className="hand-l"
          style={{
            height: focus === "password" ? "6.56em" : "2.81em",
            top: focus === "password" ? "3.87em" : "8.4em",
            left: focus === "password" ? "11.75em" : "7.5em",
            transform: focus === "password" ? "rotate(-155deg)" : "rotate(0deg)",
          }}
        ></div>

        <div
          className="hand-r"
          style={{
            height: focus === "password" ? "6.56em" : "2.81em",
            top: focus === "password" ? "3.87em" : "8.4em",
            right: focus === "password" ? "11.75em" : "7.5em",
            transform: focus === "password" ? "rotate(155deg)" : "rotate(0deg)",
          }}
        ></div>

        <div className="paw-l"></div>
        <div className="paw-r"></div>
      </div>
    </div>
  );
};

export default UserLogin;

const styles = {
  navbar: {
    backgroundColor: "#343a40",
    padding: "10px 20px",
  },
  navbarContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navbarBrand: {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
  },
  navbarMenu: {
    listStyle: "none",
    display: "flex",
    margin: 0,
    padding: 0,
  },
  navbarLink: {
    color: "#fff",
    padding: "0 15px",
    textDecoration: "none",
    fontSize: "16px",
  },

  

};
