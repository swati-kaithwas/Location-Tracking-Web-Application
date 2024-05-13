import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/users/signin",
          values
        );
        console.log("Login response:", response.data);
        if (response.data.message === "Login successful") {
          Swal.fire({
            position: "top-end",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("usertype", response.data.user.usertype);
          localStorage.setItem("user_id", response.data.user.id);
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Login error:", error.response.data);
        Swal.fire({
          position: "top-end",
          title: error.response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200">
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login Your Account
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : ""
              }`}
              id="email"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.email}
              </div>
            ) : null}
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : ""
              }`}
              id="password"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full rounded-lg"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <span className="text-gray-600">Don't have an account?</span>{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-800 font-bold"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
