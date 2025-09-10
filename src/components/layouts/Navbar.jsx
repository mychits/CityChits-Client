import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import GlobalSearchBar from "../search/GlobalSearchBar";
import { MdKeyboardArrowDown, MdOutlineArrowCircleLeft } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoMdMore } from "react-icons/io";
import hotkeys from "../../data/hotKeys";
import mychitsHead from "../../assets/images/mychits_head.svg";

const Navbar = ({
  onGlobalSearchChangeHandler = () => { },
  visibility = false,
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
    <nav className="w-full fixed top-0 left-0 z-50">
      {/* Main Navbar Container */}
      <div className="flex items-center justify-between bg-violet-900 shadow-xl backdrop-blur-md bg-opacity-95 px-8 py-3">

        {/* Logo Section */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-4 text-white transition-transform duration-300 hover:scale-105"
        >
          <img
            src={mychitsHead}
            alt="MyChits Logo"
            className="h-12 w-auto transition-transform duration-300"
          />
          <span className="font-extrabold text-2xl tracking-wide">
            MyChits
          </span>
        </button>

        {/* Center Section */}
        <div className="flex items-center space-x-8 flex-1 justify-center">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
            aria-label="Go Back"
          >
            <MdOutlineArrowCircleLeft size={28} />
          </button>

          {/* Search + Hotkeys */}
          <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-md rounded-full px-6 py-3 w-full max-w-5xl">
            <div className="flex-1">
              <GlobalSearchBar
                onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
                visibility={visibility}
              />
            </div>
            <button
              onClick={() => setShowHotKeys(!showHotKeys)}
              className={`ml-3 p-3 rounded-full text-white transition-transform duration-300 hover:scale-110 active:scale-95 ${showHotKeys ? "rotate-180" : ""
                }`}
              aria-label="Toggle Hotkeys"
            >
              <MdKeyboardArrowDown size={24} />
            </button>
          </div>
        </div>

        {/* Profile & More Options */}
        <div className="flex items-center space-x-4">
          <button
            className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
            aria-label="Profile"
          >
            <CgProfile size={24} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
              aria-label="More Options"
            >
              <IoMdMore size={24} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-4 w-56 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 animate-fadeIn z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-6 py-4 text-xl font-medium text-gray-800 hover:bg-gradient-to-r hover:from-violet-700 hover:to-purple-700 hover:text-white transition-colors duration-300"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hotkeys Panel */}
      {showHotKeys && (
        <div className="bg-violet-600 bg-opacity-40 backdrop-blur-md  border-4 border-violet-400 px-10 py-7 mt-3 mx-8 rounded-2xl shadow-2xl animate-slideDown"

        >
          <h3 className="text-white font-bold text-xl mb-6 text-center">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {hotkeys.map(({ key, title, path }) => (
              <NavLink
                key={key}
                to={path}
                className={({ isActive }) =>
                  `bg-custom-violet text-center py-4 px-5 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 ${isActive
                    ? "bg-custom-violet text-indigo-700 font-bold shadow-lg"
                    : "bg-violet-600  text-white hover:bg-opacity-30"
                  }`
                }
              >
                {title}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Animations */}
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
      `}</style>
    </nav>
  );
};

export default Navbar;
