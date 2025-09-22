import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import GlobalSearchBar from "../search/GlobalSearchBar";
import { MdKeyboardArrowDown, MdOutlineArrowCircleLeft } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoMdMore } from "react-icons/io";
import {  HiX } from "react-icons/hi"; 
import { BiMenu } from "react-icons/bi";
import hotkeys from "../../data/hotKeys";
import mychitsHead from "../../assets/images/mychits_head.svg";
import { AiOutlineLogout } from "react-icons/ai";

const Navbar = ({
  onGlobalSearchChangeHandler = () => {},
  visibility = false,
  showMobileSidebar = false,
  setShowMobileSidebar = () => {},
}) => {
  const navigate = useNavigate();
  const [showHotKeys, setShowHotKeys] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="w-full fixed top-0 left-0 ">
      
      <div className="flex items-center justify-between bg-violet-900 shadow-xl backdrop-blur-md bg-opacity-95 px-4 sm:px-8 py-3 flex-wrap md:flex-nowrap">

      
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 sm:space-x-4 text-white transition-transform duration-300 hover:scale-105"
        >
          <img
            src={mychitsHead}
            alt="MyChits Logo"
            className="h-10 sm:h-12 w-auto transition-transform duration-300"
          />
          <span className="font-extrabold text-xl sm:text-2xl tracking-wide hidden sm:block">
            MyChits
          </span>
        </button>

        <div className="flex items-center space-x-4 flex-1 justify-center my-3 md:my-0">
        
          <button
            onClick={() => navigate(-1)}
            className="p-2 md:p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hidden sm:block"
            aria-label="Go Back"
          >
            <MdOutlineArrowCircleLeft size={24} className="md:w-7 md:h-7" />
          </button>

        
          <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-md rounded-full px-3 sm:px-6 py-2 w-full max-w-lg md:max-w-5xl">
            <div className="flex-1">
              <GlobalSearchBar
                onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
                visibility={visibility}
              />
            </div>
            <button
              onClick={() => setShowHotKeys(!showHotKeys)}
              className={`ml-2 sm:ml-3 p-2 sm:p-3 rounded-full text-white transition-transform duration-300 hover:scale-110 active:scale-95 ${showHotKeys ? "rotate-180" : ""}`}
              aria-label="Toggle Hotkeys"
            >
              <MdKeyboardArrowDown size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>


        <div className="flex items-center space-x-2 sm:space-x-4 mt-3 md:mt-0">
          <button
            className="p-2 sm:p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
            aria-label="Profile"
          >
            <CgProfile size={20} className="sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="p-2 sm:p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-md md:hidden"
            aria-label={showMobileSidebar ? "Close Sidebar" : "Open Sidebar"}
          >
            {showMobileSidebar ? (
              <HiX size={24} className="hamburger-animate open" />
            ) : (
              <BiMenu size={24} className="hamburger-animate" />
            )}
          </button>

       
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 sm:p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
              aria-label="More Options"
            >
              <IoMdMore size={20} className="sm:w-6 sm:h-6" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-4 w-20 rounded-xl shadow-2xl overflow-hidden border  animate-fadeIn ">
               
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2   text-gray-800 hover:bg-gradient-to-r hover:from-violet-100 hover:to-purple-400  transition-colors duration-300"
                >  <AiOutlineLogout className="mx-auto text-3xl text-custom-violet"/> 
                  
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      {showHotKeys && (
        <div className="bg-violet-600 bg-opacity-40 backdrop-blur-md border-4 border-violet-400 px-5 sm:px-10 py-5 mt-3 mx-4 sm:mx-8 rounded-2xl shadow-2xl animate-slideDown">
          <h3 className="text-white font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-center">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {hotkeys.map(({ key, title, path }) => (
              <NavLink
                key={key}
                to={path}
                className={({ isActive }) =>
                  `bg-custom-violet text-center py-3 px-4 sm:py-4 sm:px-5 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 ${isActive
                    ? "bg-custom-violet text-indigo-700 font-bold shadow-lg"
                    : "bg-violet-600 text-white hover:bg-opacity-30"
                  }`
                }
              >
                {title}
              </NavLink>
            ))}
          </div>
        </div>
      )}

     
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
        .animate-slideDown { animation: slideDown 0.35s ease-out; }

        .hamburger-animate {
          transition: transform 0.25s ease-in-out;
        }
        .hamburger-animate.open {
          transform: rotate(90deg);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;