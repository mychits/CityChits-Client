import { Fragment, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import sidebarMenu from "../../data/sidebarMenu";
import Navbar from "./Navbar";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({
  navSearchBarVisibility = false,
  navbarVisibility = true,
  onGlobalSearchChangeHandler = () => { },
  showMobileSidebar = false,
  setShowMobileSidebar = () => { },
}) => {
  const [open, setOpen] = useState(true);
  const [showArrowLeft, setShowArrowLeft] = useState(false);
  const [submenuOpenIndex, setSubmenuOpenIndex] = useState(null);
  const [nestedSubmenuOpenIndex, setNestedSubmenuOpenIndex] = useState({});
  const location = useLocation();

  const toggleSubMenu = (index) => {
    setSubmenuOpenIndex(submenuOpenIndex === index ? null : index);
  };

  const toggleNestedSubMenu = (submenuIndex, subIndex) => {
    setNestedSubmenuOpenIndex((prevState) => ({
      ...prevState,
      [submenuIndex]: prevState[submenuIndex] === subIndex ? null : subIndex,
    }));
  };

  return (
    <>
      {navbarVisibility && (
        <Navbar
          visibility={navSearchBarVisibility}
          onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
          showMobileSidebar={showMobileSidebar}
          setShowMobileSidebar={setShowMobileSidebar}
        />
      )}

      {navbarVisibility && (
        <div
          className={`fixed md:static inset-y-0 left-0 z-30 bg-white/60 backdrop-blur-2xl border-r border-white/40 mt-[73px] md:mt-0 shadow-xl md:shadow-none transition-all duration-300 ease-in-out
            ${open ? "w-64" : "w-20"} 
            ${showMobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
          onMouseEnter={() => setShowArrowLeft(true)}
          onMouseLeave={() => setShowArrowLeft(false)}
        >
          {/* Collapse Toggle */}
          {showArrowLeft && (
            <button
              onClick={() => setOpen(!open)}
              className={`absolute -right-3.5 top-6 z-50 bg-white text-indigo-600 border border-indigo-100 rounded-full p-1.5 shadow-lg hover:scale-110 transition-transform duration-300 ${!open && "rotate-180"}`}
            >
              <BsArrowLeftShort className="text-xl" />
            </button>
          )}

          <div className="h-full flex flex-col py-6 overflow-y-auto custom-scrollbar">
            {!open && (
              <div className="flex justify-center mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
              </div>
            )}

            <ul className="px-3 space-y-1">
              {sidebarMenu.map((menu, index) => {
                const isOpen = submenuOpenIndex === index;
                const isActive = location.pathname === menu.link;

                return (
                  <Fragment key={menu.id}>
                    <NavLink
                      to={menu.link || "#"}
                      end
                      onClick={(e) => {
                        if (menu.submenu) {
                          e.preventDefault();
                          toggleSubMenu(index);
                        }
                      }}
                      className={({ isActive: linkActive }) => `
                        flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                        ${linkActive && !menu.submenu
                          ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-200"
                          : "text-slate-600 hover:bg-white/50 hover:text-indigo-600"
                        }
                        ${menu.spacing ? "mt-8" : ""}
                      `}
                    >
                      <span className="flex-shrink-0 text-xl w-6 flex justify-center transition-colors duration-200">
                        <menu.icon />
                      </span>
                      
                      <span
                        className={`text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ${!open ? "w-0 opacity-0" : "w-auto opacity-100"}`}
                      >
                        {menu.title}
                      </span>

                      {menu.submenu && open && (
                        <div className={`ml-auto transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                          <AiOutlinePlus size={14} />
                        </div>
                      )}
                    </NavLink>

                    {menu.submenu && isOpen && open && (
                      <ul className="ml-4 mt-1.5 space-y-1 pl-2 border-l-2 border-indigo-100/50">
                        {menu.submenuItems.map((submenuItem, subIndex) => {
                          const isNestedOpen = nestedSubmenuOpenIndex[index] === subIndex;
                          const isSubActive = location.pathname === submenuItem.link;

                          return (
                            <Fragment key={submenuItem.id}>
                              <NavLink
                                to={submenuItem.link || "#"}
                                end
                                onClick={(e) => {
                                  if (submenuItem.submenu) {
                                    e.preventDefault();
                                    toggleNestedSubMenu(index, subIndex);
                                  }
                                }}
                                className={({ isActive }) => `
                                  flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                  ${isActive || isSubActive
                                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                  }
                                `}
                              >
                                {submenuItem.icon && <span className="text-base">{submenuItem.icon}</span>}
                                <span className="truncate">{submenuItem.title}</span>
                                
                                {submenuItem.submenu && (
                                  <div className={`ml-auto transition-transform duration-200 ${isNestedOpen ? "rotate-180" : ""}`}>
                                    <AiOutlinePlus size={12} />
                                  </div>
                                )}
                              </NavLink>

                              {submenuItem.submenu && isNestedOpen && (
                                <ul className="ml-6 mt-1.5 space-y-1">
                                  {submenuItem.submenuItems.map((subSubItem) => (
                                    <NavLink
                                      key={subSubItem.id}
                                      to={subSubItem.link}
                                      end
                                      className={({ isActive }) => `
                                        flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                        ${isActive
                                          ? "text-indigo-600 font-bold bg-indigo-50/50"
                                          : "text-slate-500 hover:text-slate-700"
                                        }
                                      `}
                                    >
                                      {subSubItem.icon && <span className="text-base opacity-60">{subSubItem.icon}</span>}
                                      <span className="truncate">{subSubItem.title}</span>
                                    </NavLink>
                                  ))}
                                </ul>
                              )}
                            </Fragment>
                          );
                        })}
                      </ul>
                    )}
                  </Fragment>
                );
              })}
            </ul>
          </div>
        </div>
      )}  

      {/* Mobile Overlay */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </>
  );
};

export default Sidebar;