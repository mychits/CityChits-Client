import { RiDashboardFill } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { UsergroupAddOutlined } from "@ant-design/icons";
import { IoIosPersonAdd } from "react-icons/io";

import { GrAnalytics } from "react-icons/gr";
import { CgProfile, CgWebsite } from "react-icons/cg";
import { IoIosSettings } from "react-icons/io";
import { IoIosHelpCircle } from "react-icons/io";
import { RiAuctionLine } from "react-icons/ri";
import { FaPeopleArrows, FaUserLock } from "react-icons/fa";
import { IoPeopleOutline } from "react-icons/io5";
import { GoGraph } from "react-icons/go";
import { SiQuicklook } from "react-icons/si";
import { FaPersonMilitaryPointing } from "react-icons/fa6";
import { GiRoundTable } from "react-icons/gi";
import { FaUserTie } from "react-icons/fa6";
import { HiOutlineUserGroup } from "react-icons/hi";
import ids from "../data/ids";
import { MdCancel } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { TbCoinRupeeFilled } from "react-icons/tb";
import { TbReceiptRupee } from "react-icons/tb";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { TbSettings } from "react-icons/tb";
import { HiCurrencyRupee } from "react-icons/hi2";
import { FaMapLocationDot } from "react-icons/fa6";
import { RiUserLocationFill } from "react-icons/ri";
import { MdOutlineGroups } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { BiTransfer } from "react-icons/bi";
import { GrUserSettings } from "react-icons/gr";
import { GiTakeMyMoney } from "react-icons/gi";
import { PiCalculatorBold } from "react-icons/pi";
import { FaMobileAlt } from "react-icons/fa";



