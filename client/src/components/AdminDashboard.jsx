import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GetLocation from "./GetLocation";
import MapComponent from "./MapComponent";
import Swal from "sweetalert2";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

const AdminDashboard = () => {
  // const Image = "https://i.stack.imgur.com/HILmr.png";
  const adminId = localStorage.getItem("user_id");

  const [users, setUsers] = useState([]);

  const handleClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usertype");
    localStorage.removeItem("user_id");
    Swal.fire({
      position: "top-end",
      title: "User Logout!",
      showConfirmButton: false,
      timer: 1500,
    });
    window.location.href = "/login";
  };
  useEffect(() => {
    socket.on("gotuserloaction", (response) => {
      // console.log(response, "response");
      // alert(response.message);
      Swal.fire({
        position: "top-end",
        title: response.message,
        showConfirmButton: false,
        timer: 1500,
      });
    });
  }, []);

  const getAlert = (userId) => {
    axios
      .post(`http://localhost:3000/users/getboundryalert/${userId}`, {
        adminId,
      })
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("Error sending alert:", error);
        alert("Failed to send alert. Please try again later.");
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/getalluser")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);
  return (
    <div className="min-h-screen bg-gray-200">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-white font-bold">Admin Dashboard</div>
            <div>
              <Link
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleClick}
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4 text-center">User List</h1>
        <div className="overflow-x-auto">
          <table className="w-full mx-auto table-auto border-collapse border border-gray-300 rounded-lg">
            <thead className="bg-gray-200 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left font-bold border-r border-gray-300">
                  Name
                </th>
                <th className="px-6 py-3 text-left font-bold border-r border-gray-300">
                  Email
                </th>
              </tr>
              <th className="px-6 py-3 text-left font-bold border-r border-gray-300">
                Button
              </th>
              {/* <th className="px-6 py-3 text-left font-bold">Image</th> */}
            </thead>

            <tbody>
              {users.data?.map((user, index) => (
                <tr key={user._id} className="border-b border-gray-300">
                  <td className="px-6 py-4 border border-r border-gray-300">
                    {user.name}
                    {console.log("username", user.name)}
                  </td>
                  <td className="px-6 py-4 border border-r border-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 border border-r border-gray-300">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => getAlert(user._id)}
                    >
                      Get Alert
                    </button>
                  </td>
                  <td className="px-6 py-4 border">
                    <div className="flex justify-center">
                      {user.user_locations.length > 0 ? (
                        <MapComponent
                          latitude={user.user_locations[0].latitude}
                          longitude={user.user_locations[0].longitude}
                        />
                      ) : (
                        <p>No location available</p>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <GetLocation /> */}
    </div>
  );
};

export default AdminDashboard;
