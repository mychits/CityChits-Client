import Sidebar from "../components/layouts/Sidebar";
import { MdGroups, MdOutlinePayments, MdGroupWork } from "react-icons/md";
import { FaUserLock, FaClipboardList } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../instance/TokenInstance";
import Navbar from "../components/layouts/Navbar";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";

// Professional StatCard component
const StatCard = ({ card, onViewDetails, index }) => (
  <div 
    className="transform transition-all duration-300 hover:scale-[1.02] min-w-0"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="relative h-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${card.iconBg}`}>
          <card.icon className={`w-6 h-6 ${card.iconColor}`} />
        </div>
        <div className="flex items-center">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
            Active
          </span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {card.title}
      </h3>
      
      <p className="text-sm text-gray-500 mb-4">
        {card.subtitle}
      </p>

      <div className="mb-4">
        <span className={`text-3xl font-bold ${card.textColor}`}>
          {card.value}
        </span>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Last updated: Just now
          </span>
          <button
            onClick={() => onViewDetails(card.redirect)}
            className={`px-3 py-1.5 rounded-md font-medium text-sm ${card.buttonBg} ${card.buttonText} transition-colors duration-200`}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Professional password modal
const PasswordPrompt = ({
  isVisible,
  onClose,
  onVerify,
  selectedRedirect,
  passwordInput,
  setPasswordInput,
  errorMsg,
  isLoading,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl z-10">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Authentication Required
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-sm text-gray-700">
              Please enter your admin password to access{" "}
              <span className="font-medium">
                {selectedRedirect}
              </span>
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onVerify()}
              placeholder="Enter your password"
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errorMsg && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errorMsg}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onVerify}
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional empty state
const EmptyState = ({ searchValue }) => (
  <div className="col-span-full">
    <div className="flex flex-col items-center justify-center py-12 px-6 rounded-lg bg-gray-50 border border-gray-200">
      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No Results Found
      </h3>
      <p className="text-gray-500 text-center">
        We couldn't find any matches for "{searchValue}"
      </p>
      <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms</p>
    </div>
  </div>
);

