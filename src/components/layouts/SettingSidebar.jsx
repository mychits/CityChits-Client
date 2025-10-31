import { Fragment, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import {
  RiDashboardFill,
  RiAdminLine,
} from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { IoPeopleOutline } from "react-icons/io5";
import { TiSpanner } from "react-icons/ti";
import { MdOutlineGroups, MdAppSettingsAlt } from "react-icons/md";
import { ImHappy } from "react-icons/im";
import { FaPersonMilitaryPointing } from "react-icons/fa6";
import { LuTarget } from "react-icons/lu";
import { TbTargetArrow, TbGraph, TbGraphFilled } from "react-icons/tb";
import { BsFileBarGraph } from "react-icons/bs";
import { MdAccountBalanceWallet } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { IoIosHelpCircle } from "react-icons/io";
import { FaGift } from "react-icons/fa6";
import { BsPersonCheck } from "react-icons/bs";
const settingMenu = [
  { id: 1, title: "Dashboard", icon: RiDashboardFill, link: "/dashboard" },
  { id: 2, title: "Analytics", icon: SiGoogleanalytics, link: "/analytics" },
  {
    id: 3,
    title: "App Settings",
    icon: TiSpanner,
    submenu: true,
    submenuItems: [
      {
        id: "3-1",
        title: "Groups",
        icon: MdOutlineGroups,
        submenu: true,
        submenuItems: [
          {
            id: "3-1-1",
            title: "Mobile Access",
            icon: MdAppSettingsAlt,
            link: "/lead-setting/app-settings/groups/mobile-access",
          },
          {
            id: "3-1-2",
            title: "Dream Asset",
            icon: ImHappy,
            link: "/lead-setting/app-settings/groups/asset",
          },
          {
            id: "3-1-3",
            title: "Become Agent",
            icon: FaPersonMilitaryPointing,
            link: "/lead-setting/app-settings/groups/become-agent",
          },
        ],
      },
    ],
  },

    {
    title: "Insurance",
    icon: IoPeopleOutline,
    link : "/insurance"

  },
  {
    title: "Reward",
    icon: FaGift,
    link : "/gift-received"
  },
  { id: 4, title: "Designations", icon: IoPeopleOutline, link: "/designation" },
  {
    id: 5,
    title: "Administrative Privileges",
    icon: RiAdminLine,
    link: "/administrative-privileges",
  },
  {
    title: "Admin Access Rights",
    icon: BsPersonCheck,
    link: "/admin-access-rights",
  },
  // {
  //   id: 6,
  //   title: "Target Management",
  //   icon: LuTarget,
  //   submenu: true,
  //   submenuItems: [
  //     {
  //       id: "6-1",
  //       title: "Target",
  //       icon: TbTargetArrow,
  //       link: "/target",
  //     },
  //     {
  //       id: "6-2",
  //       title: "Reports",
  //       icon: BsFileBarGraph,
  //       submenu: true,
  //       submenuItems: [
  //         {
  //           id: "6-2-1",
  //           title: "Commission Report",
  //           icon: TbGraph,
  //           link: "/target-commission",
  //         },
  //         {
  //           id: "6-2-2",
  //           title: "Incentive Report",
  //           icon: TbGraphFilled,
  //           link: "/target-incentive",
  //         },
  //       ],
  //     },
  //     {
  //       id: "6-3",
  //       title: "Accounts",
  //       icon: MdAccountBalanceWallet,
  //       submenu: true,
  //       submenuItems: [
  //         {
  //           id: "6-3-1",
  //           title: "PayOut Menu",
  //           icon: RiMoneyRupeeCircleFill,
  //           link: "/target-payout-menu",
  //         },
  //       ],
  //     },
  //   ],
  // },

      {
  title: "Penalty Management",
  icon: RiMoneyRupeeCircleFill,
  submenu: true,
  submenuItems: [
    { title: "Penalty Settings", icon: TiSpanner, link: "/penalty-settings" },
    { title: "Penalty Monitor", icon: TbGraph, link: "/penalty-monitor" },
  ],
},

  { id: 7, title: "Profile", icon: CgProfile, link: "/profile" },
  { id: 8, title: "Help & Support", icon: IoIosHelpCircle, link: "/help" },
];

const SettingSidebar = ({ showMobileSidebar = false, setShowMobileSidebar = () => {} }) => {
  const [open, setOpen] = useState(true);
  const [showArrowLeft, setShowArrowLeft] = useState(false);
  const [submenuOpenIndex, setSubmenuOpenIndex] = useState(null);
  const [nestedSubmenuOpenIndex, setNestedSubmenuOpenIndex] = useState({});

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
      <div
        className={`bg-violet-50 mt-2 p-5 pt-7 fixed md:static transition-all duration-300 ${
          open ? "w-64" : "w-28"
        } ${showMobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        onMouseEnter={() => setShowArrowLeft(true)}
        onMouseLeave={() => setShowArrowLeft(false)}
      >
        {showArrowLeft && (
          <BsArrowLeftShort
            className={`bg-white text-custom-violet text-3xl rounded-full absolute z-20 -right-3 top-20 border border-custom-violet cursor-pointer ${
              !open && "rotate-180"
            }`}
            onClick={() => setOpen(!open)}
          />
        )}

        <ul className="pt-2 space-y-2">
          {settingMenu.map((menu, index) => {
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
                    `flex items-center gap-x-4 p-3 rounded-xl shadow-sm transition-all duration-200 ${
                      isActive && !menu.submenu
                        ? "bg-violet-500 text-white"
                        : "bg-white text-gray-700 hover:bg-violet-200"
                    } ${menu.spacing ? "mt-6" : ""}`
                  }
                >
                  <span className="text-xl w-6 flex justify-center">
                    <menu.icon />
                  </span>
                  <span
                    className={`text-base font-medium flex-1 ${!open && "hidden"}`}
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
                              `p-2 pl-5 rounded-lg shadow-sm text-sm flex items-center transition-all duration-200 ${
                                isActive
                                  ? "bg-custom-violet text-white"
                                  : "bg-white text-gray-600 hover:bg-purple-100"
                              }`
                            }
                          >
                            {submenuItem.icon && (
                              <span className="mr-2">{<submenuItem.icon />}</span>
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
                                    `p-2 pl-6 rounded-lg shadow-sm text-sm flex items-center transition-all duration-200 ${
                                      isActive
                                        ? "bg-custom-violet text-white"
                                        : "bg-white text-gray-600 hover:bg-purple-100"
                                    }`
                                  }
                                >
                                  {subSubItem.icon && (
                                    <span className="mr-2">{subSubItem.icon}</span>
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

      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}
    </>
  );
};

export default SettingSidebar;
