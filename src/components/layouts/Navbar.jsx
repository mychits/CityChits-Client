import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import GlobalSearchBar from "../search/GlobalSearchBar";
import { MdKeyboardArrowDown, MdOutlineArrowCircleLeft } from "react-icons/md";
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
  const [adminName, setAdminName] = useState("Super Admin");

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
        setAdminName(admin?.admin_name || "Super Admin");
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
    }
  }, []);

  return (
    <nav className="w-full fixed z-50 top-0 left-0">
      <div className="flex items-center justify-between bg-violet-900 shadow-xl backdrop-blur-md bg-opacity-95 px-4 sm:px-8 py-3 flex-wrap md:flex-nowrap">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 sm:space-x-4 text-white transition-transform duration-300 hover:scale-105"
        >
          <img src={CityChits} alt="Logo" className="h-10 sm:h-12 w-auto" />
          <span className="hidden sm:block font-extrabold text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            My Chits New
          </span>
        </button>

        {/* Center Search */}
        <div className="flex items-center flex-1 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white hidden sm:block"
            aria-label="Go Back"
          >
            <MdOutlineArrowCircleLeft size={24} />
          </button>

          <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-md rounded-full px-4 py-2 w-full max-w-3xl">
            <GlobalSearchBar
              onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
              visibility={visibility}
            />
            <button
              onClick={() => setShowHotKeys(!showHotKeys)}
              className={`ml-2 p-2 rounded-full text-white transition-transform duration-300 hover:scale-110 ${
                showHotKeys ? "rotate-180" : ""
              }`}
              aria-label="Toggle Hotkeys"
            >
              <MdKeyboardArrowDown size={22} />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Profile name + icon */}
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
            <CgProfile className="text-white text-xl" />
            <p className="text-white font-semibold text-sm">{adminName}</p>
          </div>

          {/* Menu button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all"
            >
              <IoMdMore size={22} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 w-32 rounded-xl bg-white shadow-2xl overflow-hidden animate-fadeIn">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-violet-100"
                >
                  <AiOutlineLogout className="mr-2 text-lg text-violet-600" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 md:hidden"
          >
            {showMobileSidebar ? <HiX size={24} /> : <BiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Hotkeys Dropdown */}
      {showHotKeys && (
        <div className="bg-violet-600 bg-opacity-40 backdrop-blur-md border-4 border-violet-400 px-5 py-5 mt-3 mx-4 sm:mx-8 rounded-2xl shadow-2xl animate-slideDown">
          <h3 className="text-white font-bold text-lg mb-4 text-center">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {hotkeys.map(({ key, title, path }) => (
              <NavLink
                key={key}
                to={path}
                className={({ isActive }) =>
                  `text-center py-3 rounded-lg font-semibold shadow-md transition-all ${
                    isActive
                      ? "bg-white text-indigo-700"
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
    </nav>
  );
};

export default Navbar;
