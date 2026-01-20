import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import GlobalSearchBar from "../search/GlobalSearchBar";
import { MdKeyboardArrowDown, MdOutlineArrowCircleLeft } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoMdMore, IoIosNotifications } from "react-icons/io";
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Quick approvals data
  const quickApprovals = [
    {
      title: "Payment Link Transactions",
      href: "/payment-link-transactions",
      color: "text-green-400",
    },
    {
      title: "Unverified Customers",
      href: "/approval-menu/un-approved-customer",
      color: "text-blue-400",
    },
    {
      title: "Mobile Enrollments",
      href: "/approval-menu/mobile-app-enroll",
      color: "text-amber-400",
    },
    {
      title: "Unapproved Loans",
      href: "/approval-menu/un-approved-loans",
      color: "text-red-400",
    },
  ];

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

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileCard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef, profileRef]);

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
        
        .animate-slide-down {
          animation: slideDown 0.2s ease-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e1b4b;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6d28d9;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7c3aed;
        }
      `}</style>
      
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
            {/* Notification Icon with Quick Approvals */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                  showNotifications
                    ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg"
                    : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                }`}
              >
                <IoIosNotifications className="text-2xl" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{quickApprovals.length}</span>
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-96 bg-violet-800 rounded-2xl shadow-2xl border border-violet-600 overflow-hidden animate-slide-down">
                  {/* Header with gradient */}
                  <div className="px-6 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">Pending Approvals</h3>
                        <p className="text-purple-100 text-xs mt-0.5">
                          Action required on these items
                        </p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <span className="text-sm font-bold">{quickApprovals.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {quickApprovals.map((item, index) => (
                      <NavLink
                        key={index}
                        to={item.href}
                        onClick={() => setShowNotifications(false)}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-violet-700 transition-all duration-200 border-b border-violet-700 last:border-0 group"
                      >
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold text-sm ${item.color} group-hover:text-white transition-colors`}
                          >
                            {item.title}
                          </p>
                          <p className="text-xs text-purple-200 mt-0.5">
                            Requires immediate attention
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                              item.color === "text-blue-400"
                                ? "bg-blue-900 text-blue-300"
                                : item.color === "text-amber-400"
                                ? "bg-amber-900 text-amber-300"
                                : item.color === "text-green-400"
                                ? "bg-green-900 text-green-300"
                                : "bg-red-900 text-red-300"
                            }`}
                          >
                            Pending
                          </span>
                          <svg
                            className="w-5 h-5 text-purple-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Profile Section */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileCard(!showProfileCard)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  showProfileCard
                    ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg"
                    : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                }`}
              >
                <CgProfile className="text-xl" />
                <p className="font-semibold text-sm hidden sm:block">{adminName}</p>
              </button>

              {showProfileCard && (
                <div className="absolute right-0 mt-4 w-80 bg-violet-800 rounded-2xl shadow-2xl border border-violet-600 overflow-hidden animate-slide-down">
                  {/* Header with gradient and avatar */}
                  <div className="relative h-28 bg-gradient-to-br from-purple-700 to-pink-700">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                      <div className="w-24 h-24 rounded-2xl bg-violet-900 shadow-xl flex items-center justify-center ring-4 ring-violet-700">
                        <CgProfile className="text-5xl text-purple-400" />
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="pt-16 px-6 pb-6">
                    <div className="text-center mb-6">
                      <h3 className="font-bold text-xl text-white">
                        {adminName}
                      </h3>

                      <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-green-900 bg-opacity-50 rounded-full">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-xs font-semibold text-green-400">
                          Active Now
                        </span>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-gradient-to-br from-purple-700 to-purple-800 rounded-xl p-4 text-center">
                        <p className="text-xs text-purple-300 font-medium mb-1">
                          Last Login
                        </p>
                        <p className="text-sm font-bold text-white">
                          {new Date().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-pink-700 to-pink-800 rounded-xl p-4 text-center">
                        <p className="text-xs text-pink-300 font-medium mb-1">
                          Session
                        </p>
                        <p className="text-sm font-bold text-white">
                          Active
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <AiOutlineLogout className="text-lg" />
                        <span className="text-sm font-semibold">Logout</span>
                      </button>
                    </div>
                  </div>
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
          <div className="bg-violet-800 bg-opacity-90 backdrop-blur-md border-4 border-violet-600 px-5 py-5 mt-3 mx-4 sm:mx-8 rounded-2xl shadow-2xl animate-slideDown">
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
                        ? "bg-purple-600 text-white"
                        : "bg-violet-700 text-white hover:bg-violet-600"
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
    </>
  );
};

export default Navbar;