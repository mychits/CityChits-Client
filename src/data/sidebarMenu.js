// ✅ CORRECTED IMPORTS (only what's actually used in the menu)
import { RiDashboardFill, RiAuctionLine, RiMoneyRupeeCircleLine } from "react-icons/ri";
import { SiQuicklook } from "react-icons/si";
import { UsergroupAddOutlined } from "@ant-design/icons";
import { IoIosPersonAdd, IoIosSettings, IoIosHelpCircle } from "react-icons/io";
import { IoPeopleOutline } from "react-icons/io5";
import { GrAnalytics } from "react-icons/gr";
import { CgWebsite } from "react-icons/cg";
import { 
  FaPeopleArrows, 
  FaHandshake, 
  FaClipboardList, 
  FaMapMarkedAlt, 
  FaUserTie, 
  FaGifts, 
  FaExclamationTriangle 
} from "react-icons/fa"; 
import { GoGraph } from "react-icons/go";
import { GiRoundTable, GiTakeMyMoney } from "react-icons/gi";
import { 
  MdOutlineGroups, 
  MdAccountBalanceWallet, 
  MdAdminPanelSettings 
} from "react-icons/md";
import { TbCoinRupeeFilled, TbReceiptRupee, TbSettings, TbGraph } from "react-icons/tb";
import { BiTransfer } from "react-icons/bi";
import { LuTarget } from "react-icons/lu";
import ids from "../data/ids";

const sidebarMenu = [

  {
    id: "cat_dashboard",
    title: "Dashboard & Analytics",
    icon: RiDashboardFill,
    activeColor: "primary",
    submenu: true,
    submenuItems: [
      { id: "$1", title: "Dashboard", icon: RiDashboardFill, activeColor: "primary", link: "/dashboard" },
      { id: "$!GPP", title: "AI Search", icon: SiQuicklook, link: "/quick-search" },
      { id: "$10", title: "Reports", icon: GrAnalytics, link: "/reports", activeColor: "primary" },
      { id: "$11", title: "Marketing", icon: GoGraph, link: "/marketing-menu", activeColor: "primary" },
    ],
  },


  {
    id: "cat_operations",
    title: "Customer Operations", 
    icon: IoPeopleOutline,
    activeColor: "custom-blue",
    submenu: true,
    submenuItems: [
      { id: "$3", title: "Groups", icon: IoIosPersonAdd, link: "/group", activeColor: "custom-blue" },
      { id: "$546", title: "Customers", icon: IoIosPersonAdd, link: "/customer-menu" },
      { id: "$4", title: "Enrollments", icon: FaPeopleArrows, link: "/enroll-menu" },
      { id: "$7", title: "Leads", icon: IoPeopleOutline, link: "/lead", activeColor: "primary" },
      { id: "$9856", title: "Legals", icon: FaHandshake, link: "/legals-menu" },
      { id: "$11", title: "Staff", icon: GiRoundTable, link: "/staff-menu" },
      { id: "$18", title: "Tasks", icon: FaClipboardList, link: "/task" },
      {id:"$9", title: "Target Management", icon: LuTarget, link: "/target-menu" },
      {id:"$70", title: "Penalty Monitor", icon: TbGraph, link: "/penalty-monitor" },
    ],
  },


  {
    id: "cat_finance",
    title: "Financial Management",
    icon: MdAccountBalanceWallet,
    activeColor: "custom-dark-green",
    submenu: true,
    submenuItems: [
      { id: "$#S", title: "Accounts", icon: MdAccountBalanceWallet, link: "/payment-menu/" },
      { id: "$7865", title: "Other Services", icon: GiTakeMyMoney, link: "/other-service-menu" },
      { id: "$8", title: "Auctions", icon: RiAuctionLine, link: "/auction", activeColor: "primary" },
      { id: "$2564", title: "Approvals", icon: FaExclamationTriangle, link: "/approval-menu" },
    ],
  },


  {
    id: "cat_admin",
    title: "Administration",
    icon: TbSettings,
    activeColor: "primary",
    submenu: true,
    submenuItems: [
      {
        id: "$199",
        title: "System Settings",
        icon: TbSettings,
        submenu: true,
        submenuItems: [
          { id: "#1", title: "Collection Areas", icon: FaMapMarkedAlt, link: "/collection-menu", hider: true },
          { id: "#2", title: "Access Groups", icon: MdOutlineGroups, hider: true, link: "/filter-groups" },
          { id: "#3", title: "HR Management", icon: FaUserTie, hider: true, link: "/hr-menu" },
          { id: "#4", title: "Transfers", icon: BiTransfer, hider: true, link: "/transfer-menu" },
          { id: "#5", title: "Rewards Program", icon: FaGifts, hider: true, link: "/reward-menu" },
        ],
      },
      {
        id: "$13",
        title: "External Portals",
        icon: CgWebsite,
        activeColor: "primary",
        submenu: true,
        submenuItems: [
          { id: "ext_gold", title: "Gold Admin Portal", icon: TbCoinRupeeFilled, newTab: true, link: "http://prod-new-gold-chit.s3-website.eu-north-1.amazonaws.com/" },
          { id: "ext_chit_plans", title: "Chit Plans Admin", icon: RiMoneyRupeeCircleLine, newTab: true, link: "https://erp.admin.mychits.co.in/chit-enrollment-plan/admin/" },
          { id: "ext_enrollment", title: "Enrollment Requests", icon: TbReceiptRupee, newTab: true, link: "https://erp.admin.mychits.co.in/src/request/enrollment.php?user-role=&user-code=" },
        ],
      },
      { id: "$14", title: "Lead Settings", icon: IoIosSettings, link: "/lead-setting", activeColor: "custom-dark-green" },
      { id: "$16", title: "Help & Support", icon: IoIosHelpCircle, link: "/help", activeColor: "primary" },
      { id: "admin_support", title: "Admin Support", icon: MdAdminPanelSettings, isHeading: true, link: "/supports" },
    ],
  },
];

export default sidebarMenu;