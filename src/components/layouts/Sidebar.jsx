import { Fragment, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import sidebarMenu from "../../data/sidebarMenu";
import Navbar from "./Navbar";
import { NavLink, useLocation } from "react-router-dom";
import { TbArrowsLeftDown } from "react-icons/tb";



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
      <Navbar
        visibility={navSearchBarVisibility}
        onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
        showMobileSidebar={showMobileSidebar}
        setShowMobileSidebar={setShowMobileSidebar}
      />
      {navbarVisibility && (
        <div
          className={`bg-violet-50 mt-2 p-5 pt-7 fixed md:static  transition-all duration-300 ${open ? "w-64" : "w-28"
            } ${!navbarVisibility ? "hidden" : ""} ${showMobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            }`}
          onMouseEnter={() => setShowArrowLeft(true)}
          onMouseLeave={() => setShowArrowLeft(false)}
        >
          {showArrowLeft && (
            <BsArrowLeftShort
              className={`bg-white text-custom-violet text-3xl rounded-full absolute z-20 -right-3 top-20 border border-custom-violet cursor-pointer ${!open && "rotate-180"
                }`}
              onClick={() => setOpen(!open)}
            />
          )}

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
                      `flex items-center gap-x-4 p-3 rounded-xl shadow-sm transition-all duration-200 ${isActive && !menu.submenu
                        ? "bg-violet-500 text-white"
                        : "bg-white text-gray-700 hover:bg-violet-200"
                      } ${menu.spacing ? "mt-6" : ""}`
                    }
                  >
                    <span className="text-xl w-6 flex justify-center">
                      <menu.icon />
                    </span>
                    <span
                      className={`text-base font-medium flex-1 ${!open && "hidden"
                        }`}
                    >
                      {menu.title}
                    </span>
                    {menu.submenu &&
                      open &&
                      (isOpen ? (
                        <AiOutlineMinus className="ml-auto transition-transform duration-200" />
                      ) : (
                        <AiOutlinePlus className="ml-auto transition-transform duration-200" />
                      ))}
                  </NavLink>

                  {menu.submenu && isOpen && open && (
                    <ul className="ml-4 mt-1 font-medium space-y-1">
                      {menu.submenuItems.map((submenuItem, subIndex) => {
                        const isNestedOpen =
                          nestedSubmenuOpenIndex[index] === subIndex;

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
                                `p-2 pl-5 rounded-lg shadow-sm text-sm flex items-center transition-all duration-200 ${isActive
                                  ? "bg-custom-violet text-white"
                                  : "bg-white text-gray-600 hover:bg-purple-100"
                                }`
                              }
                            >
                              {submenuItem.icon && (
                                <span className="mr-2">{submenuItem.icon}</span>
                              )}
                              {submenuItem.title}
                              {submenuItem.submenu &&
                                (isNestedOpen ? (
                                  <AiOutlineMinus className="ml-auto" />
                                ) : (
                                  <AiOutlinePlus className="ml-auto" />
                                ))}
                            </NavLink>

                            {submenuItem.submenu && isNestedOpen && (
                              <ul className="ml-6 mt-1 space-y-1">
                                {submenuItem.submenuItems.map((subSubItem) => (
                                  <NavLink
                                    key={subSubItem.id}
                                    to={subSubItem.link}
                                    end
                                    className={({ isActive }) =>
                                      `p-2 pl-6 rounded-lg shadow-sm text-sm flex items-center transition-all duration-200 ${isActive
                                        ? "bg-custom-violet text-white"
                                        : "bg-white text-gray-600 hover:bg-purple-100"
                                      }`
                                    }
                                  >
                                    {subSubItem.icon && (
                                      <span className="mr-2">
                                        {subSubItem.icon}
                                      </span>
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

      {showMobileSidebar && (
        <div
          className="fixed  inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}


      <div
        className="fixed bottom-6 right-6 bg-violet-300 text-white p-3 rounded-xl shadow-lg 
             hover:bg-violet-700 active:scale-95 transition-all duration-300 cursor-pointer 
             z-[9999] animate-bounce"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <TbArrowsLeftDown className="text-2xl rotate-90" />
      </div>

    </>
  );
};

export default Sidebar;