const Home = () => {
  const [dashboardData, setDashboardData] = useState({
    groups: [],
    users: [],
    agents: [],
    staffs: [],
    employees: [],
    enrollmentsCount: 0,
    paymentsValue: 0,
    paymentsPerMonthValue: 0,
  });

  const [searchValue, setSearchValue] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [showRevenue, setShowRevenue] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });

  const [passwordPrompt, setPasswordPrompt] = useState({
    visible: false,
    selectedRedirect: "",
    password: "",
    error: "",
    loading: false,
  });

  const navigate = useNavigate();

  const handleGlobalSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  const handleViewDetailsClick = useCallback((redirect) => {
    setPasswordPrompt({
      visible: true,
      selectedRedirect: redirect,
      password: "",
      error: "",
      loading: false,
    });
  }, []);

  const closePasswordPrompt = useCallback(() => {
    setPasswordPrompt((prev) => ({
      ...prev,
      visible: false,
      password: "",
      error: "",
    }));
  }, []);

  const verifyPasswordAndRedirect = useCallback(async () => {
    setPasswordPrompt((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const admin = JSON.parse(localStorage.getItem("admin"));
      if (!admin?.phoneNumber) {
        setPasswordPrompt((prev) => ({
          ...prev,
          error: "No admin contact found. Please login again.",
          loading: false,
        }));
        return;
      }

      const response = await api.post("/admin/login", {
        phoneNumber: admin.phoneNumber,
        password: passwordPrompt.password,
      });

      if (response.data?.token) {
        if (
          passwordPrompt.selectedRedirect === "/total-revenue" ||
          passwordPrompt.selectedRedirect === "/monthly-revenue"
        ) {
          setShowRevenue(true);
          setTimeout(() => setShowRevenue(false), 30000);
        }

        navigate(passwordPrompt.selectedRedirect);
        closePasswordPrompt();
      }
    } catch (err) {
      setPasswordPrompt((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Password verification failed",
        loading: false,
      }));
    }
  }, [passwordPrompt.password, passwordPrompt.selectedRedirect, navigate, closePasswordPrompt]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          groupsRes,
          usersRes,
          agentsRes,
          staffsRes,
          employeesRes,
          enrollmentsRes,
          totalPaymentsRes,
        ] = await Promise.all([
          api.get("/group/get-group-admin"),
          api.get("/user/get-user"),
          api.get("/agent/get"),
          api.get("/agent/get-agent"),
          api.get("/agent/get-employee"),
          api.get("/enroll/get-enroll"),
          api.get("/payment/get-total-payment-amount"),
        ]);

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const lastDayFormatted = lastDay.toISOString().split("T")[0];

        const monthlyPaymentsRes = await api.get(
          "/payment/get-current-month-payment",
          {
            params: {
              from_date: firstDay,
              to_date: lastDayFormatted,
            },
          }
        );

        setDashboardData({
          groups: groupsRes.data || [],
          users: usersRes.data || [],
          agents: agentsRes.data?.agent || [],
          staffs: staffsRes.data || [],
          employees: employeesRes.data?.employee || [],
          enrollmentsCount: Array.isArray(enrollmentsRes.data)
            ? enrollmentsRes.data.length
            : 0,
          paymentsValue: totalPaymentsRes?.data?.totalAmount || 0,
          paymentsPerMonthValue: monthlyPaymentsRes?.data?.monthlyPayment || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setAlertConfig({
          visibility: true,
          message: "Failed to load dashboard data",
          type: "error",
        });
      }
    };

    fetchAllData();
  }, [reloadTrigger]);

  const getMaskedValue = (value) => {
    return showRevenue ? value.toLocaleString() : "•••••";
  };

  const cardData = [
    {
      icon: MdGroupWork,
      title: "Chit Groups",
      value: dashboardData.groups.length,
      subtitle: "Active business units",
      color: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      textColor: "text-indigo-600",
      buttonBg: "bg-indigo-50 hover:bg-indigo-100",
      buttonText: "text-indigo-700",
      redirect: "/group",
      key: "1",
    },
    {
      icon: MdGroups,
      title: "Customers",
      value: dashboardData.users.length,
      subtitle: "Total registered users",
      color: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      textColor: "text-amber-600",
      buttonBg: "bg-amber-50 hover:bg-amber-100",
      buttonText: "text-amber-700",
      redirect: "/user",
      key: "2",
    },
    {
      icon: FaClipboardList,
      title: "Total Enrollments",
      value: dashboardData.enrollmentsCount.toLocaleString(),
      subtitle: "Active enrollments this period",
      color: "from-teal-500 to-teal-600",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      textColor: "text-teal-600",
      buttonBg: "bg-teal-50 hover:bg-teal-100",
      buttonText: "text-teal-700",
      redirect: "/enrollment",
      key: "8",
    },
    {
      icon: FaUserLock,
      title: "Agents",
      value: dashboardData.agents.length,
      subtitle: "Field representatives",
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      textColor: "text-purple-600",
      buttonBg: "bg-purple-50 hover:bg-purple-100",
      buttonText: "text-purple-700",
      redirect: "/staff-menu/agent",
      key: "3",
    },
    {
      icon: FaUserLock,
      title: "Employees",
      value: dashboardData.employees.length,
      subtitle: "Organization workforce",
      color: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      textColor: "text-orange-600",
      buttonBg: "bg-orange-50 hover:bg-orange-100",
      buttonText: "text-orange-700",
      redirect: "/staff-menu/employee-menu",
      key: "5",
    },
    {
      icon: MdOutlinePayments,
      title: "Total Revenue",
      value: getMaskedValue(dashboardData.paymentsValue),
      subtitle: "All-time earnings",
      color: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-600",
      buttonBg: "bg-emerald-50 hover:bg-emerald-100",
      buttonText: "text-emerald-700",
      redirect: "/total-revenue",
      key: "6",
    },
    {
      icon: SlCalender,
      title: "Monthly Revenue",
      value: getMaskedValue(dashboardData.paymentsPerMonthValue),
      subtitle: "Current billing cycle",
      color: "from-sky-500 to-sky-600",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
      textColor: "text-sky-600",
      buttonBg: "bg-sky-50 hover:bg-sky-100",
      buttonText: "text-sky-700",
      redirect: "/monthly-revenue",
      key: "7",
    },
  ].filter(
    (card) =>
      card.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      card.subtitle.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="min-h-screen mt-20  bg-gray-50">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>

      <div className="flex">
        <Sidebar />
        <Navbar
          onGlobalSearchChangeHandler={handleGlobalSearchChange}
          visibility={true}
        />
        <CustomAlertDialog
          type={alertConfig.type}
          isVisible={alertConfig.visibility}
          message={alertConfig.message}
          onClose={() =>
            setAlertConfig((prev) => ({ ...prev, visibility: false }))
          }
        />

        <div className="flex-1 p-4 md:p-8 md:ml-16 md:mr-11 md:mt-11 pb-8">
          {/* Professional Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Dashboard
                </h1>
                <p className="text-gray-600">
                  Monitor your organization's key metrics and performance indicators
                </p>
              </div>
             
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cardData.map((card, index) => (
              <StatCard
                key={card.key}
                card={card}
                index={index}
                onViewDetails={handleViewDetailsClick}
              />
            ))}
          </div>

          {cardData.length === 0 && <EmptyState searchValue={searchValue} />}
        </div>
      </div>

      <PasswordPrompt
        isVisible={passwordPrompt.visible}
        onClose={closePasswordPrompt}
        onVerify={verifyPasswordAndRedirect}
        selectedRedirect={passwordPrompt.selectedRedirect}
        passwordInput={passwordPrompt.password}
        setPasswordInput={(value) =>
          setPasswordPrompt((prev) => ({ ...prev, password: value }))
        }
        errorMsg={passwordPrompt.error}
        isLoading={passwordPrompt.loading}
      />
    </div>
  );
};

export default Home;