import { RiDashboardFill } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { UsergroupAddOutlined } from "@ant-design/icons";
import { IoIosPersonAdd } from "react-icons/io";
import { BsCash } from "react-icons/bs";
import { GrAnalytics } from "react-icons/gr";
import { CgProfile, CgWebsite } from "react-icons/cg";
import { IoIosSettings } from "react-icons/io";
import { IoIosHelpCircle } from "react-icons/io";
import { RiAuctionLine } from "react-icons/ri";
import { FaPeopleArrows, FaUserLock } from "react-icons/fa";
import { IoPeopleOutline } from "react-icons/io5";
import { GoGraph } from "react-icons/go";

const sidebarMenu = [
	{
		id: "$1",
		title: "Dashboard",
		icon: RiDashboardFill,
		activeColor: "primary",
		link: "/dashboard",
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
		id: "$4",
		title: "Customers ",
		icon: IoIosPersonAdd,
		link: "/user",
		activeColor: "custom-yellow",
	},
	{
		id: "$5",
		title: "Enrollments ",
		icon: FaPeopleArrows,
		link: "/enrollment",
		activeColor: "primary",
	},
	{
		id: "$6",
		title: "Employees",
		icon: FaUserLock,
		link: "/agent",
		activeColor: "custom-violet",
	},
	{
		id: "$7",
		title: "Leads",
		icon: IoPeopleOutline,
		link: "/lead",
		activeColor: "primary",
	},
	{
		id: "$8",
		title: "Auctions ",
		icon: RiAuctionLine,
		link: "/auction",
		activeColor: "primary",
	},
	{
		id: "$9",
		title: "Payments ",
		icon: BsCash,
		link: "/payment",
		activeColor: "custom-green",
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
