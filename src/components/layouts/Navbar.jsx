import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import GlobalSearchBar from "../search/GlobalSearchBar";
import { MdKeyboardArrowDown, MdOutlineArrowCircleLeft } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoIosNotifications, IoIosLogOut } from "react-icons/io"; // Added IoIosLogOut for the new design
import { HiX } from "react-icons/hi";
import { BiMenu } from "react-icons/bi";
import { AiOutlineLogout } from "react-icons/ai";
import { FiUsers, FiSmartphone, FiCreditCard } from "react-icons/fi";
import { GiReceiveMoney } from "react-icons/gi";
import hotkeys from "../../data/hotKeys";
import CityChits from "../../assets/images/mychits.png";
import API from "../../instance/TokenInstance";

const Navbar = ({
  onGlobalSearchChangeHandler = () => {},
  visibility = false,
  showMobileSidebar = false,
  setShowMobileSidebar = () => {},
}) => {
  const navigate = useNavigate();

  // --- EXISTING STATE ---
  const [showHotKeys, setShowHotKeys] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");

  // --- NEW STATE FROM 1ST CODE ---
  const [pendingApprovals, setPendingApprovals] = useState();
  const [taskCount, setTaskCount] = useState(0);
  
  // --- AUTO LOGOUT STATE ---
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  /* ================================
     LOGOUT (Existing Logic Preserved)
  ================================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/");
  };

  /* ================================
     FETCH ADMIN NAME & ROLE
  ================================= */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usr = localStorage.getItem("admin");
        if (usr) {
          const admin = JSON.parse(usr);
          setAdminName(admin?.admin_name || "User");

          if (admin.admin_access_right_id && typeof admin.admin_access_right_id === 'object') {
            setRoleTitle(admin.admin_access_right_id.title);
          }
          else if (admin._id) {
            try {
              const response = await API.get("/admin/me");
              const fullUserData = response.data?.data || response.data;

              if (fullUserData?.admin_access_right_id?.title) {
                setRoleTitle(fullUserData.admin_access_right_id.title);
              } else {
                setRoleTitle("Admin");
              }
            } catch (apiError) {
              console.error("Failed to fetch role details:", apiError);
              setRoleTitle("Admin");
            }
          } else {
            setRoleTitle("Admin");
          }
        } else {
            setAdminName("User");
            setRoleTitle("Admin");
        }
      } catch (e) {
        console.error("Failed to parse admin from localStorage:", e);
        setAdminName("User");
        setRoleTitle("Admin");
      }
    };

    fetchUserData();
  }, []);

  /* ================================
     PENDING APPROVALS LOGIC
  ================================= */
  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        const response = await API.get("/approvals/count");
        setPendingApprovals(response?.data);
      } catch (error) {
        console.error("Error fetching pending approvals", error);
      }
    };

    fetchPendingApprovals();
  }, []);

  const getPendingCount = (categoryId) => {
    if (!pendingApprovals?.data) return 0;

    switch (categoryId) {
      case 1:
        return pendingApprovals.data.unapproved_users;
      case 2:
        return pendingApprovals.data.unapproved_enrollments;
      case 3:
        return pendingApprovals.data.unapproved_loans;
      default:
        return 0;
    }
  };

  /* ================================
     MY TASKS LOGIC
  ================================= */
  useEffect(() => {
    const fetchMyTaskCount = async () => {
      try {
        const userStr = localStorage.getItem("admin");
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const myId = user._id;

        const res = await API.get("/complaints/all");
        const complaints = res.data?.data || [];

        const myPendingTickets = complaints.filter((item) => {
          if (!item.assignedTo) return false;

          let assignedId = null;
          if (typeof item.assignedTo === "object" && item.assignedTo._id) {
            assignedId = item.assignedTo._id;
          } else if (typeof item.assignedTo === "string") {
            assignedId = item.assignedTo;
          }

          const isAssignedToMe = String(assignedId) === String(myId);
          const isPending = item.status !== "Closed";

          return isAssignedToMe && isPending;
        });

        setTaskCount(myPendingTickets.length);
      } catch (error) {
        console.error("Error fetching task count", error);
      }
    };

    fetchMyTaskCount();
  }, []);

  /* ================================
     AUTO LOGOUT LOGIC
  ================================= */
  useEffect(() => {
    const AUTO_LOGOUT_TIME = 60 * 60 * 1000; 
    const WARNING_TIME =  10 * 60 * 1000;         
    const WARNING_START_TIME = AUTO_LOGOUT_TIME - WARNING_TIME; 

    let inactivityTimer;
    let countdownInterval;

    const performLogout = () => {
      clearTimeout(inactivityTimer);
      clearInterval(countdownInterval);
      handleLogout(); 
    };

    const startCountdown = () => {
      setShowWarningModal(true);
      setCountdown(Math.floor(WARNING_TIME / 1000));

      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            performLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const resetTimers = () => {
      clearTimeout(inactivityTimer);
      clearInterval(countdownInterval);

      if (showWarningModal) {
        setShowWarningModal(false);
      }

      inactivityTimer = setTimeout(() => {
        startCountdown();
      }, WARNING_START_TIME);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((event) => window.addEventListener(event, resetTimers));
    resetTimers();

    return () => {
      clearTimeout(inactivityTimer);
      clearInterval(countdownInterval);
      events.forEach((event) => window.removeEventListener(event, resetTimers));
    };
  }, []);

  /* ================================
     CLICK OUTSIDE HANDLER
  ================================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileCard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================================
     DATA ARRAYS
  ================================= */
  const quickApprovals = [
    {
      title: "Payment Link Transactions",
      href: "/payment-link-transactions",
      color: "text-green-600",
      icon: <FiCreditCard className="text-lg" />,
    },
    {
      title: "Unverified Customers",
      href: "/approval-menu/un-approved-customer",
      color: "text-blue-600",
      count: getPendingCount(1),
      icon: <FiUsers className="text-lg" />,
    },
    {
      title: "Mobile Enrollments",
      href: "/approval-menu/mobile-app-enroll",
      color: "text-amber-600",
      count: getPendingCount(2),
      icon: <FiSmartphone className="text-lg" />,
    },
    {
      title: "Unapproved Loans",
      href: "/approval-menu/un-approved-loans",
      color: "text-red-600",
      count: getPendingCount(3),
      icon: <GiReceiveMoney className="text-lg" />,
    },
  ];

  /* ================================
     UI
  ================================= */
  return (
    <nav className="w-full fixed z-50 top-0 left-0">
      <div className="flex items-center justify-between bg-violet-900 shadow-xl px-4 sm:px-8 py-3">

        {/* LOGO */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-3 text-white hover:scale-105 transition"
        >
          <img src={CityChits} alt="Logo" className="h-10 sm:h-12" />
          <span className="hidden sm:block font-bold text-xl">
            My Chits New
          </span>
        </button>

        {/* SEARCH */}
        <div className="flex items-center flex-1 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white bg-opacity-20 text-white hidden sm:block"
          >
            <MdOutlineArrowCircleLeft size={24} />
          </button>

          <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 w-full max-w-3xl">
            <GlobalSearchBar
              onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
              visibility={visibility}
            />
            <button
              onClick={() => setShowHotKeys(!showHotKeys)}
              className="ml-2 p-2 text-white"
            >
              <MdKeyboardArrowDown size={22} />
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center space-x-3">

          {/* --- MY TASKS BUTTON --- */}
          <NavLink to={"/my-tasks"} className="relative">
            <button className="relative w-11 h-11 rounded-xl bg-white bg-opacity-20 text-white flex items-center justify-center hover:bg-opacity-30 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {taskCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-violet-900 shadow-sm">
                  {taskCount > 9 ? "9+" : taskCount}
                </span>
              )}
            </button>
          </NavLink>

          {/* --- NOTIFICATIONS --- */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-11 h-11 rounded-xl bg-white bg-opacity-20 text-white flex items-center justify-center hover:bg-opacity-30 transition"
            >
              <IoIosNotifications className="text-2xl" />
              {(getPendingCount(1) + getPendingCount(2) + getPendingCount(3)) > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 flex items-center justify-center bg-pink-600 text-white text-[10px] font-bold rounded-full border-2 border-violet-900 shadow-sm">
                  {getPendingCount(1) + getPendingCount(2) + getPendingCount(3)}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-4 w-80 bg-white rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Pending Actions</h3>
                  <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                    {getPendingCount(1) + getPendingCount(2) + getPendingCount(3)} TOTAL
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
                  {quickApprovals.map((item, index) => (
                    <NavLink
                      key={index}
                      to={item.href}
                      onClick={() => setShowNotifications(false)}
                      className="group flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-slate-50 group-hover:bg-white border border-transparent group-hover:border-slate-200 transition-all ${item.color}`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-violet-600 truncate transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {item.count > 0 ? `${item.count} items to review` : "No pending items"}
                        </p>
                      </div>
                      <div className="text-slate-300 group-hover:text-violet-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* --- UPDATED PROFILE SECTION (Sophisticated Design) --- */}
          <div className="relative" ref={profileRef}>
            {/* Trigger Button */}
            <button
              onClick={() => setShowProfileCard(!showProfileCard)}
              className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 focus:outline-none ${showProfileCard ? "ring-4 ring-violet-700/20 rotate-12 scale-110" : "hover:ring-4 hover:ring-violet-50 hover:scale-105"
                }`}
            >
              <div className={`absolute inset-0 rounded-full transition-all duration-500 ${showProfileCard ? "bg-violet-700 shadow-lg shadow-violet-200" : "bg-white border border-gray-200 shadow-sm"
                }`} />
              <CgProfile className={`relative z-10 text-2xl transition-colors duration-300 ${showProfileCard ? "text-white" : "text-violet-700"}`} />
            </button>

            {showProfileCard && (
              <div className="absolute right-0 mt-6 w-[320px] bg-white rounded-[24px] shadow-[0_20px_50px_rgba(29,78,216,0.15)] border border-violet-50 overflow-hidden z-50 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 origin-top-right">
                
                {/* Gradient Header */}
                <div className="h-24 bg-gradient-to-br from-violet-700 to-violet-500 opacity-10 absolute w-full"></div>

                <div className="relative flex flex-col items-center pt-10 pb-6 px-6">
                  <div className="relative group">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-violet-700 rounded-full blur opacity-20"></div>
                    {/* Avatar Circle */}
                    <div className="relative w-24 h-24 rounded-full bg-white p-1.5 shadow-xl">
                      <div className="w-full h-full rounded-full bg-violet-50 flex items-center justify-center overflow-hidden border border-violet-100">
                        <CgProfile className="text-5xl text-violet-700" />
                      </div>
                    </div>

                    {/* Instagram Verified Badge */}
                    <div className="absolute bottom-1 right-1 drop-shadow-md">
                      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-blue-500 animate-in zoom-in duration-500 delay-200">
                        <path d="M22.5 12.5c0-1.58-.8-2.47-1.3-3.07a3 3 0 0 1-.82-2.31c0-1.61-.43-2.5-1.09-3.11s-1.5-.92-3.11-.92a3 3 0 0 1-2.31-.82c-.6-.5-1.49-1.3-3.07-1.3s-2.47.8-3.07 1.3a3 3 0 0 1-2.31.82c-1.61 0-2.5.43-3.11 1.09S1.4 5.78 1.4 7.39a3 3 0 0 1-.82 2.31c-.5.6-1.3 1.49-1.3 3.07s.8 2.47 1.3 3.07a3 3 0 0 1 .82 2.31c0 1.61.43 2.5 1.09 3.11s1.5.92 3.11.92a3 3 0 0 1 2.31.82c.6.5 1.49 1.3 3.07 1.3s2.47-.8 3.07-1.3a3 3 0 0 1 2.31-.82c1.61 0 2.5-.43 3.11-1.09s.92-1.5.92-3.11a3 3 0 0 1 .82-2.31c.5-.6 1.3-1.49 1.3-3.07z" />
                        <path fill="white" d="M10.7 16l-3.3-3.3 1.4-1.4 1.9 1.9 5.3-5.3 1.4 1.4z" />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-5 text-center">
                    <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-1">
                      {adminName}
                    </h3>
                    <p className="text-sm font-bold text-violet-700/70 mt-1 uppercase tracking-widest">{roleTitle}</p>
                  </div>
                </div>

                <div className="px-8 py-4 space-y-1">
                  <div className="group flex items-center justify-between py-4 border-b border-violet-50 hover:bg-violet-50/30 transition-colors rounded-xl px-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Online
                    </span>
                  </div>
                </div>

                <div className="p-6 pt-2">
                  <button onClick={handleLogout} className="group w-full flex items-center justify-center gap-3 py-4 bg-violet-700 hover:bg-violet-800 text-white rounded-2xl transition-all duration-300 shadow-xl shadow-violet-100 active:scale-95">
                    <IoIosLogOut className="text-xl transition-transform duration-300 group-hover:-translate-x-1" />
                    <span className="text-sm font-black uppercase tracking-widest">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MOBILE MENU */}
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="p-2 rounded-full bg-white bg-opacity-20 text-white md:hidden"
          >
            {showMobileSidebar ? <HiX size={24} /> : <BiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* HOTKEYS */}
      {showHotKeys && (
        <div className="bg-violet-800 px-5 py-5 mt-3 mx-4 sm:mx-8 rounded-xl shadow-xl">
          <h3 className="text-white font-bold mb-4 text-center">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {hotkeys.map(({ key, title, path }) => (
              <NavLink
                key={key}
                to={path}
                className="text-center py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-600 transition-colors"
              >
                {title}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* --- AUTO LOGOUT WARNING POPUP --- */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all animate-in zoom-in-95 duration-200 border border-violet-50 text-center">
            
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-bounce">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Session Expiring</h2>
            <p className="text-slate-500 mb-6">
              You have been inactive for a while. You will be logged out in 
              <span className="font-bold text-amber-600 mx-1 text-xl">{countdown}</span> seconds.
            </p>

            <div className="flex gap-4 w-full">
              <button 
                onClick={handleLogout}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                Logout Now
              </button>
              <button 
                onClick={() => {
                   setShowWarningModal(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-violet-700 text-white font-bold shadow-lg shadow-violet-200 hover:bg-violet-800 transition-all hover:scale-105 active:scale-95"
              >
                Continue Session
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;