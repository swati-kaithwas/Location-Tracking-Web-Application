import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("token");

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    }
  }, [navigate, userToken]);

  return children;
};

export default PrivateRoute;
