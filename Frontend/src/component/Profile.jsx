import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [presentCount, setPresentCount] = useState(null);



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

  
  

  useEffect(() => {
    const fetchUserData = async () => {
      const storedEmail = localStorage.getItem("userEmail");
  
      if (!storedEmail) {
        setError("No logged-in user found. Please log in again.");
        setLoading(false);
        return;
      }
  
      try {
        // ✅ Fetch user details
        const response = await axios.get("http://localhost:8080/api/user", {
          params: { email: storedEmail },
        });
  
        if (response.status === 200 && response.data) {
          setUserData(response.data);
          const { rollNumber } = response.data;
  
          if (rollNumber) {
            // ✅ Fetch Attendance Data
            try {
              const attendanceResponse = await axios.get(
                "http://localhost:8080/api/yattendance",
                { params: { rollNumber } }
              );

              console.log("Attendance API Response:", attendanceResponse.data);

              if (attendanceResponse.status === 200 && attendanceResponse.data.attendance) {
                const [present, total] = attendanceResponse.data.attendance.split("/");
                setPresentCount({ present, total });
              } else {
                setPresentCount({ present: "0", total: "0" });
              }
            } catch (error) {
              console.error("Error fetching attendance data:", error);
              setPresentCount("Error");
            }
            // ✅ Fetch Fee Amount by Roll Number
            try {
              const feeResponse = await axios.get(
                `http://localhost:8080/api/fees/${rollNumber}`
              );
  
              console.log("Fee API Response:", feeResponse.data);
              setUserData((prev) => ({
                ...prev,
                feeAmount: feeResponse.data.amount !== null ? feeResponse.data.amount : 0, // Default 0 if no fee
              }));
            } catch (error) {
              console.error("Error fetching fee data:", error);
              setUserData((prev) => ({ ...prev, feeAmount: "Not Available" }));
            }
  
          } else {
            console.error("rollNumber is missing!");
          }
        } else {
          setError("User not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditedData((prevState) => {
      const updatedData = { ...prevState, [name]: value };

      // Update the roll number when courseCode is changed
      if (name === "courseCode" || name === "mobileNumber") {
        updatedData.rollNumber = generateRollNumber(
          name === "courseCode" ? value : prevState.courseCode,
          name === "mobileNumber" ? value : prevState.mobileNumber
        );
      }

      return updatedData;
    });
  };

  // ✅ Handle Edit button click
  const handleEdit = () => {
    setEditedData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobileNumber: userData.mobileNumber,
      dob: userData.dob,
      educationLevel: userData.educationLevel,
      course: userData.course,
      courseCode: userData.courseCode,
      rollNumber: userData.rollNumber,
    });
    setIsEditing(true);
  };

  const generateRollNumber = (courseCode, mobileNumber) => {
    if (courseCode && mobileNumber) {
      return `${courseCode.toUpperCase()}-${mobileNumber.slice(-4)}`;
    }
    return "";
  };

  // ✅ Handle Save button click (Update data in SQL)
  const handleSave = async () => {
    try {
      const response = await axios.put("http://localhost:8080/api/update", {
        email: userData.email, // Email is used as identifier
        ...editedData,
      });

      if (response.status === 200) {
        setUserData({ ...userData, ...editedData });
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  // ✅ Handle Cancel button click
  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  return (
    <div>
      <h2>Profile</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : userData ? (
         <div style={styles.profileCard}>
          <p><strong>First Name:</strong> {isEditing ? <input type="text" name="firstName" value={editedData.firstName} onChange={handleChange} /> : userData.firstName}</p>
          <p><strong>Last Name:</strong> {isEditing ? <input type="text" name="lastName" value={editedData.lastName} onChange={handleChange} /> : userData.lastName}</p>
          <p><strong>Email:</strong> {userData.email}</p> {/* Email is not editable */}
          <p><strong>Mobile Number:</strong> {isEditing ? <input type="text" name="mobileNumber" value={editedData.mobileNumber} onChange={handleChange} /> : userData.mobileNumber}</p>
          <p><strong>Gender:</strong> {userData.gender}</p> {/* Gender is not editable */}
          <p><strong>Date of Birth:</strong> {isEditing ? <input type="date" name="dob" value={editedData.dob} onChange={handleChange} /> : userData.dob}</p>
          <p>
  <strong>Education Level:</strong>
  {isEditing ? (
    <select
      name="educationLevel"
      value={editedData.educationLevel}
      onChange={handleChange}
    >
      <option value="B.Tech">B.Tech</option>
      <option value="B.Com">B.Com</option>
      <option value="B.Sc">B.Sc</option>
      <option value="MBA">MBA</option>
    </select>
  ) : (
    userData.educationLevel
  )}
</p>

<p>
  <strong>Course:</strong>
  {isEditing ? (
    <select
      name="course"
      value={editedData.course}
      onChange={handleChange}
    >
      {courseOptions[editedData.educationLevel] &&
        courseOptions[editedData.educationLevel].map((course, index) => (
          <option key={index} value={course}>
            {course}
          </option>
        ))}
    </select>
  ) : (
    userData.course
  )}
</p>

<p>
  <strong>Course Code:</strong>
  {isEditing ? (
    <select
      name="courseCode"
      value={editedData.courseCode}
      onChange={handleChange}
    >
      {Object.keys(coursecb).map((key) => (
        <option key={key} value={key}>
          {coursecb[key]}
        </option>
      ))}
    </select>
  ) : (
    userData.courseCode
  )}
</p>
<p>
  <strong>Roll Number:</strong>{" "}
  {isEditing ? (
    <input type="text" name="rollNumber" value={editedData.rollNumber} readOnly />
  ) : (
    userData.rollNumber
  )}
</p>
<p><strong>Attendance Count:</strong> {presentCount.present}/{presentCount.total}</p>


<p><strong>Fee Paid:</strong> {userData?.feeAmount !== undefined ? `₹${userData.feeAmount}` : "Loading..."}</p>



    {isEditing ? (
            <div style={styles.buttonContainer}>
              <button style={styles.saveButton} onClick={handleSave}>Save</button>
              <button style={styles.cancelButton} onClick={handleCancel}>Cancel</button>
            </div>
          ) : (
            <div style={styles.buttonContainer}>
                 <button style={styles.editButton} onClick={handleEdit}>Edit</button>
            </div>
          )}
        </div>

      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

const styles = {
  div: {
    background: "linear-gradient(135deg, #f8f9fa, rgb(155, 161, 168))", // Light gradient background
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow
    maxWidth: "500px",
    margin: "50px auto", // Center alignment
    fontFamily: "'Poppins', sans-serif",
  },
  p: {
    fontSize: "18px",  // Normal font size
    color: "#333",
    margin: "15px 0",  // Adds 15px space above and below each <p>
    lineHeight: "1.6", // Improve text readability
    
  },
  strong: {
    color: "#007bff", // Blue highlight for labels
  },
  profileCard: {
    background: "linear-gradient(135deg, #f8f9fa, rgb(155, 161, 168))",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    margin: "50px auto",
    fontFamily: "'Poppins', sans-serif",
  },
  editButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "block",  // Make button block-level
    margin: "5px auto", // Center button horizontally
  },
  saveButton: {
    backgroundColor: "green",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  cancelButton: {
    backgroundColor: "red",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
};

export default Profile;
