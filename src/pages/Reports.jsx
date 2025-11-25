import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaCalendarDays,
  FaPeopleGroup,
  FaPeopleArrows,
  FaUserCheck,
  FaUserTie,
} from "react-icons/fa6";
import {
  MdOutlineEmojiPeople,
  MdOutlineReceiptLong,
  MdMan,
} from "react-icons/md";
import { FaPersonWalkingArrowLoopLeft } from "react-icons/fa6";
import { RiMoneyRupeeCircleFill, RiAuctionFill } from "react-icons/ri";
import { LiaCalculatorSolid } from "react-icons/lia";
import { GiMoneyStack } from "react-icons/gi";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlinePayment } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
import { RiReceiptLine } from "react-icons/ri";
import { TbUserCancel } from "react-icons/tb";
import { SlCalender } from "react-icons/sl";
import { MdOutlinePending } from "react-icons/md";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { useState, useMemo } from "react";
import { MdOutlinePayments } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { BsCalculator } from "react-icons/bs";
import { MdCalendarMonth } from "react-icons/md";
const GlobalSearchChangeHandler = (e) => {
  const { value } = e.target;
  setSearchText(value);
};

const subMenus = [
  { 
    title: "Daybook", 
    link: "/reports/daybook", 
    Icon: FaCalendarDays,
    category: "General",
    color: "from-violet-500 to-violet-600",
  },
  { 
    title: "Group Report", 
    link: "/reports/group-report", 
    Icon: FaPeopleGroup,
    category: "Customer",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Enrollment Report",
    link: "/reports/enrollment-report",
    Icon: FaPeopleArrows,
    category: "Customer",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    title: "All Customer Report",
    link: "/reports/all-user-report",
    Icon: FaPersonWalkingArrowLoopLeft,
    category: "Customer",
    color: "from-pink-500 to-pink-600",
  },
  {
    title: "Customer Report",
    link: "/reports/user-report",
    Icon: MdOutlineEmojiPeople,
    category: "Customer",
    color: "from-rose-500 to-rose-600",
  },
     {
    id:"&*DD",
    title: "Pigmy Summary Report",
    link: "/reports/pigmy-summary-report",
    Icon: BsCalculator ,
    category: "Customer",
    color: "from-violet-500 to-violet-600",
  },
  {
    id:"7",
    title: "Customer Loan Report",
    link: "/reports/customer-loan-report",
    Icon: GiMoneyStack,
    category: "Finance",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    title: "Holded Customers",
    link: "/reports/holded-customer-report",
    Icon: TbUserCancel,
    category: "Customer",
    color: "from-amber-500 to-amber-600",
  },
  {
    title: "Collection Executive Report",
    link: "/reports/collection-executive",
    Icon: TbMoneybag,
    category: "Finance",
    color: "from-emerald-500 to-emerald-600",
  },
      {
    id:"27",
    title: "Unverified Customer Report",
    link: "/reports/unverified-customer-report",
    category: "Customer",
   Icon: MdCancel,
   color: "from-violet-500 to-violet-600",
  },
     {
     id:"&&%",
    title: "Payment Report",
    link: "/reports/payment-report",
    Icon: MdOutlinePayments ,
    category: "Reports",
    color: "from-yellow-500 to-pink-600",
  },
  {
    id:"10",
    title: "Collection Area Report",
    link: "/reports/collection-area-report",
    Icon: TbMoneybag,
    category: "Finance",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Employee Report",
    link: "/reports/employee-report",
    Icon: FaUserTie,
    category: "Employee",
    color: "from-sky-500 to-sky-600",
  },
  {
    title: "Commission Report",
    link: "/reports/commission-report",
    Icon: RiMoneyRupeeCircleFill,
    category: "Finance",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    title: "Receipt Report",
    link: "/reports/receipt",
    Icon: MdOutlineReceiptLong,
    category: "Finance",
    color: "from-lime-500 to-lime-600",
  },
  {
    title: "Registration Receipt",
    link: "/reports/registration-fee-receipt",
    Icon: RiReceiptLine,
    category: "Finance",
    color: "from-teal-500 to-teal-600",
  },
  {
    title: "PayOut Report",
    link: "/reports/payout",
    Icon: MdOutlinePayment,
    category: "Finance",
    color: "from-orange-500 to-orange-600",
  },
  {
    id:"15",
    title: "Outstanding Report",
    link: "/reports/outstanding-report",
    Icon: MdOutlinePending,
    category: "Finance",
    color: "from-red-500 to-red-600",
  },
  {
    title: "Auction Report",
    link: "/reports/auction-report",
    Icon: RiAuctionFill,
    category: "Finance",
    color: "from-violet-500 to-violet-600",
  },
  { 
    title: "Lead Report", 
    link: "/reports/lead-report", 
    Icon: MdMan,
    category: "Sales",
    color: "from-fuchsia-500 to-fuchsia-600",
  },
  {
    title: "Pigme Report",
    link: "/reports/pigme-report",
    Icon: LiaCalculatorSolid,
    category: "Finance",
    color: "from-slate-500 to-slate-600",
  },
  { 
    title: "Loan Report", 
    link: "/reports/loan-report", 
    Icon: GiMoneyStack,
    category: "Finance",
    color: "from-zinc-500 to-zinc-600",
  },
  { 
    title: "Sales Report", 
    link: "/reports/sales-report", 
    Icon: FaUserCheck,
    category: "Sales",
    color: "from-stone-500 to-stone-600",
  },
  { 
    title: "Payment Summary", 
    link: "/reports/payment-summary", 
    Icon: TbReportSearch,
    category: "Finance",
    color: "from-neutral-500 to-neutral-600",
  },
  { 
    title: "Monthly Installment Turnover", 
    link: "/reports/monthly-install-turnover", 
    Icon: SlCalender,
    category: "Finance",
    color: "from-gray-500 to-gray-600",
  },
  {
    title: "Monthly Attendance Report",
    link: "/reports/employee-monthly-report",
    Icon: SlCalender,
    category: "Employee",
    color: "from-violet-600 to-violet-700",
  },
  {
    id:"24",
    title: "Payout Salary Report",
    link: "/reports/payout-salary-report",
    category: "Employee",
    Icon: HiOutlineBanknotes,
    color: "from-indigo-600 to-indigo-700",
  },

      {
    id:"28",
    title: "Remaining Salary Report",
    link: "/reports/salary-remaining",
    category: "Employee",
   Icon: MdCancel,
   color: "from-violet-500 to-violet-600",
  },
     {
    id:"29",
    title: "Chit Asking Month Report",
    link: "/reports/chit-asking-month-report",
    category: "Customer",
   Icon: MdCalendarMonth,
   color: "from-violet-500 to-violet-600",
  },
     {
    id:"30",
    title: "Non Converted Lead Report",
    link: "/reports/non-converted-lead-report",
    category: "Customer",
   Icon: MdCalendarMonth,
   color: "from-violet-500 to-violet-600",
  },
    {
    id:"30",
    title: "Converted Lead Report",
    link: "/reports/converted-lead-report",
    category: "Customer",
   Icon: MdCalendarMonth,
   color: "from-violet-500 to-violet-600",
  },

];

const Reports = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(subMenus.map(menu => menu.category))];
    return cats;
  }, []);

  // Filter reports based on search text and selected category
  const filteredReports = useMemo(() => {
    return subMenus.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === "All" || report.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex mt-20">
        <Sidebar />
        <Navbar
          onGlobalSearchChangeHandler={GlobalSearchChangeHandler}
          visibility={true}
        />

        <div className="flex-1 p-6">
          {location.pathname === "/reports" ? (
            <>
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports Dashboard</h1>
                <p className="text-gray-600">Access and generate various business reports</p>
              </div>

              {/* Search and Filter Section */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search reports..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                      <svg
                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedCategory === category
                            ? "bg-violet-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reports Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredReports.map(({ title, Icon, link, color }) => (
                  <div
                    key={link}
                    onClick={() => navigate(link)}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
                  >
                    <div className={`h-2 bg-gradient-to-r ${color}`}></div>
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md`}>
                          <Icon className="text-xl" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-violet-600 transition-colors">
                        {title}
                      </h3>
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <span>View Report</span>
                        <svg
                          className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No reports found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;