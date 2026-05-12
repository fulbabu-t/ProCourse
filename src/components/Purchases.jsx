
import axios from "axios";
import  { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi"; // Icons for sidebar toggle
import { Link, useNavigate } from "react-router-dom";
// import { BACKEND_URL } from "../utils/utils";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [ setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();


    console.log("purchases", purchases);

    // Check token
    useEffect(() => {
      const token = localStorage.getItem("user");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }, []);
  
    // Fetch purchases
    useEffect(() => {
      
       const user =  JSON.parse(localStorage.getItem("user"));
       const token = user.token;

        const fetchPurchases = async () => {
          try {
            setLoading(true);
           const response = await axios.get(`http://localhost:4001/api/v1/user/purchases`, {
           headers: {
            Authorization: `Bearer ${token}`,
           },
           withCredentials: true,
          });
           setPurchases(response.data.courseData);
           navigate("/purchases");
            setLoading(false);
          } catch (error) {
         setErrorMessage("Failed to fetch purchase data");
         navigate("/purchases");
        }
    };
        fetchPurchases();
    }, []);
  
    // Logout
    const handleLogout = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/api/v1/user/logout`, {
          withCredentials: true,
        });
        toast.success(response.data.message);
        localStorage.removeItem("user");
        setIsLoggedIn(false);
      } catch (error) {
        console.log("Error in logging out ", error);
        toast.error(error.response.data.errors || "Error in logging out");
      }
    };

    // Toggle sidebar
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        <nav>
          <ul className="mt-16 md:mt-0">
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-blue-500">
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li className="mb-4">
              <Link to="/settings" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="fixed z-50 p-2 text-white bg-blue-600 rounded-lg top-4 left-4 md:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <HiX className="text-2xl" />
        ) : (
          <HiMenu className="text-2xl" />
        )}
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 bg-gray-50 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        <h2 className="mt-6 mb-6 text-xl font-semibold md:mt-0">
          My Purchases
        </h2>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 text-center text-red-500">{errorMessage}</div>
        )}

        {/* Render purchases */}
        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {purchases.map((purchase, index) => (
              <div
                key={index}
                className="p-6 mb-6 bg-white rounded-lg shadow-md"
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* Course Image */}
                  <img
                    className="object-cover w-full h-48 rounded-lg"
                    src={
                      purchase.image?.url || "https://via.placeholder.com/200"
                    }
                    alt={purchase.title}
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-bold">{purchase.title}</h3>
                    <p className="text-gray-500">
                      {purchase.description.length > 100
                        ? `${purchase.description.slice(0, 100)}...`
                        : purchase.description}
                    </p>
                    <span className="text-sm font-semibold text-green-700">
                      ${purchase.price} only
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no purchases yet.</p>
        )}
      </div>
    </div>
  );
}

export default Purchases;
