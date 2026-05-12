
import { Link } from "react-router-dom";
import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import axios from "axios";
// import { BACKEND_URL } from "../utils/utils";
function Dashboard() {
  const handleLogout = async () => {
    try {
      const response = await axios.get(`http://localhost:4001/api/v1/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 p-5 bg-gray-100">
        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="Profile" className="w-20 h-20 rounded-full" />
          <h2 className="mt-4 text-lg font-semibold"> Im Admin</h2>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin/our-courses">
            <button className="w-full py-2 text-white bg-green-700 rounded hover:bg-green-600">
              Our Courses
            </button>
          </Link>
          <Link to="/admin/create-course">
            <button className="w-full py-2 text-white bg-orange-500 rounded hover:bg-blue-600">
              Create Course
            </button>
          </Link>

          <Link to="/">
            <button className="w-full py-2 text-white bg-red-500 rounded hover:bg-red-600">
              Home
            </button>
          </Link>
          <Link to="/admin/login">
            <button
              onClick={handleLogout}
              className="w-full py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
            >
              Logout
            </button>
          </Link>
        </nav>
      </div>
      <div className="flex h-screen items-center justify-center ml-[40%]">
        Welcome!!!
      </div>
    </div>
  );
}

export default Dashboard;
