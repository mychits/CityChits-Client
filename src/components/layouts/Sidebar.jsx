// src/components/layout/Sidebar.jsx
import { Fragment, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import sidebarMenu from "../../data/sidebarMenu";
import Navbar from "./Navbar";
import { NavLink, useLocation } from "react-router-dom";
import { TbArrowsUpLeft } from "react-icons/tb";

const Sidebar = ({
  navSearchBarVisibility = false,
  navbarVisibility = true,
  onGlobalSearchChangeHandler = () => {},
  showMobileSidebar = false,
  setShowMobileSidebar = () => {},
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
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
      `}</style>

      <Navbar
        visibility={navSearchBarVisibility}
        onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
        showMobileSidebar={showMobileSidebar}
        setShowMobileSidebar={setShowMobileSidebar}
      />

      {navbarVisibility && (
        <div
          className={`bg-white p-5 pt-7 fixed md:static transition-all duration-300 border-r border-gray-200 shadow-md
            ${open ? "w-64" : "w-20"}
            ${!navbarVisibility ? "hidden" : ""}
            ${showMobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
          onMouseEnter={() => setShowArrowLeft(true)}
          onMouseLeave={() => setShowArrowLeft(false)}
        >
          {/* Professional accent line on left */}
          <div className="absolute left-0 top-0 w-1 h-full bg-blue-600"></div>

          {/* Collapse Arrow */}
          {showArrowLeft && (
            <div className="absolute -right-4 top-20 z-20 animate-slideInLeft">
              <BsArrowLeftShort
                className={`bg-blue-600 text-white text-3xl rounded-full 
                  border-2 border-white cursor-pointer shadow-md transform hover:scale-110 active:scale-95 transition-all duration-300
                  ${!open && "rotate-180"}`}
                onClick={() => setOpen(!open)}
              />
            </div>
          )}

          {/* Menu Items */}
          <ul className="pt-2 space-y-2">
            {sidebarMenu.map((menu, index) => {
              const isOpen = submenuOpenIndex === index;
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
                    className={({ isActive }) =>
                      `group flex items-center gap-x-4 p-3.5 rounded-lg transition-all duration-300 ${
                        isActive && !menu.submenu
                          ? "bg-blue-600 text-white font-semibold shadow-sm"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${menu.spacing ? "mt-6" : ""}`
                    }
                  >
                    {/* Icon */}
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      ({ isActive }) => isActive && !menu.submenu
                        ? "bg-white/20"
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }`}>
                      <span className={`text-xl flex justify-center transition-colors duration-300 ${
                        ({ isActive }) => isActive && !menu.submenu ? "text-white" : "text-blue-600"
                      }`}>
                        <menu.icon />
                      </span>
                    </div>
                    
                    <span className={`text-sm font-medium flex-1 ${!open && "hidden"}`}>
                      {menu.title}
                    </span>
                    
                    {menu.submenu && open && (
                      <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                        isOpen 
                          ? "bg-white/20 rotate-180" 
                          : "bg-gray-100 group-hover:bg-gray-200"
                      }`}>
                        <AiOutlinePlus className={`transition-colors duration-300 ${
                          isOpen ? "text-white" : "text-blue-600"
                        }`} />
                      </div>
                    )}
                  </NavLink>

                  {/* Submenu */}
                  {menu.submenu && isOpen && open && (
                    <ul className="ml-6 mt-2 space-y-1.5 animate-slideInLeft">
                      {menu.submenuItems.map((submenuItem, subIndex) => {
                        const isNestedOpen = nestedSubmenuOpenIndex[index] === subIndex;
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
                              className={({ isActive }) =>
                                `group p-3 pl-4 rounded-lg text-sm flex items-center transition-all duration-300 ${
                                  isActive
                                    ? "bg-blue-500 text-white font-medium shadow-sm"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`
                              }
                              style={{ animationDelay: `${subIndex * 50}ms` }}
                            >
                              {/* Active indicator */}
                              {({ isActive }) => isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                              )}
                              
                              {submenuItem.icon && (
                                <div className={`p-1.5 rounded-lg mr-2.5 transition-all duration-300 ${
                                  ({ isActive }) => isActive 
                                    ? "bg-white/20" 
                                    : "bg-gray-100"
                                }`}>
                                  <span className={`transition-colors duration-300 ${
                                    ({ isActive }) => isActive ? "text-white" : "text-blue-500"
                                  }`}>
                                    {submenuItem.icon}
                                  </span>
                                </div>
                              )}
                              
                              <span className="flex-1">{submenuItem.title}</span>
                              
                              {submenuItem.submenu && (
                                <div className={`p-1 rounded-lg transition-all duration-300 ${
                                  isNestedOpen 
                                    ? "bg-white/20 rotate-180" 
                                    : "bg-gray-100"
                                }`}>
                                  <AiOutlinePlus className={`text-xs ${
                                    isNestedOpen ? "text-white" : "text-blue-600"
                                  }`} />
                                </div>
                              )}
                            </NavLink>

                            {/* Nested Submenu */}
                            {submenuItem.submenu && isNestedOpen && (
                              <ul className="ml-6 mt-1.5 space-y-1 animate-slideInLeft">
                                {submenuItem.submenuItems.map((subSubItem, subSubIndex) => (
                                  <NavLink
                                    key={subSubItem.id}
                                    to={subSubItem.link}
                                    end
                                    className={({ isActive }) =>
                                      `p-2.5 pl-4 rounded-lg text-sm flex items-center transition-all duration-300 ${
                                        isActive
                                          ? "bg-blue-400 text-white font-medium shadow-sm"
                                          : "text-gray-600 hover:bg-gray-100"
                                      }`
                                    }
                                    style={{ animationDelay: `${subSubIndex * 50}ms` }}
                                  >
                                    {subSubItem.icon && (
                                      <div className={`p-1 rounded-lg mr-2 ${
                                        ({ isActive }) => isActive 
                                          ? "bg-white/20" 
                                          : "bg-gray-100"
                                      }`}>
                                        <span className={({ isActive }) => isActive ? "text-white" : "text-blue-500"}>
                                          {subSubItem.icon}
                                        </span>
                                      </div>
                                    )}
                                    {subSubItem.title}
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
      )}

      {/* Mobile Overlay */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Professional Scroll to Top Button */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <button
          className="bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-300"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <TbArrowsUpLeft className="text-xl rotate-90" />
        </button>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-gray-800 text-white text-xs font-medium py-2 px-3 rounded-lg whitespace-nowrap shadow-lg">
            Scroll to Top
            <div className="absolute top-full right-4 -mt-1">
              <div className="border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;