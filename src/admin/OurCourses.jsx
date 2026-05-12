import axios from "axios";
import  { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
// import { BACKEND_URL } from "../utils/utils";

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin.token;

  if (!token) {
    toast.error("Please login to admin");
    navigate("/admin/login");
  }

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/api/v1/course/courses`, {
          withCredentials: true,
        });
        console.log(response.data.courses);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  // delete courses code
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4001/api/v1/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses = courses.filter((course) => course._id !== id);
      setCourses(updatedCourses);
    } catch (error) {
      console.log("Error in deleting course ", error);
      toast.error(error.response.data.errors || "Error in deleting course");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-8 space-y-4 bg-gray-100">
      <h1 className="mb-8 text-3xl font-bold text-center">Our Courses</h1>
      <Link
        className="px-4 py-2 text-white duration-300 bg-orange-400 rounded-lg hover:bg-orange-950"
        to={"/admin/dashboard"}
      >
        Go to dashboard
      </Link>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course._id} className="p-4 bg-white rounded-lg shadow-md">
            {/* Course Image */}
            <img
              src={course?.image?.url}
              alt={course.title}
              className="object-cover w-full h-40 rounded-t-lg"
            />
            {/* Course Title */}
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              {course.title}
            </h2>
            {/* Course Description */}
            <p className="mt-2 text-sm text-gray-600">
              {course.description.length > 200
                ? `${course.description.slice(0, 200)}...`
                : course.description}
            </p>
            {/* Course Price */}
            <div className="flex justify-between mt-4 font-bold text-gray-800">
              <div>
                {" "}
                ₹{course.price}{" "}
                <span className="text-gray-500 line-through">₹300</span>
              </div>
              <div className="mt-2 text-sm text-green-600">10 % off</div>
            </div>

            <div className="flex justify-between">
              <Link
                to={`/admin/update-course/${course._id}`}
                className="px-4 py-2 mt-4 text-white bg-orange-500 rounded hover:bg-blue-600"
              >
                Update
              </Link>
              <button
                onClick={() => handleDelete(course._id)}
                className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OurCourses;
