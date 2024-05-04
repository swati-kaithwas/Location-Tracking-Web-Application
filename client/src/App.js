import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import GetLocation from "./components/GetLocation";
import PrivateRoute from "./PrivateRoute";
// import {io} from "socket.io-client";
//  const socket = io("http://localhost:3000");


function App() {
  const usertype = localStorage.getItem("usertype");
  return (
    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/register" element={<Register />} />

      <Route
        exact
        path="/"
        element={
          <PrivateRoute>
            {usertype === "admin" ? (
              <Navigate to={"/admin"} />
            ) : usertype === "user" ? (
              <Navigate to={"/dashboard"} />
            ) : (
              <Navigate to={"/login"} />
            )}
          </PrivateRoute>
        }
      />
      <Route exact path="/dashboard" element={<Dashboard />} />
      <Route exact path="/admin" element={<AdminDashboard />} />
      {/* <Route exact path="/location" element={<GetLocation />} /> */}
    </Routes>
  );
}

export default App;
