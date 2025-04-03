import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Profile from "./Profile";

const UserDash = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState(null); // Store fetched user data


  
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      fetchUserData(userEmail);
    }
  }, []);

  const fetchUserData = async (email) => {
    try {
      const response = await axios.get(`http://192.168.0.114:8080/api/user?email=${email}`);
      if (response.data) {
        setUserData(response.data);
        setIsRegistered(true); // If data exists, set as registered
      } else {
        setIsRegistered(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsRegistered(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/user-login");
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.cb}>CodeBegun</div>
        <div style={styles.center}>User Dashboard</div>
        <div style={styles.navItems}>
          <button onClick={() => setShowProfile(!showProfile)} style={styles.profileButton}>
            Profile
          </button>
          <button
            onClick={handleLogout}
            style={isHovered ? { ...styles.logoutButton, ...styles.logoutButtonHover } : styles.logoutButton}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Show Profile if user data exists, otherwise show registration form */}
      <div style={styles.contentContainer}>
        {showProfile ? (
          <Profile userData={userData} />
        ) : isRegistered ? (
          <p>Welcome, {userData.firstName}!</p>
        ) : (
          <UserRegistrationForm fetchUserData={fetchUserData} />
        )}
      </div>
    </div>
  );
};

// User Registration Form
const UserRegistrationForm = ({ fetchUserData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: localStorage.getItem("userEmail") || "",
    mobileNumber: "",
    gender: "",
    dob: "",
    educationLevel: "",
    course: "",
    courseCode: "",
    rollNumber: "",
  });

  const courseOptions = {
    "B.Tech": ["Computer Science", "Mechanical", "Civil", "Electrical"],
    "B.Com": ["Accounting", "Finance", "Marketing"],
    "B.Sc": ["Physics", "Chemistry", "Mathematics"],
    MBA: ["HR", "Finance", "Marketing"],
  };

  const coursecb = {
    jfs: "Java Full Stack",
    pyfs: "Python Full Stack",
    mern: "MERN Stack",
    mean: "MEAN Stack",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === "educationLevel" ? { course: "" } : {}),
    }));
  };

  const generateRollNumber = () => {
    if (formData.courseCode && formData.mobileNumber) {
      return `${formData.courseCode.toUpperCase()}-${formData.mobileNumber.slice(-4)}`;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const generatedRollNumber = generateRollNumber();
    const updatedFormData = { ...formData, rollNumber: generatedRollNumber };
    setFormData(updatedFormData);

    try {
      const response = await axios.post("http://192.168.0.114:8080/api/save", updatedFormData);
      if (response.status === 201) {
        alert("Registration Successful!");
        fetchUserData(updatedFormData.email);
      } else {
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };
  return (
    <div>
      {/* Navbar */}
      {/* <nav style={styles.navbar}>
        <div style={styles.cb}>CodeBegun</div>
        <div style={styles.center}>User Dashboard</div>
        <div style={styles.navItems}>
        <button 
  onClick={() => setShowProfile(!showProfile)} 
  style={styles.profileButton}
>
  Profile
</button>
          <button
            onClick={handleLogout}
            style={isHovered ? { ...styles.logoutButton, ...styles.logoutButtonHover } : styles.logoutButton}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Logout
          </button>
        </div>
      </nav> */}

      {/* Form Section */}
      
        <div style={styles.ud}>
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>User Registration Form</h2>
            <h4 style={styles.PD}>Personal Details</h4>

            {/* First Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={styles.input} />
            </div>

            {/* Last Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={styles.input} />
            </div>

            {/* Email */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />
            </div>

            {/* Mobile Number */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Mobile Number</label>
              <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required style={styles.input} />
            </div>

            {/* Gender */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required style={styles.select}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required style={styles.input} />
            </div>

            {/* Education Level */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Education Level</label>
              <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} required style={styles.select}>
                <option value="">Select Education Level</option>
                {Object.keys(courseOptions).map((edu) => (
                  <option key={edu} value={edu}>
                    {edu}
                  </option>
                ))}
              </select>
            </div>

            {/* Course */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Course</label>
              <select name="course" value={formData.course} onChange={handleChange} required disabled={!formData.educationLevel} style={styles.select}>
                <option value="">Select Course</option>
                {formData.educationLevel && courseOptions[formData.educationLevel].map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Code */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Course</label>
              <select name="courseCode" value={formData.courseCode} onChange={handleChange} required style={styles.select}>
                <option value="">Select Course Code</option>
                {Object.keys(coursecb).map((code) => (
                  <option key={code} value={code}>
                    {coursecb[code]}
                  </option>
                ))}
              </select>
            </div>

            {/* Roll Number */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Generated Roll Number</label>
              <input type="text" name="rollNumber" value={formData.rollNumber} readOnly style={styles.input} />
            </div>

            {/* Submit Button */}
            <button type="submit" onClick={handleSubmit} style={styles.submitButton}>
              Submit
            </button>
          </div>
        </div>
      

      {/* Profile Section */}
      {/* {showProfile && <div style={styles.profile}><Profile /></div>} */}
    </div>
  );
};

// Styles
const styles = {
  cb: { display: "flex", fontSize: "27px" },
  center: { display: "flex", fontSize: "25px", color: "skyblue", marginLeft: "auto" },
  navbar: { display: "flex", justifyContent: "space-between", padding: "5px 10px", backgroundColor: "#333", color: "#fff", position:"fixed",top:"0",width:"100%" },
  navItems: { display: "flex", gap: "20px", padding: "5px", marginLeft: "auto" },
  navItem: { textDecoration: "none", color: "#fff", fontSize: "20px", cursor: "pointer" },
  logoutButton: { marginLeft: "10px", backgroundColor: "white", color: "black", border: "none", padding: "7px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "12px", transition: "background 0.3s" },
  logoutButtonHover: { backgroundColor: "red" },
  userDashForm: {marginTop: "10px",width:"150px"},
 ud:{display:"flex" , justifyContent:"center" , margin:"70px"},
    PD:{justifyContent:"left" , fontSize:"20px", padding:"0px 0px 0px 5px", marginBottom:"10px" ,justifyContent: "rift",
      fontSize: "20px",
      padding: "0px 0px 0px 5px",
      marginBottom: "10px",
      textDecoration: "underline"},
  formContainer: { width: "700px", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff" },
  formTitle: { textAlign: "center", fontSize: "24px", marginBottom: "20px" },
  formGroup: { marginBottom: "15px" },
  label: { display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "5px" },
  input: { width: "100%", padding: "8px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ccc" },
  select: { width: "100%", padding: "8px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ccc" },
  submitButton: { width: "100%", padding: "10px", fontSize: "16px", color: "white", backgroundColor: "#007bff", border: "none", borderRadius: "4px", cursor: "pointer", transition: "background 0.3s" },
 profile:{
 marginTop: "80px" 
 },
 profileButton: {
  backgroundColor: "#007bff", // Change to desired color (e.g., blue)
  color: "white", 
  padding: "5px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
}


};

export default UserDash;
