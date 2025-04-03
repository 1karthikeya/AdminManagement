import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const Fees = () => {
  const [usersWithFees, setUsersWithFees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newAmounts, setNewAmounts] = useState({});
  const [editMode, setEditMode] = useState({});

  useEffect(() => {
    const fetchUsersAndFees = async () => {
      try {
        // ✅ Fetch all users
        const usersResponse = await axios.get("http://192.168.0.114:8080/api/all");
        console.log("Users Data:", usersResponse.data);

        const users = usersResponse.data;

        // ✅ Fetch fee data for each user
        const feePromises = users.map(async (user) => {
          try {
            const feeResponse = await axios.get(`http://192.168.0.114:8080/api/fees/${user.rollNumber}`);
            return {
              rollNumber: user.rollNumber,
              name: `${user.firstName} ${user.lastName}`,
              amount: feeResponse.data.amount ?? 0, // Default 0 if no fee record exists
            };
          } catch (error) {
            return {
              rollNumber: user.rollNumber,
              name: `${user.firstName} ${user.lastName}`,
              amount: 0 // Default to 0 if fee data is missing
            };
          }
        });

        // ✅ Resolve all promises
        const mergedData = await Promise.all(feePromises);
        console.log("Final Merged Data:", mergedData);
        setUsersWithFees(mergedData);

      } catch (err) {
        console.error("API Error:", err.response ? err.response.data : err.message);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndFees();
  }, []);

  const handleAmountChange = (rollNumber, value) => {
    setNewAmounts((prev) => ({ ...prev, [rollNumber]: value }));
  };

  const handleAddAmount = async (rollNumber) => {
    const latestAmount = parseFloat(newAmounts[rollNumber]);

    if (!latestAmount || isNaN(latestAmount)) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const requestBody = {
        rollNumber,
        amount: latestAmount, // ✅ Only send the new amount, let the backend add it correctly
      };

      console.log("Sending Data:", JSON.stringify(requestBody));

      await axios.post("http://192.168.0.114:8080/api/add", requestBody, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Amount updated successfully!");

      // ✅ Re-fetch latest amount from backend to prevent doubling
      const updatedFeeResponse = await axios.get(`http://192.168.0.114:8080/api/fees/${rollNumber}`);
      const updatedAmount = updatedFeeResponse.data.amount ?? 0;

      // ✅ Update UI with the latest amount from the backend
      setUsersWithFees((prev) =>
        prev.map((user) =>
          user.rollNumber === rollNumber ? { ...user, amount: updatedAmount } : user
        )
      );

      // ✅ Clear input field and exit edit mode
      setNewAmounts((prev) => ({ ...prev, [rollNumber]: "" }));
      setEditMode((prev) => ({ ...prev, [rollNumber]: false }));

    } catch (error) {
      console.error("Failed to update amount:", error.response?.data || error);
      alert("Error updating amount.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Fees Table</h2>
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-500 text-left">
          <thead>
            <tr className="bg-gray-300">
              <th className="border border-gray-500 px-6 py-3">Roll Number</th>
              <th className="border border-gray-500 px-6 py-3">Name</th>
              <th className="border border-gray-500 px-6 py-3 text-center">Total Amount</th>
              <th className="border border-gray-500 px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersWithFees.length > 0 ? (
              usersWithFees.map((user) => (
                <tr key={user.rollNumber} className="hover:bg-gray-100">
                  <td className="border border-gray-500 px-6 py-3">{user.rollNumber}</td>
                  <td className="border border-gray-500 px-6 py-3">{user.name}</td>

                  {/* ✅ Display Total Amount */}
                  <td className="border border-gray-500 px-6 py-3 text-center">
                    {user.amount}
                  </td>

                  <td className="border border-gray-500 px-6 py-3 text-center">
                    {editMode[user.rollNumber] ? (
                      <>
                        <input
                          type="text"
                          className="border p-1 w-24"
                          placeholder="Enter amount"
                          value={newAmounts[user.rollNumber] || ""}
                          onChange={(e) => handleAmountChange(user.rollNumber, e.target.value)}
                        />
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded ml-2"
                          onClick={() => handleAddAmount(user.rollNumber)}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => setEditMode((prev) => ({ ...prev, [user.rollNumber]: true }))}>
                        {user.amount === 0 ? "Add" : "Update"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">No data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fees;
