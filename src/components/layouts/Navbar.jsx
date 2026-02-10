import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import GlobalSearchBar from "../search/GlobalSearchBar";
import { MdKeyboardArrowDown, MdGridView, MdSearch } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoIosNotifications } from "react-icons/io";
import { HiX } from "react-icons/hi";
import { BiMenu, BiChevronRight } from "react-icons/bi";
import { AiOutlineLogout } from "react-icons/ai";
import hotkeys from "../../data/hotKeys";
import sidebarMenu from "../../data/sidebarMenu";
import CityChits from "../../assets/images/chitXpert.png";

const Navbar = ({
  onGlobalSearchChangeHandler = () => {},
  visibility = false,
  showMobileSidebar = false,
  setShowMobileSidebar = () => {},
}) => {
  const navigate = useNavigate();
  
  // --- UI States ---
  const [showHotKeys, setShowHotKeys] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState(sidebarMenu[0]?.id || null);
  const [adminName, setAdminName] = useState("Super Admin");

  // --- Refs for Click-Outside Logic ---
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const megaMenuRef = useRef(null);

  // --- Mock Data for Alerts ---
  const quickApprovals = [
    { title: "Payment Links", href: "/payment-link-transactions", count: 12, color: "emerald" },
    { title: "Unverified Customers", href: "/approval-menu/un-approved-customer", count: 8, color: "blue" },
    { title: "Mobile Enrollments", href: "/approval-menu/mobile-app-enroll", count: 5, color: "amber" },
    { title: "Unapproved Loans", href: "/approval-menu/un-approved-loans", count: 3, color: "rose" },
  ];

  // --- Authentication Sync ---
  useEffect(() => {
    try {
      const usr = localStorage.getItem("user");
      if (usr) {
        const admin = JSON.parse(usr);
        setAdminName(admin?.admin_name || "Super Admin");
      }
    } catch (e) {
      console.error("Failed to parse user session:", e);
    }
  }, []);

  // --- Global Click Listener ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileCard(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        if (!event.target.closest('.mega-trigger')) setShowMegaMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* FIXED TOP NAVBAR: Removed outer padding, moved styles to nav element */}
      <nav className="fixed top-0 left-0 w-full z-[60] h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        
        {/* Main Container: Full width, vertically centered, internal padding only */}
        <div className="w-full max-w-[1920px] mx-auto h-full flex items-center justify-between px-6">
          
          {/* SECTION: BRANDING */}
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/")} className="flex items-center gap-4 group">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/15 transition-all duration-700 animate-pulse"></div>
                <img src={CityChits} alt="CXP" className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
              </div>

              <div className="flex flex-col items-start border-l border-slate-100 pl-4">
                <div className="flex items-baseline">
                  <span className="font-bold text-xl tracking-tighter text-slate-800">chit</span>
                  <span className="font-bold text-xl tracking-tighter text-indigo-600">Xpert</span>
                </div>
                
              </div>
            </button>

            <div className="h-8 w-[1px] bg-slate-200 hidden lg:block mx-2"></div>

            {/* Mega Menu Trigger */}
            <button
              onClick={() => setShowMegaMenu(!showMegaMenu)}
              className="mega-trigger hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 bg-slate-50 text-slate-600 border border-slate-100 hover:border-indigo-200 hover:bg-white hover:text-indigo-600"
            >
              <MdGridView className="text-lg" />
              <span>Modules</span>
              <MdKeyboardArrowDown className={`transition-transform duration-300 ${showMegaMenu ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* SECTION: SEARCH & QUICK LINKS */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <div className="w-full flex items-center bg-slate-100/50 rounded-xl border border-slate-100 focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-indigo-500/5 transition-all px-4">
              <MdSearch className="text-slate-400 text-xl" />
              <GlobalSearchBar onGlobalSearchChangeHandler={onGlobalSearchChangeHandler} visibility={visibility} />
              <button 
                onClick={() => setShowHotKeys(!showHotKeys)}
                className={`ml-2 p-1 rounded-lg transition-all ${
                  showHotKeys ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-200"
                }`}
              >
                <MdKeyboardArrowDown size={20} />
              </button>
            </div>

            {/* Hotkeys Dropdown */}
            {showHotKeys && (
              <div className="absolute top-full mt-4 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 animate-slide-down z-[70]">
                <div className="flex items-center justify-between px-3 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jump To</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {hotkeys.map((hk) => (
                    <NavLink key={hk.key} to={hk.path} onClick={() => setShowHotKeys(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 group transition-colors">
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600">{hk.title}</span>
                      <BiChevronRight className="text-slate-300 group-hover:text-indigo-400" />
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION: USER PROFILE & NOTIFICATIONS */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-100"}`}
              >
                <IoIosNotifications size={24} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[70] animate-slide-down">
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h4 className="font-bold text-slate-800 text-sm">System Alerts</h4>
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full uppercase">Pending Actions</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {quickApprovals.map((item, i) => (
                      <NavLink key={i} to={item.href} onClick={() => setShowNotifications(false)} className="flex items-center p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 group transition-colors">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs bg-${item.color}-50 text-${item.color}-600 border border-${item.color}-100`}>
                          {item.count}
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">{item.title}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Requires Approval</p>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

            <div className="relative" ref={profileRef}>
              <button onClick={() => setShowProfileCard(!showProfileCard)} className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-all shadow-sm group">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase">
                  {adminName.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Admin Profile</p>
                  <p className="text-xs font-bold text-slate-700 leading-tight">{adminName.split(' ')[0]}</p>
                </div>
                <MdKeyboardArrowDown className={`text-slate-400 transition-transform ${showProfileCard ? 'rotate-180' : ''}`} />
              </button>

              {showProfileCard && (
                <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[70] animate-slide-down">
                  <div className="p-4 bg-slate-50 rounded-xl mb-1 text-center">
                    <p className="font-bold text-slate-800 text-sm">{adminName}</p>
                    <p className="text-[10px] text-indigo-600 uppercase font-bold tracking-widest">Administrator</p>
                  </div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-rose-600 font-bold text-xs hover:bg-rose-50 rounded-xl transition-all">
                    <AiOutlineLogout size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="lg:hidden p-2.5 rounded-xl bg-indigo-600 text-white">
              <BiMenu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION: MODULES COMMAND CENTER (MEGA MENU) */}
      {showMegaMenu && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center pt-24 px-4" ref={megaMenuRef}>
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm" onClick={() => setShowMegaMenu(false)}></div>
          <div className="relative w-full max-w-6xl bg-white border border-slate-200 rounded-[32px] shadow-2xl overflow-hidden flex h-[70vh] animate-slide-down">
            {/* Sidebar inside Mega Menu */}
            <div className="w-1/4 bg-slate-50 border-r border-slate-200 p-6 overflow-y-auto">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Navigation Hub</h4>
              <div className="space-y-1">
                {sidebarMenu.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeCategory === category.id;
                  return (
                    <button 
                      key={category.id} 
                      onMouseEnter={() => setActiveCategory(category.id)} 
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? "bg-white border border-slate-200 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      <Icon className={isActive ? "text-indigo-600" : "text-slate-400"} />
                      <span className="font-bold text-xs tracking-tight">{category.title}</span>
                      {isActive && <BiChevronRight className="ml-auto text-lg" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area inside Mega Menu */}
            <div className="flex-1 p-8 overflow-y-auto bg-white">
              {sidebarMenu.filter(cat => cat.id === activeCategory).map(category => (
                <div key={category.id} className="animate-in fade-in duration-300">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{category.title}</h2>
                    <p className="text-slate-400 text-xs mt-1 font-medium italic">Operational Tools & Management</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {category.submenuItems?.map(item => (
                      <button 
                        key={item.id} 
                        onClick={() => { navigate(item.link); setShowMegaMenu(false); }} 
                        className="group flex flex-col gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow transition-all">
                          {item.icon ? <item.icon className="text-slate-500 group-hover:text-indigo-600" /> : <div className="w-2 h-2 rounded-full bg-indigo-400" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-indigo-700 text-xs leading-none">{item.title}</p>
                          <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase group-hover:text-indigo-400">Launch Module</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* UTILITY STYLES */}
      <style jsx>{`
        @keyframes slideDown { 
          from { opacity: 0; transform: translateY(-8px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-slide-down { 
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
      `}</style>
    </>
  );
};

export default Navbar;