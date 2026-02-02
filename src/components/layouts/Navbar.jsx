// src/components/layout/Navbar.jsx
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import GlobalSearchBar from "../search/GlobalSearchBar";
import {
  MdKeyboardArrowDown,
  MdOutlineArrowCircleLeft,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoMdMore } from "react-icons/io";
import { HiX } from "react-icons/hi";
import { BiMenu } from "react-icons/bi";
import { AiOutlineLogout } from "react-icons/ai";
import hotkeys from "../../data/hotKeys";
import CityChits from "../../assets/images/mychits.png";

const Navbar = ({
  onGlobalSearchChangeHandler = () => {},
  visibility = false,
  showMobileSidebar = false,
  setShowMobileSidebar = () => {},
}) => {
  const navigate = useNavigate();
  const [showHotKeys, setShowHotKeys] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    try {
      const usr = localStorage.getItem("user");
      if (usr) {
        const admin = JSON.parse(usr);
        setAdminName(admin?.admin_name || "Admin");
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
    }
  }, []);

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>

      <nav className="w-full fixed z-50 top-0 left-0">
        {/* Main Navbar with Professional Design */}
        <div className="relative">
          {/* Professional accent line at top */}
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800"></div>
          
          {/* Professional navbar */}
          <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
              {/* Logo Section with Professional Styling */}
              <button
                onClick={() => navigate("/")}
                className="group flex items-center space-x-3 relative overflow-hidden rounded-lg px-3 py-2 transition-all duration-300 hover:bg-gray-50"
                aria-label="MyChits Dashboard"
              >
                <img 
                  src={CityChits} 
                  alt="MyChits" 
                  className="h-8 sm:h-9 w-auto transform group-hover:scale-105 transition-transform duration-300" 
                />
                <span className="hidden sm:block font-bold text-xl text-gray-800 group-hover:text-blue-700 transition-all duration-300">
                  MyChits
                </span>
              </button>

              {/* Center: Search + Back Button */}
              <div className="flex items-center flex-1 justify-center max-w-3xl mx-4">
                <button
                  onClick={() => navigate(-1)}
                  className="group p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-300 mr-3 hidden sm:block shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                  aria-label="Go back"
                >
                  <MdOutlineArrowCircleLeft 
                    size={22} 
                    className="transform group-hover:-translate-x-1 transition-transform duration-300"
                  />
                </button>

                <div className="relative flex items-center flex-1 group">
                  {/* Search container */}
                  <div className="relative flex items-center bg-white rounded-lg px-4 py-2.5 w-full border border-gray-300 group-hover:border-blue-400 transition-all duration-300 shadow-sm group-hover:shadow-md">
                    <GlobalSearchBar
                      onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
                      visibility={visibility}
                    />
                    <button
                      onClick={() => setShowHotKeys(!showHotKeys)}
                      className={`ml-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md ${
                        showHotKeys ? "rotate-180" : ""
                      }`}
                    >
                      <MdKeyboardArrowDown size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Profile & Menu */}
              <div className="flex items-center space-x-3">
                {/* Profile Badge */}
                <div className="hidden sm:flex items-center space-x-2.5 bg-gray-100 rounded-lg px-4 py-2.5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                  <div className="p-1.5 bg-blue-600 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <CgProfile className="text-white" size={16} />
                  </div>
                  <span className="text-gray-800 text-sm font-semibold max-w-[120px] truncate">
                    {adminName}
                  </span>
                </div>

                {/* More Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className={`p-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md ${
                      showMenu 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    aria-label="User menu"
                  >
                    <IoMdMore size={20} />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-3 w-52 animate-slideDown">
                      {/* Menu content */}
                      <div className="relative bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-red-50 transition-all duration-300 text-sm font-semibold group"
                        >
                          <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors duration-300">
                            <AiOutlineLogout className="text-gray-600 group-hover:text-red-600" size={18} />
                          </div>
                          <span className="group-hover:text-red-600 transition-colors duration-300">
                            Sign Out
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                  className={`p-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm md:hidden ${
                    showMobileSidebar
                      ? "bg-red-600 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {showMobileSidebar ? <HiX size={20} /> : <BiMenu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Hotkeys Panel */}
        {showHotKeys && (
          <div className="animate-slideDown mx-4 sm:mx-6 mt-2">
            <div className="relative">
              {/* Panel content */}
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800"></div>
                
                <div className="px-6 py-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Quick Access
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {hotkeys.map(({ key, title, path }, index) => (
                      <NavLink
                        key={key}
                        to={path}
                        className={({ isActive }) =>
                          `group relative text-center py-3.5 px-4 text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                            isActive
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-blue-600 shadow-sm hover:shadow-md"
                          }`
                        }
                        onClick={() => setShowHotKeys(false)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <span className="relative z-10">{title}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
      {showHotKeys && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowHotKeys(false)}
        />
      )}
    </>
  );
};

export default Navbar;