import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import GetLocation from "./GetLocation";
import Swal from "sweetalert2";


const Dashboard = () => {
  const handleClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usertype");
    localStorage.removeItem("user_id");

    Swal.fire({
      position: "top-end",
      title: "User Logout!!",
      showConfirmButton: false,
      timer: 1500,
    });
    window.location.href = "/login";
  };

  

  return (
    <div className="min-h-screen bg-gray-200">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-white font-bold">Dashboard</div>
            <div>
              <button
                onClick={handleClick}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
        <GetLocation />
      </div>
    </div>
  );
};

export default Dashboard;
