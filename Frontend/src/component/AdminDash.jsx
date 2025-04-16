import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Attendance from './Attendance';
import Fees from './Fees';

const AdminDash = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [showForm, setShowForm] = useState(false); 
  const [showAttendance, setShowAttendance] = useState(false);
  const [showAmount, setshowAmount] = useState(false);

  
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !mobile || !email) {
      alert('All fields are required!');
      return;
    }

    const generatedPassword = Math.random().toString(36).slice(-8);
    const userData = {
      name,
      mobile,
      email,
      password: generatedPassword
    };
    try {
      // Send POST request to Spring Boot backend
      await axios.post("http://localhost:8080/api/check", userData);
    const emailBody = `
      Hello ${name},

      Your account has been created successfully!
      Here are your login credentials:

      Email: ${email}
      Password: ${generatedPassword}

      Please log in to the application using these credentials.

      Regards,
      Admin
    `;

    // Sending email logic (placeholder)
    console.log(`Sending email to ${email}:\n${emailBody}`);
    alert('User details submitted, and email sent!');

    // Reset form
    setName('');
    setMobile('');
    setEmail('');

    // Redirect to the admin dashboard after successful form submission
    navigate('/admin-dash');
  } catch (error) {
    console.error('There was an error creating the user:', error);
    alert('Failed to create user. Please try again.');
  }
    
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navbarContent}>
          <h3 style={styles.navbarBrand}>Admin Panel</h3>
          <ul style={styles.navbarMenu}>
            
            <li><a href="/" style={styles.navbarLink}>Logout</a></li>
          </ul>
        </div>
      </nav>

      {/* New Member Button outside navbar positioned to the right side of the screen */}
      <button onClick={() => setShowForm(!showForm)} style={styles.newMemberButton}>
        New Member
      </button>

      <button onClick={() => setShowAttendance(!showAttendance)} style={styles.attendanceButton}>
        Attendance
      </button>

      <button onClick={() => setshowAmount(!showAmount)} style={styles.AmountButton}>
        FeesTable
      </button>

      {/* Conditional rendering of the dashboard or the registration form */}
      
      <div style={styles.container}>
        {showForm ? (
          <div>
            <h1 style={styles.header}>Register New Member</h1>

            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
            <input
              type="tel"
              placeholder="Enter Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              style={styles.input}
            />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <button onClick={handleSubmit} style={styles.button}>
              Submit
            </button>
          </div>
        ) : showAttendance ? (
          <Attendance />  // Render Attendance Component when button is clicked
        )  : showAmount ? (
          <Fees /> // ✅ Show Fees component when Amount button is clicked
        ) : (
           
          <div style={styles.max}>
            <h1 style={styles.header}>Dashboard</h1><br></br>
            <p>Welcome to the admin dashboard. Manage your members here.</p>
          </div>
         
        )}
      </div>
    </div>
  );
};

export default AdminDash;

const styles = {
    navbar: {
      backgroundColor: '#343a40',
      padding: '6px 20px',
    },
    navbarContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    navbarBrand: {
      color: '#fff',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    navbarMenu: {
      listStyle: 'none',
      display: 'flex',
      margin: 0,
      padding: 0,
    },
    navbarLink: {
      color: '#fff',
      padding: '0 15px',
      textDecoration: 'none',
      fontSize: '16px',
    },
    Attendence:{
      position: 'fixed', // Fixing the position relative to the viewport
      top: '80px', // Placing it near the top
      right: '10px',
      padding: '8px 25px',
      backgroundColor: '#007BFF',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      zIndex: 100, // Ensures the button stays on top of other elements
      fontSize: '16px',
      

    },
    attendanceButton: {

      position: 'fixed', // Fixing the position relative to the viewport
      top: '80px',
      right: '155px',
      padding: '8px 25px',
      backgroundColor: '#000075',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      zIndex: 100, // Ensures the button stays on top of other elements
      fontSize: '16px', // Default font size
    },
    AmountButton:{
      position: 'fixed',
      top: '80px',
      right: '10px',
      padding: '8px 25px',
      backgroundColor: 'skyblue',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      zIndex: 100,
      fontSize: '16px',
    },
    newMemberButton: {
      position: 'fixed',
      top: '80px',
      right: '310px',
      padding: '8px 25px',
      backgroundColor: 'skyblue',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      zIndex: 100,
      fontSize: '16px',
    },
    container: {
    width: '80%',            // Adjust width for a better layout
    maxWidth: '800px',       // Prevent it from getting too wide
    minHeight: '300px',      // Prevent shrinking too much
    margin: '100px auto',    // Center it horizontally and move it down
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    display: 'flex',         // Use flexbox for centering
    flexDirection: 'column', // Stack elements vertically
    justifyContent: 'center', // Center content inside
    alignItems: 'center',
    transition: 'height 0.3s ease-in-out', // Smooth height changes
  },
    header: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '16px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#007BFF',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },

    max:{
       margin: '20px'
    },
  
    // Responsive styles for smaller screens
    '@media screen and (max-width: 768px)': {
      newMemberButton: {
        top: '20px', // Move the button higher for smaller screens
        right: '10px',
        padding: '10px 25px',
        fontSize: '14px', // Smaller font size for smaller screens
      },
    },
    
    '@media screen and (max-width: 480px)': {
      newMemberButton: {
        top: '10px', // Move the button even higher for mobile
        right: '5px', // Reduce the right margin
        padding: '10px 20px', // Adjust padding for smaller screens
        fontSize: '12px', // Smaller font size for mobile
      },
    },
  };
  