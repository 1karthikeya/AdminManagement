import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
  const [focus, setFocus] = useState("");
  const [credentials] = useState({ username: "admin", password: "admin123" });
  const [input, setInput] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFocus = (inputType) => {
    setFocus(inputType);
  };

  const handleBlur = () => {
    setFocus("");
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInput({ ...input, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      input.username === credentials.username &&
      input.password === credentials.password
    ) {
      setError("");
      navigate("/admin-dash");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navbarContent}>
          <h3 style={styles.navbarBrand}>CodeBegun</h3>
          <h3 style={{color:"skyblue"}}>Welcome to Admin's Page!</h3>
          <ul style={styles.navbarMenu}>
            <li>
              <a href="/user-login" style={styles.navbarLink}>
                User Login
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container">
        <form onSubmit={handleSubmit}style={styles.form}>
          <div className="adminlogin">
            <h3>Admin Login</h3>
          </div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={input.username}
            onChange={handleChange}
            onFocus={() => handleFocus("username")}
            onBlur={handleBlur}
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
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <div className="ear-l"></div>
        <div className="ear-r"></div>
        <div className="panda-face">
          <div className="blush-l"></div>
          <div className="blush-r"></div>
          <div className="eye-l">
            <div
              className="eyeball-l"
              style={{
                left: focus === "username" ? "0.75em" : "0.6em",
                top: focus === "username" ? "1.12em" : "0.6em",
              }}
            ></div>
          </div>
          <div className="eye-r">
            <div
              className="eyeball-r"
              style={{
                right: focus === "username" ? "0.75em" : "0.6em",
                top: focus === "username" ? "1.12em" : "0.6em",
              }}
            ></div>
          </div>
          <div className="nose"></div>
          <div className="mouth"></div>
        </div>
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

export default Admin;

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
