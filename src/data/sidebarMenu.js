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
import { MdAccountBalanceWallet } from "react-icons/md";
import { LuTarget } from "react-icons/lu";

import { FaExclamationTriangle } from "react-icons/fa";

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
    id: ids.three,
    title: "Customers",
    icon: IoIosPersonAdd ,
   link: "/customer-menu",
    // submenu: true,
    // submenuItems: [
    //   {
    //     id: "$101#",
    //     title: "Customers",
    //     icon: <IoIosPersonAdd size={20} />,
    //     link: "/user",
    //   },
    //   {
    //     id: "&*&",
    //     title: "Unverified Customers",
    //     icon: <MdCancel size={25} />,
    //     link: "/un-approved-customer",
    //   },
    // ],
    
  },
	{
		id: "$4",
		title: "Enrollments ",
		icon: FaPeopleArrows,
		link: "/enroll-menu",	
		//  submenu: true,
		// submenuItems: [
		//   {
		//     id: "$101#%",
		//     title: "Enrollments",
		//     icon: <FaPeopleArrows size={20} />,
		//     link: "/enrollment",
		//   },
		//   {
		//     id: "$83",
		//     title: "Mobile Enrollments",
		//     icon: <FaMobileAlt size={25} />,
		//     link: "/mobile-app-enroll",
		//   },
		// ],
	},


  {
    id: "$9856",
    title: "Legals ",
    icon: FaHandshake,
    link: "/legals-menu"
//      submenu: true,
//     submenuItems: [
//   {
//     id: "$67",
//     title: "Guarantor ",
//     icon: <FaHandshake />,
//     link: "/guarantor",
//   },
// ],
  },

	{
		id: ids.seven,
		title: "Staff",
		icon: GiRoundTable,
		link: "/staff-menu"
	},
	{
		id: "$18",
		title: "Tasks",
		icon: FaClipboardList,
		link: "/task",
	},

	 {
      title: "Target Management",
      icon: LuTarget,
     // submenu: true,
      link: "/target-menu"
      // submenuItems: [
      //   {
      //     title: "Target",
      //     icon: <TbTargetArrow />,
      //     link: "/target",
      //   },
      // ],
    },

	{
		id: "$7",
		title: "Leads",
		icon: IoPeopleOutline,
		link: "/lead",
		activeColor: "primary",
	},


  {
    id: "$7865",
    title: "Other Services",
    icon: GiTakeMyMoney,
   link: "/other-service-menu",
//     submenu: true,
//     submenuItems: [
//   {
//     id: "$8",
//     title: "Loans",
//     icon: <GiTakeMyMoney size={20} />,
//     link: "/loan",
//   },
//   {
//     id: "$9",
//     title: "Pigme",
//     icon: <PiCalculatorBold size={20} />,
//     link: "/pigme",
//   },
// ],
},

 {
    id: "$2564",
    title: "Approvals",
    icon: FaExclamationTriangle,
    link: "/approval-menu",
  },
	{
		id: "$8",
		title: "Auctions ",
		icon: RiAuctionLine,
		link: "/auction",
		activeColor: "primary",
	},
 {
    id: "$#S",
    title: "Accounts",
    icon: MdAccountBalanceWallet,
    link: "/payment-menu/"
   // submenu: true,
   // submenuItems: [
     // {
        // id: "&^$1",
        // title: "Payments ",
        // icon: <BsCash size={20} />,
        // link: "/payment-in-out-menu"
        // submenu: true,
        // submenuItems: [
        //   {
        //     id: "&^$2",
        //     title: "Pay-In ",
        //     icon: <TbReceiptRupee size={20} />,
        //     link: "/pay-in-menu",
        //   },
        //   {
        //     id: "&^$3",
        //     title: "Pay-Out ",
        //     icon: <RiMoneyRupeeCircleLine size={20} />,
        //     link: "/pay-out-menu",
        //   },
        // ],
     // },
  //  ],
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
					// {
					// 	id: ids.fifteen,
					// 	title: "Collection Mapping",
					// 	icon: RiUserLocationFill,
					// 	link: "/collection-area-mapping",
					// },
				],
			},
			// {
			// 	id: "#2",
			// 	title: "Groups",
			// 	icon: MdOutlineGroups,
			// 	hider: true,
			// 	newTab: true,
			// 	submenu: true,
			// 	submenuItems: [
			// 		{
			// 			id: ids.sixteen,
			// 			title: "Mobile Access Groups",
			// 			icon: FaFilter,
			// 			link: "/filter-groups",
			// 		},
			// 	],
			// },
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
				link: "http://prod-new-gold-chit.s3-website.eu-north-1.amazonaws.com/",
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
