import { NavLink, Outlet } from "react-router-dom";
import { useState, Fragment } from "react";
import Sidebar from "../components/layouts/Sidebar";
import { FaWhatsapp } from "react-icons/fa";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { TrendingUp, AlertCircle, MessageCircle, Mail, Link2, ChevronRight, ChevronDown } from "lucide-react";

const mainMenus = [
  {
    id: 1,
    title: "WhatsApp Marketing",
    icon: FaWhatsapp,
    gradient: "from-purple-500 to-pink-500",
    subMenus: [
      {
        id: 11,
        title: "Due Message",
        icon: RiMoneyRupeeCircleLine,
        subMenus: [
          { id: 111, title: "Due", href: "/marketing/due-message" },
          { id: 112, title: "Overdue", href: "/marketing/over-due-message" },
        ],
      },
      {
        id: 12,
        title: "Lead Messages",
        icon: FaWhatsapp,
        subMenus: [
          { id: 121, title: "Welcome Message", href: "/marketing/lead-welcome-message" },
          { id: 122, title: "ReferredBy Message", href: "/marketing/lead-referredby-message" },
        ],
      },
      {
        id: 13,
        title: "Customer Messages",
        icon: FaWhatsapp,
        subMenus: [
          { id: 131, title: "Welcome Message", href: "/marketing/customer-welcome-message" },
          { id: 132, title: "ChitPlan Message", href: "/marketing/customer-chitplan-message" },
        ],
      },
      {
        id: 14,
        title: "Auction Messages",
        icon: FaWhatsapp,
        subMenus: [
          { id: 141, title: "Auction Intimation", href: "/marketing/auction-intimation-message" },
          { id: 142, title: "Bid Winner", href: "/marketing/bid-winner" },
          { id: 143, title: "Bid Status", href: "/marketing/bid-status" },
          { id: 144, title: "Winner Documents", href: "/marketing/winner-document" },
          { id: 145, title: "Auction Info", href: "/marketing/auction-info" },
          { id: 146, title: "Terms & Conditions", href: "/marketing/auction-terms-condition" },
        ],
      },
      {
        id: 15,
        title: "Promotions",
        icon: FaWhatsapp,
        subMenus: [
          { id: 151, title: "Promo", href: "/marketing/what-promo" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Email Marketing",
    icon: MdEmail,
    gradient: "from-purple-600 to-pink-600",
    subMenus: [
      {
        id: 21,
        title: "Due Emails",
        icon: MdEmail,
        subMenus: [
          { id: 211, title: "Due", href: "/marketing/due-email" },
          { id: 212, title: "Overdue", href: "/marketing/over-due-email" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Payment Links",
    icon: RiMoneyRupeeCircleLine,
    gradient: "from-purple-700 to-pink-700",
    subMenus: [
      { id: 31, title: "Payment Link", href: "/marketing/payment-link" },
    ],
  },
];

const Marketing = () => {
  const [openMenu, setOpenMenu] = useState({});

  const toggleMenu = (menuId) => {
    setOpenMenu((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // Compact menu rendering
  const renderCompactMenu = (menus, level = 0) => {
    return (
      <div className={`${level > 0 ? "ml-3 mt-2" : ""}`}>
        {menus.map((menu) => {
          const hasSubMenu = menu.subMenus && menu.subMenus.length > 0;
          const isOpen = openMenu[menu.id];

          return (
            <Fragment key={menu.id}>
              <div className={`mb-2 ${level > 0 ? "border-l-2 border-purple-200 pl-3" : ""}`}>
                <div
                  className={`bg-white/70 backdrop-blur-sm rounded-lg border border-purple-100/50 hover:border-purple-200 transition-all duration-200 overflow-hidden
                    ${level === 0 ? "shadow-sm hover:shadow-md" : "shadow-xs hover:shadow-sm"}`}
                >
                  <div
                    className={`flex items-center justify-between p-3 cursor-pointer
                      ${level === 0 ? `bg-gradient-to-r ${menu.gradient} text-white` : "hover:bg-purple-50"}`}
                    onClick={() => hasSubMenu && toggleMenu(menu.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                        ${level === 0 ? "bg-white/20" : "bg-purple-100"}`}
                      >
                        {typeof menu.icon === 'function' ? (
                          <menu.icon className={`w-4 h-4 ${level === 0 ? "text-white" : "text-purple-600"}`} />
                        ) : (
                          <menu.icon className={`w-4 h-4 ${level === 0 ? "text-white" : "text-purple-600"}`} />
                        )}
                      </div>
                      <div>
                        <h4 className={`font-medium ${level === 0 ? "text-white" : "text-gray-800"}`}>
                          {menu.title}
                        </h4>
                        {level === 0 && (
                          <p className="text-xs text-white/80 mt-0.5">
                            {menu.subMenus?.length || 0} modules
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {menu.href && (
                        <NavLink
                          to={menu.href}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-white" />
                        </NavLink>
                      )}
                      {hasSubMenu && (
                        <div className={`p-1.5 rounded-lg transition-colors
                          ${level === 0 ? "bg-white/20 hover:bg-white/30" : "bg-purple-100 hover:bg-purple-200"}`}
                        >
                          {isOpen ? (
                            <ChevronDown className={`w-4 h-4 ${level === 0 ? "text-white" : "text-purple-600"}`} />
                          ) : (
                            <ChevronRight className={`w-4 h-4 ${level === 0 ? "text-white" : "text-purple-600"}`} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {hasSubMenu && isOpen && (
                <div className="mt-2 space-y-1">
                  {renderCompactMenu(menu.subMenus, level + 1)}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex mt-20">
      <div className="flex min-h-screen w-full bg-gradient-to-b from-white/90 to-purple-50/90">
        <Sidebar />
        <div className="flex-1">
          <div className="p-6">
            {/* Compact Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Marketing Hub
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage campaigns and communications
              </p>
            </div>

            {/* Compact Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-purple-100/50 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">WhatsApp</p>
                    <p className="text-lg font-bold text-gray-900">Active</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-purple-100/50 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Email</p>
                    <p className="text-lg font-bold text-gray-900">Scheduled</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-pink-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-purple-100/50 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Payment Links</p>
                    <p className="text-lg font-bold text-gray-900">Ready</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Menu Cards */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-purple-100/50 shadow-sm p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Marketing Channels</h2>
              {renderCompactMenu(mainMenus)}
            </div>

            {/* Compact Tips */}
            <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-xl border border-purple-100/50 shadow-sm p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Quick Tips</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p className="text-xs text-gray-600">
                        WhatsApp for immediate engagement
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p className="text-xs text-gray-600">
                        Email for detailed communications
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p className="text-xs text-gray-600">
                        Payment links for better conversion
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;