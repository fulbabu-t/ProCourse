import  { useState } from "react";
import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
// import { BACKEND_URL } from "../utils/utils";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ password });
    try {
      const response = await axios.post(
        `http://localhost:4001/api/v1/admin/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("AdminLogin successful: ", response.data);
      toast.success(response.data.message);
      navigate("/admin/dashboard");
      localStorage.setItem("admin", JSON.stringify(response.data));
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "AdminLogin failed!!!");
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 ">
      <div className="container flex items-center justify-center h-screen mx-auto text-white">
        {/* Header */}
        <header className="absolute top-0 left-0 flex items-center justify-between w-full p-5 ">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <Link to={"/"} className="text-xl font-bold text-orange-500">
              CourseHaven
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to={"/admin/signup"}
              className="px-4 py-2 bg-transparent border border-gray-500 rounded-md"
            >
              Signup
            </Link>
            <Link
              to={"/courses"}
              className="px-4 py-2 bg-orange-500 rounded-md"
            >
              Join now
            </Link>
          </div>
        </header>

        {/* AdminLogin Form */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[500px] mt-20">
          <h2 className="mb-4 text-2xl font-bold text-center">
            Welcome to <span className="text-orange-500">CourseHaven</span>
          </h2>
          <p className="mb-6 text-center text-gray-400">
            Log in to access admin dashboard!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="mb-2 text-gray-400 ">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@email.com"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="mb-2 text-gray-400 ">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  required
                />
                <span className="absolute text-gray-500 cursor-pointer right-3 top-3">
                  👁️
                </span>
              </div>
            </div>
            {errorMessage && (
              <div className="mb-4 text-center text-red-500">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 text-white transition bg-orange-500 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
