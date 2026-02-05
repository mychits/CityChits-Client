import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineMenu, HiX, HiSearch } from "react-icons/hi";
import { IoIosNotifications, IoIosHelpCircle } from "react-icons/io";
import { AiOutlineUser, AiOutlineSetting } from "react-icons/ai";
import { CgProfile, CgWebsite } from "react-icons/cg";
import { FaChevronDown, FaExternalLinkAlt } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import sidebarMenu from "../../data/sidebarMenu"; // Importing your EXACT data
import CityChits from "../../assets/images/mychits.png";

const Navbar = ({ onGlobalSearchChangeHandler = () => {} }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); // 'operations', 'finance', 'system'
  const [showHotkeys, setShowHotkeys] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  const profileRef = useRef(null);

  // --- CATEGORIZATION LOGIC ---
  // We dynamically sort your sidebarMenu into these buckets for the Top Nav
  const menuCategories = {
    overview: sidebarMenu.filter(m => ["Dashboard", "AI Search"].includes(m.title)),
    operations: sidebarMenu.filter(m => 
      ["Groups", "Customers", "Enrollments", "Legals", "Staff", "Tasks", "Target Management", "Penalty Monitor", "Leads"].includes(m.title)
    ),
    finance: sidebarMenu.filter(m => 
      ["Other Services", "Approvals", "Auctions", "Accounts", "Reports", "Marketing"].includes(m.title)
    ),
    system: sidebarMenu.filter(m => 
      ["General Settings", "Other Sites", "Setting", "Help & Support"].includes(m.title)
    )
  };

  // --- EFFECTS ---
  useEffect(() => {
    try {
      const usr = localStorage.getItem("user");
      if (usr) setAdminName(JSON.parse(usr)?.admin_name || "Admin");
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
      if (!event.target.closest('.nav-group') && !eventTargetMatchesCommand) setActiveMegaMenu(null);
    };
    let eventTargetMatchesCommand = false;
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
  }, [navigate]);

  // --- HANDLERS ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="fixed top-0 left-0 w-full h-[80px] bg-white/90 backdrop-blur-xl border-b border-slate-200/60 z-50 transition-all duration-300 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* 1. LOGO & BRANDING */}
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group">
              <img src={CityChits} alt="Logo" className="h-10 w-auto transition-transform group-hover:scale-105" />
              <div className="hidden md:block">
                <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">My Chits</h1>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Enterprise Suite</span>
              </div>
            </button>
          </div>

          {/* 2. CENTER NAVIGATION (Mega Menu Triggers) */}
          <div className="hidden xl:flex items-center h-full gap-1">
            
            {/* Overview Group (Direct Links) */}
            {menuCategories.overview.map((item) => (
              <NavLink 
                key={item.id} 
                to={item.link}
                className={({ isActive }) => 
                  `px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-2
                  ${isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"}`
                }
              >
                {item.icon && <item.icon size={18} />}
                {item.title}
              </NavLink>
            ))}

            {/* Operations Mega Menu */}
            <div 
              className="nav-group h-full flex items-center px-2 cursor-pointer group"
              onMouseEnter={() => setActiveMegaMenu('operations')}
            >
              <button className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${activeMegaMenu === 'operations' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'}`}>
                Operations <FaChevronDown size={10} className={`transition-transform ${activeMegaMenu === 'operations' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Finance Mega Menu */}
            <div 
              className="nav-group h-full flex items-center px-2 cursor-pointer group"
              onMouseEnter={() => setActiveMegaMenu('finance')}
            >
              <button className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${activeMegaMenu === 'finance' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'}`}>
                Finance <FaChevronDown size={10} className={`transition-transform ${activeMegaMenu === 'finance' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* System Dropdown */}
            <div 
              className="nav-group h-full flex items-center px-2 cursor-pointer group"
              onMouseEnter={() => setActiveMegaMenu('system')}
            >
              <button className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${activeMegaMenu === 'system' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'}`}>
                System <FaChevronDown size={10} className={`transition-transform ${activeMegaMenu === 'system' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* 3. RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            
            {/* Hotkeys Trigger */}
            <button 
              onClick={() => setShowHotkeys(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all"
            >
              <span>⌘</span><span>K</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
              <IoIosNotifications size={22} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {adminName.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-none">{adminName}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Admin</p>
                </div>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-fadeInUp">
                   <div className="px-4 py-2 border-b border-slate-50">
                     <p className="text-xs font-bold text-slate-400">ACCOUNT</p>
                     <p className="text-sm font-bold text-slate-800">{adminName}</p>
                   </div>
                   <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left">
                     <AiOutlineUser /> Sign Out
                   </button>
                </div>
              )}
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600"
            >
              {mobileMenuOpen ? <HiX size={26} /> : <HiOutlineMenu size={26} />}
            </button>
          </div>
        </div>

        {/* --- MEGA MENUS (Overlay Content) --- */}
        <div className={`absolute top-[80px] left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl z-40 transition-all duration-300 origin-top ${activeMegaMenu ? 'opacity-100 visible' : 'opacity-0 invisible h-0 overflow-hidden'}`}>
          <div className="max-w-[1600px] mx-auto p-8">
            
            {activeMegaMenu === 'operations' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 border-r border-slate-100 pr-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Core Operations</h3>
                  <div className="space-y-1">
                     {menuCategories.operations.slice(0, 4).map(item => <MegaMenuItem key={item.id} item={item} />)}
                  </div>
                </div>
                <div className="col-span-1 border-r border-slate-100 pr-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Management</h3>
                  <div className="space-y-1">
                     {menuCategories.operations.slice(4, 7).map(item => <MegaMenuItem key={item.id} item={item} />)}
                  </div>
                </div>
                <div className="col-span-2">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Access</h3>
                   <div className="grid grid-cols-2 gap-4">
                     {menuCategories.operations.slice(7).map(item => <MegaMenuItem key={item.id} item={item} />)}
                   </div>
                </div>
              </div>
            )}

            {activeMegaMenu === 'finance' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Financials</h3>
                   <div className="space-y-1">
                     {menuCategories.finance.map(item => <MegaMenuItem key={item.id} item={item} />)}
                   </div>
                </div>
                <div className="col-span-3 bg-indigo-50/50 rounded-2xl p-6 flex items-center justify-between">
                   <div>
                     <h4 className="font-bold text-indigo-900">Revenue Reports</h4>
                     <p className="text-sm text-indigo-600 mt-1">View detailed analytics for this quarter.</p>
                   </div>
                   <button onClick={() => navigate("/reports")} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-200">Go to Reports</button>
                </div>
              </div>
            )}

            {activeMegaMenu === 'system' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-2">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">General Settings</h3>
                   <div className="grid grid-cols-2 gap-4">
                      {/* Handling nested submenus from your data */}
                      {menuCategories.system.find(i => i.title === "General Settings")?.submenuItems?.map(sub => (
                        <div key={sub.id} className="group">
                           <NavLink to={sub.link} className="block p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all">
                             <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">{sub.icon && <sub.icon size={16}/>}</div>
                                <span className="text-sm font-bold text-slate-700">{sub.title}</span>
                             </div>
                           </NavLink>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="col-span-1 border-l border-slate-100 pl-8">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">External</h3>
                   <div className="space-y-1">
                      {menuCategories.system.find(i => i.title === "Other Sites")?.submenuItems?.map(sub => (
                        <a key={sub.id} href={sub.link} target={sub.newTab ? "_blank" : "_self"} rel="noreferrer" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors">
                           <CgWebsite size={14} /> {sub.title} {sub.newTab && <FaExternalLinkAlt size={10} className="opacity-50"/>}
                        </a>
                      ))}
                   </div>
                </div>
                <div className="col-span-1 border-l border-slate-100 pl-8">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Support</h3>
                   <div className="space-y-1">
                      {menuCategories.system.filter(i => ["Setting", "Help & Support"].includes(i.title)).map(item => <MegaMenuItem key={item.id} item={item} />)}
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* --- MOBILE MENU (Simplified for touch) --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-24 px-6 xl:hidden animate-fadeIn overflow-y-auto">
          <div className="space-y-6 pb-10">
            {/* Mobile: Overview */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Overview</h3>
              {menuCategories.overview.map(item => <MobileMenuItem key={item.id} item={item} />)}
            </div>
            {/* Mobile: Operations */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Operations</h3>
              <div className="space-y-1 pl-2 border-l-2 border-slate-100">
                 {menuCategories.operations.map(item => <MobileMenuItem key={item.id} item={item} />)}
              </div>
            </div>
             {/* Mobile: Finance */}
             <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Finance</h3>
              <div className="space-y-1 pl-2 border-l-2 border-slate-100">
                 {menuCategories.finance.map(item => <MobileMenuItem key={item.id} item={item} />)}
              </div>
            </div>
            {/* Mobile: System */}
             <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">System</h3>
              <div className="space-y-1 pl-2 border-l-2 border-slate-100">
                 {menuCategories.system.map(item => <MobileMenuItem key={item.id} item={item} />)}
              </div>
            </div>
            <button onClick={handleLogout} className="w-full py-3 text-left text-rose-600 font-bold">Sign Out</button>
          </div>
        </div>
      )}

      {/* --- HOTKEYS MODAL (Command Palette) --- */}
      {showHotkeys && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh]">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowHotkeys(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-fadeInUp">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <HiSearch className="text-slate-400 text-xl" />
              <input autoFocus type="text" placeholder="Type a command or search..." className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-slate-800" />
              <span className="text-xs font-bold text-slate-400 border border-slate-200 rounded px-2 py-1">ESC</span>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Navigation</div>
              {[...menuCategories.overview, ...menuCategories.operations].slice(0, 6).map((item, idx) => (
                <div key={item.id} onClick={() => { navigate(item.link); setShowHotkeys(false); }} className="flex items-center justify-between p-3 hover:bg-indigo-50 rounded-xl cursor-pointer group transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-all">
                      {item.icon && <item.icon size={16} />}
                    </div>
                    <span className="font-medium text-slate-700">{item.title}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-300 bg-slate-50 px-2 py-1 rounded">⌘{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.2s ease-out; }
      `}</style>
    </>
  );
};

// Helper for Mega Menu Items
const MegaMenuItem = ({ item }) => {
  const navigate = useNavigate();
  return (
    <NavLink 
      to={item.link} 
      onClick={() => window.location.hash = item.link} // Force refresh if needed or just navigate
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 hover:text-indigo-600 text-slate-600 transition-all group"
    >
      {item.icon && <item.icon size={18} className="opacity-70 group-hover:opacity-100" />}
      <span className="text-sm font-semibold">{item.title}</span>
    </NavLink>
  );
};

const MobileMenuItem = ({ item }) => {
  return (
    <NavLink to={item.link} className="block py-3 text-base font-medium text-slate-700 hover:text-indigo-600 border-b border-slate-50 last:border-0">
      {item.title}
    </NavLink>
  );
};

export default Navbar;