const sidebarMenu = [
	{
		id: "$1",
		title: "Dashboard",
		icon: RiDashboardFill,
		activeColor: "primary",
		link: "/dashboard",
	},

	{
		id: "$!GPP",
		title: "AI Search",
		icon: SiQuicklook,
		link: "/quick-search",
	},

	{
		id: "$2",
		title: "Analytics",
		icon: SiGoogleanalytics,
		link: "/analytics",
		activeColor: "primary",
	},
	{
		id: "$3",
		title: "Groups ",
		icon: UsergroupAddOutlined,
		link: "/group",
		activeColor: "custom-blue",
	},
	{
  id: "$4-main",
  title: "Customers",
  icon: IoIosPersonAdd,
  activeColor: "custom-yellow",
  submenu: true,
  submenuItems: [
    {
      id: "$4",
      title: "All Customers",
      icon: IoIosPersonAdd,
      link: "/user",
    },
    {
      id: "&*&",
      title: "Unverified Customers",
      icon: MdCancel,
      link: "/un-approved-customer",
    },
  ],
},

	
{
  id: "$5-main",
  title: "Enrollments",
  icon: FaPeopleArrows,
  activeColor: "primary",
  submenu: true,
  submenuItems: [
    {
      id: "$5",
      title: "All Enrollments",
      icon: FaPeopleArrows,
      link: "/enrollment",
    },
    {
      id: "$83",
      title: "Mobile Enrollments",
      icon: FaMobileAlt,
      link: "/mobile-app-enroll",
    },
  ],
},

{
  id: "$legal-main",
  title: "Legals",
  icon: FaUserLock, 
  activeColor: "primary",
  submenu: true,
  submenuItems: [
    {
      id: "$67",
      title: "Guarantor",
      icon: FaHandshake,
      link: "/guarantor",
    },
  ],
},

	{
		id: ids.seven,
		title: "Staff",
		icon: GiRoundTable,
		submenu: true,
		submenuItems: [
			{
				id: "$101",
				title: "All",
				icon: HiOutlineUserGroup,
				link: "/staff",
			},
			{
				id: "$102",
				title: "Agent",
				icon: FaPersonMilitaryPointing,
				link: "/agent",
			},
			{
				id: "$103",
				title: "Employee",
				icon: FaUserTie,
				link: "/employee",
			},
		],
	},
	{
		id: "$18",
		title: "Tasks",
		icon: FaClipboardList,
		link: "/task",
	},
	{
		id: "$7",
		title: "Leads",
		icon: IoPeopleOutline,
		link: "/lead",
		activeColor: "primary",
	},


{
  id: "$services-main",
  title: "Other Services",
  icon: GiTakeMyMoney, 
  activeColor: "primary",
  submenu: true,
  submenuItems: [
    {
      id: "$8",
      title: "Loans",
      icon: GiTakeMyMoney,
      link: "/loan",
    },
    {
      id: "$9",
      title: "Pigme",
      icon: PiCalculatorBold,
      link: "/pigme",
    },
  ],
},


	{
		id: "$8",
		title: "Auctions ",
		icon: RiAuctionLine,
		link: "/auction",
		activeColor: "primary",
	},
	{
		id: "",
		title: "Payments",
		icon: TbCoinRupeeFilled,
		submenu: true,
		submenuItems: [

			{
				id: "",
				title: "Pay-In ",
				icon: TbReceiptRupee,
				link: "/pay-in-menu",
			},
			{
				id: "",
				title: "Pay-Out ",
				icon: RiMoneyRupeeCircleLine,
				link: "/pay-out-menu",
			},


		],
	},
	{
		id: "$10",
		title: "Reports",
		icon: GrAnalytics,
		link: "/reports",
		activeColor: "primary",
	},
	{
		id: "$11",
		title: "Marketing",
		icon: GoGraph,
		link: "/marketing",
		activeColor: "primary",
	},

	{
		id: "$199",
		title: "General Settings",
		icon: TbSettings,
		submenu: true,
		submenuItems: [
			{
				id: "#1",
				title: "Collection",
				icon: HiCurrencyRupee,
				hider: true,
				newTab: true,
				submenu: true,
				submenuItems: [
					{
						id: ids.fourteen,
						title: "Collection Area",
						icon: FaMapLocationDot,
						link: "/collection-area-request",
					},
					{
						id: ids.fifteen,
						title: "Collection Mapping",
						icon: RiUserLocationFill,
						link: "/collection-area-mapping",
					},
				],
			},
			{
				id: "#2",
				title: "Groups",
				icon: MdOutlineGroups,
				hider: true,
				newTab: true,
				submenu: true,
				submenuItems: [
					{
						id: ids.sixteen,
						title: "Mobile Access Groups",
						icon: FaFilter,
						link: "/filter-groups",
					},
				],
			},
			{
				id: "#3",
				title: "Employee",
				hider: true,
				icon: FaUserTie,
				newTab: true,
				submenu: true,
				submenuItems: [
					{
						id: "#206",
						title: "Employee Profile",
						icon: GrUserSettings,
						link: "/employee-profile",
					},
				],
			},
			{
				id: "#3",
				title: "Transfer",
				hider: true,
				icon: BiTransfer,
				newTab: true,
				submenu: true,
				submenuItems: [
					{
						id: "#206",
						title: "Soft Transfer",
						icon: GrUserSettings,
						link: "/soft-transfer",

					},
					{
						id: "#206",
						title: "Hard Transfer",
						icon: GrUserSettings,
						link: "/hard-transfer",

					},
				],
			},
		],
	},
	{
		id: "$12",
		title: "Profile",
		icon: CgProfile,
		link: "/profile",
		activeColor: "primary",
	},
	{
		id: "$13",
		title: "Other Sites",
		icon: CgWebsite,
		activeColor: "primary",
		submenu: true,
		submenuItems: [
			{
				id: "#1",
				title: "Gold Admin",
				newTab: true,
				link: "http://gold-admin-web.s3-website.eu-north-1.amazonaws.com/",
				activeColor: "primary",
			}, // External link
			{
				id: "#2",
				newTab: true,
				title: "Chit Plans Admin",
				link: "https://erp.admin.mychits.co.in/chit-enrollment-plan/admin/",
				activeColor: "primary",
			}, // External link
			{
				id: "#3",
				newTab: true,
				title: "Chit Enrollment Request",
				link: "https://erp.admin.mychits.co.in/src/request/enrollment.php?user-role=&user-code=",
				activeColor: "primary",
			}, // External link
			// { title: "Consolidated", link: "/consolidate" },
		],
	},
	{
		id: "$14",
		title: "Setting",
		icon: IoIosSettings,
		link: "/lead-setting",
		activeColor: "custom-dark-green",
	},
	{
		id: "$16",
		title: "Help & Support",
		icon: IoIosHelpCircle,
		link: "/help",
		activeColor: "primary",
	},
];

export default sidebarMenu;
