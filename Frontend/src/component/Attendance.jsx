import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const getFormattedDate = () => new Date().toISOString().split("T")[0];

const Attendance = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(getFormattedDate());
  const [attendance, setAttendance] = useState({});
  const [markedAttendance, setMarkedAttendance] = useState({});
  const [message, setMessage] = useState("");
  const [monthlyAttendance, setMonthlyAttendance] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchMonthlyAttendance();
    fetchExistingAttendance(currentDate);
  }, [currentDate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/all");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users.");
    }
  };

  const fetchMonthlyAttendance = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/monthlyAttendance");
      setMonthlyAttendance(response.data);
    } catch (error) {
      console.error("Error fetching monthly attendance:", error);
      setError("Failed to load attendance data.");
    }
  };

  const fetchExistingAttendance = async (date) => {
    try {
      const response = await axios.get("http://localhost:8080/api/attendance", { params: { date } });
      const existingAttendance = response.data.reduce((acc, entry) => {
        acc[entry.rollNumber] = entry.status;
        return acc;
      }, {});
      setMarkedAttendance(existingAttendance);
    } catch (error) {
      console.error("Error fetching existing attendance:", error);
      setMessage("Failed to fetch attendance.");
    }
  };

  const handleAttendanceChange = (rollNumber) => {
    if (markedAttendance[rollNumber]) return;
    setAttendance((prev) => ({ ...prev, [rollNumber]: !prev[rollNumber] }));
  };

  const saveIndividualAttendance = async (rollNumber) => {
    if (markedAttendance[rollNumber]) return;
    
    const attendanceData = {
      rollNumber,
      date: currentDate,
      status: attendance[rollNumber] ? "Present" : "Absent",
    };

    try {
      const response = await axios.post("http://localhost:8080/api/saveAttendance", [attendanceData], {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        setMarkedAttendance((prev) => ({ ...prev, [rollNumber]: attendanceData.status }));
        setMessage("Attendance saved successfully!");
        fetchMonthlyAttendance();
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      setMessage("Failed to save attendance.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Attendance Table</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-500 text-left">
          <thead>
            <tr className="bg-gray-300">
              <th className="border border-gray-500 px-6 py-3">Roll Number</th>
              <th className="border border-gray-500 px-6 py-3">Name</th>
              <th className="border border-gray-500 px-6 py-3 text-center">{currentDate}</th>
              <th className="border border-gray-500 px-6 py-3 text-center">Monthly Attendance (%)</th>
              <th className="border border-gray-500 px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.rollNumber} className="hover:bg-gray-100">
                <td className="border border-gray-500 px-6 py-3">{user.rollNumber}</td>
                <td className="border border-gray-500 px-6 py-3">{user.firstName} {user.lastName}</td>
                <td className="border border-gray-500 px-6 py-3 text-center">
                  <input
                    type="checkbox"
                    onChange={() => handleAttendanceChange(user.rollNumber)}
                    checked={attendance[user.rollNumber] || false}
                    disabled={!!markedAttendance[user.rollNumber]}
                    className="cursor-pointer"
                  />
                </td>
                <td className="border border-gray-500 px-6 py-3 text-center">
                  {monthlyAttendance[user.rollNumber] ? `${monthlyAttendance[user.rollNumber]}%` : "0%"}
                </td>
                <td className="border border-gray-500 px-6 py-3 text-center">
                  <button
                    onClick={() => saveIndividualAttendance(user.rollNumber)}
                    disabled={!!markedAttendance[user.rollNumber]}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {message && <p className={`mt-2 text-lg ${message.includes("Failed") ? "text-red-500" : "text-green-500"}`}>{message}</p>}
    </div>
  );
};

export default Attendance;
const styles = {
  Border1:{
    padding:"20px",
  }
};