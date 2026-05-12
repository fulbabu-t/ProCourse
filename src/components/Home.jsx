import  { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";
import { TbBrandLinkedinFilled } from "react-icons/tb";

import { FaTwitter } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";
// import { BACKEND_URL } from "../utils/utils";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // token
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/api/v1/course/courses`, {
          withCredentials: true,
        });
        console.log(response.data.courses);
        setCourses(response.data.courses);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  // logout
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




 var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  return (

  <div className="bg-gradient-to-r from-black to-pink-900">
    <div className="h-[1250px] md:h-[1050px] text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6 ">
          <div className="flex items-center space-x-2">
            <img
              src={logo}
              alt=""
              className="rounded-full w-7 h-7 md:w-10 md:h-10"
            />
            <h1 className="font-bold text-orange-500 md:text-2xl">
              ProCourse
            </h1>
          </div>
          <div className="space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="p-2 text-xs text-white bg-transparent border border-white rounded md:text-lg md:py-2 md:px-4"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="p-2 text-xs text-white bg-transparent border border-white rounded md:text-lg md:py-2 md:px-4"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="p-2 text-xs text-white bg-transparent border border-white rounded md:text-lg md:py-2 md:px-4"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Main section */}
        <section className="py-20 text-center">
          <h1 className="text-4xl font-semibold text-orange-500">
            ProCourse
          </h1>

          <br />
          <p className="text-gray-500">
            Sharpen your skills with courses crafted by experts.
          </p>
          <div className="mt-8 space-x-4">
            <Link
              to={"/courses"}
              className="p-2 font-semibold text-white duration-300 bg-green-500 rounded md:py-3 md:px-6 hover:bg-white hover:text-black"
            >
              Explore courses
            </Link>
            <Link
              to={"https://www.youtube.com/@Scien-p5e"}
              className="p-2 font-semibold text-black duration-300 bg-white rounded md:py-3 md:px-6 hover:bg-green-500 hover:text-white"
            >
              Courses videos
            </Link>
          </div>
        </section>
        <section className="p-10">
          <Slider className="" {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-4">
                <div className="relative flex-shrink-0 transition-transform duration-300 transform w-92 hover:scale-105">
                  <div className="overflow-hidden bg-gray-900 rounded-lg">
                    <img
                      className="object-contain w-full h-32"
                      src={course.image.url}
                      alt=""
                    />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-white">
                        {course.title}
                      </h2>
                      <Link to={`/buy/${course._id}`} className="px-4 py-2 mt-8 text-white duration-300 bg-orange-500 rounded-full hover:bg-blue-500">
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr />
        {/* Footer */}
        <footer className="my-12">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="" className="w-10 h-10 rounded-full" />
                <h1 className="text-2xl font-bold text-orange-500">
                  ProCourse
                </h1>
              </div>
              <div className="mt-3 ml-2 md:ml-8">
                <p className="mb-2">Follow us</p>
                <div className="flex space-x-4">
                  <a href="https://github.com/fulbabu-t">
                    <FaGithub className="text-2xl duration-300 hover:text-blue-400" />
                  </a>
                  <a href="https://www.linkedin.com/in/fulbabu-islam-96a9ba2ba">
                    <TbBrandLinkedinFilled className="text-2xl duration-300 hover:text-pink-600" />
                  </a>
                  <a href="https://twitter.com/fulbabu_islam">
                    <FaTwitter className="text-2xl duration-300 hover:text-blue-600" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center mt-6 md:mt-0">
              <h3 className="text-lg font-semibold md:mb-4">connects</h3>
              <ul className="space-y-2 text-gray-400 ">
                <li className="duration-300 cursor-pointer hover:text-white">
                  youtube- learn coding
                </li>
                <li className="duration-300 cursor-pointer hover:text-white">
                  telegram- learn coding
                </li>
                <li className="duration-300 cursor-pointer hover:text-white">
                  Github- learn coding
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center mt-6 md:mt-0">
              <h3 className="mb-4 text-lg font-semibold">
                copyrights &#169; 2026
              </h3>
              <ul className="space-y-2 text-center text-gray-400 ">
                <li className="duration-300 cursor-pointer hover:text-white">
                  Terms & Conditions
                </li>
                <li className="duration-300 cursor-pointer hover:text-white">
                  Privacy Policy
                </li>
                <li className="duration-300 cursor-pointer hover:text-white">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
