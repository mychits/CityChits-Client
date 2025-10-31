import { NavLink, Outlet } from "react-router-dom";
import { useState, Fragment } from "react";
import Sidebar from "../components/layouts/Sidebar";
import { FaWhatsapp } from "react-icons/fa";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { FaFacebookSquare } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { LiaSmsSolid } from "react-icons/lia";

const mainMenus = [
  {
    key: "#main-1",
    title: "Whatsapp Marketing",
    icon: <FaWhatsapp size={20} />,
    subMenus: [
      {
        key: "#1",
        title: "Login",
        link: "https://app.interakt.ai/login",
        icon: <FaWhatsapp size={20} />,
        newTab: true,
      },
      {
        key: "#main-4",
        title: "Due Message",
        icon: <FaWhatsapp size={20} />,
        subMenus: [
          {
            key: "#4",
            title: "Due",
            link: "/marketing/due-message",
            icon: <RiMoneyRupeeCircleLine size={22} />,
          },
          {
            key: "#6",
            title: "Overdue",
            link: "/marketing/over-due-message",
            icon: <RiMoneyRupeeCircleLine size={22} />,
          },
        ],
      },
      {
        key: "#main-7",
        title: "Lead Whatsapp Message",
        icon: <FaWhatsapp size={20} />,
        subMenus: [
          {
            key: "#20",
            title: "Welcome Message",
            link: "/marketing/lead-welcome-message",
            icon: <RiMoneyRupeeCircleLine size={22} />,
          },
          {
            key: "#21",
            title: "ReferredBy Message",
            link: "/marketing/lead-referredby-message",
            icon: <RiMoneyRupeeCircleLine size={22} />,
          },
        ],
      },
      {
        key: "#main-8",
        title: "Customer Whatsapp Message",
        icon: <FaWhatsapp size={20} />,
        subMenus: [
          {
            key: "#20",
            title: "Welcome Message",
            link: "/marketing/customer-welcome-message",
            icon: <RiMoneyRupeeCircleLine size={22} />,
          },
          {
            key: "#21",
            title: "ChitPlan Message",
            link: "/marketing/customer-chitplan-message",
            icon: <RiMoneyRupeeCircleLine size={22} />,
          },
        ],
      },
      {
        key: "#main-6",
        title: "Auction Message",
        icon: <FaWhatsapp size={20} />,
        subMenus: [
          {
            key: "#5",
            title: "Auction Intimation Message",
            link: "/marketing/auction-intimation-message",
            icon: <RiMoneyRupeeCircleLine size={22} />,
          },
          {
            key: "#12",
            title: "Bid Winner",
            link: "/marketing/bid-winner",
            icon: <RiMoneyRupeeCircleLine size={22} />,
          },
          {
            key: "#18",
            title: "Auction Bid status",
            link: "/marketing/bid-status",
            icon: <RiMoneyRupeeCircleLine size={22} />,
          },
          {
            key: "#19",
            title: "Bid Winner Document List",
            link: "/marketing/winner-document",
            icon: <RiMoneyRupeeCircleLine size={22} />,
          },
          {
            key: "#20",
            title: "Auction information",
            link: "/marketing/auction-info",
            icon: <RiMoneyRupeeCircleLine size={22} />,
          },
          {
            key: "#21",
            title: "Auction Terms and Condition",
            link: "/marketing/auction-terms-condition",
            icon: <RiMoneyRupeeCircleLine size={22} />,
          },
        ],
      },
      {
        key: "#main-5",
        title: "Promotion",
        icon: <FaWhatsapp size={20} />,
        subMenus: [
          {
            key: "#11",
            title: "Promo",
            link: "/marketing/what-promo",
            icon: <FaWhatsapp size={20} />,
          },
        ],
      },
    ],
  },
  {
    key: "#main-2",
    title: "Email Marketing",
    icon: <MdEmail size={20} />,
    subMenus: [
      {
        key: "#main-10",
        title: "Due Email",
        icon: <MdEmail size={20} />,
        subMenus: [
          {
            key: "#15",
            title: "Due",
            link: "/marketing/due-email",
            icon: <RiMoneyRupeeCircleLine size={22} />,
          },
          {
            key: "#16",
            title: "Overdue",
            link: "/marketing/over-due-email",
            icon: <RiMoneyRupeeCircleLine size={22} />,
          },
        ],
      },
    ],
  },
  {
    key: "#main-3",
    title: "Payment Links",
    icon: <RiMoneyRupeeCircleLine size={20} />,
    subMenus: [
      {
        key: "#7",
        title: "Payment Link",
        link: "/marketing/payment-link",
        icon: <RiMoneyRupeeCircleLine size={22} />,
      },
    ],
  },
];

const Marketing = () => {
  const [openMenu, setOpenMenu] = useState({});

  const toggleMenu = (menuKey) => {
    setOpenMenu((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  // Recursive menu rendering function
  const renderMenu = (menus, level = 0) => {
    return (
      <ul className={level > 0 ? "ml-4 mt-2 space-y-1" : ""}>
        {menus.map((menu) => {
          const hasSubMenu = menu.subMenus && menu.subMenus.length > 0;
          const isOpen = openMenu[menu.key];

          return (
            <Fragment key={menu.key}>
              <li>
                {menu.link ? (
                  <NavLink
                    to={menu.link}
                    target={menu.newTab ? "_blank" : "_self"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 font-medium cursor-pointer
                      ${isActive 
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md" 
                        : "hover:bg-violet-50 text-gray-700 hover:text-violet-700"
                      }`
                    }
                  >
                    <span className={`${level > 0 ? "text-violet-600" : ""}`}>
                      {menu.icon}
                    </span>
                    <span>{menu.title}</span>
                  </NavLink>
                ) : (
                  <div
                    onClick={() => hasSubMenu && toggleMenu(menu.key)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 font-medium cursor-pointer
                    ${isOpen 
                      ? "bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 shadow-sm" 
                      : "hover:bg-violet-50 text-gray-700 hover:text-violet-700"
                    }`}
                  >
                    <span className={level > 0 ? "text-violet-600" : ""}>
                      {menu.icon}
                    </span>
                    <span>{menu.title}</span>
                    {hasSubMenu && (
                      <span className="ml-auto transition-transform duration-200">
                        {isOpen ? 
                          <AiOutlineMinus className="text-violet-600" /> : 
                          <AiOutlinePlus className="text-violet-600" />
                        }
                      </span>
                    )}
                  </div>
                )}

                {hasSubMenu && isOpen && renderMenu(menu.subMenus, level + 1)}
              </li>
            </Fragment>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="w-screen flex mt-20 bg-gradient-to-br from-violet-50 to-white min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen w-full">
        <div className="w-[300px] bg-white shadow-xl border-r border-violet-100 min-h-screen p-6 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
              Marketing Hub
            </h2>
            <p className="text-gray-500 text-sm mt-1">Manage your marketing campaigns</p>
          </div>
          
          <div className="space-y-2">
            {renderMenu(mainMenus)}
          </div>
        </div>

        <div className="flex-1 bg-white p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;