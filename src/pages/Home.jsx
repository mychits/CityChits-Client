import Sidebar from "../components/layouts/Sidebar";
import { MdGroups, MdOutlinePayments, MdGroupWork } from "react-icons/md";
import { FaUserLock, FaClipboardList } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../instance/TokenInstance";
import Navbar from "../components/layouts/Navbar";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";

const Home = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [paymentsValue, setPaymentsValue] = useState(0);
  const [paymentsPerMonthValue, setPaymentsPerMonthValue] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [hidePayment, setHidePayment] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [enrollmentsCount, setEnrollmentsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });

  const navigate = useNavigate();

  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [selectedRedirect, setSelectedRedirect] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);

  const GlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const handleViewDetailsClick = (redirect) => {
    setSelectedRedirect(redirect);
    setShowPasswordPrompt(true);
    setErrorMsg(""); 
  };

  const verifyPasswordAndRedirect = async () => {
    setIsLoadingVerify(true); 
    setErrorMsg(""); 
    try {
      const admin = JSON.parse(localStorage.getItem("admin"));
      if (!admin?.phoneNumber) {
        setErrorMsg("No admin contact found. Please login again.");
        setIsLoadingVerify(false);
        return;
      }

      const response = await api.post("/admin/login", {
        phoneNumber: admin.phoneNumber,
        password: passwordInput,
      });

      if (response.data?.token) {
        setShowPasswordPrompt(false);
        setPasswordInput("");
        setErrorMsg("");
        
        // Special handling for revenue pages
        if (selectedRedirect === "/total-revenue" || selectedRedirect === "/monthly-revenue") {
          setShowRevenue(true);
          setTimeout(() => setShowRevenue(false), 30000); // Hide after 30 seconds
        }
        
        navigate(selectedRedirect);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Password verification failed");
    } finally {
      setIsLoadingVerify(false); 
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const userObj = JSON.parse(user);
    if (
      userObj &&
      userObj.admin_access_right_id?.access_permissions?.edit_payment
    ) {
      const isModify =
        userObj.admin_access_right_id?.access_permissions?.edit_payment ===
        "true";
      setHidePayment(isModify);
    }
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/group/get-group-admin");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroups();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await api.get("/enroll/get-enroll");
        setEnrollmentsCount(Array.isArray(response.data) ? response.data.length : 0);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        setEnrollmentsCount(0);
      }
    };
    fetchEnrollments();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user/get-user");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUsers();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get("/agent/get");
        setAgents(response.data?.agent || []);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await api.get("/agent/get-agent");
        setStaffs(response.data || []);
      } catch (error) {
        console.error("Error fetching staffs:", error);
      }
    };
    fetchStaffs();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/agent/get-employee");
        setEmployees(response.data?.employee || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchTotalPayments = async () => {
      try {
        const response = await api.get("/payment/get-total-payment-amount");
        setPaymentsValue(response?.data?.totalAmount || 0);
      } catch (error) {
        console.error("Error fetching total payment amount:", error);
      }
    };
    fetchTotalPayments();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchMonthlyPayments = async () => {
      try {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const lastDayFormatted = lastDay.toISOString().split("T")[0];

        const response = await api.get("/payment/get-current-month-payment", {
          params: {
            from_date: firstDay,
            to_date: lastDayFormatted,
          },
        });

        setPaymentsPerMonthValue(response?.data?.monthlyPayment || 0);
      } catch (error) {
        console.error("Error fetching monthly payment data:", error);
      }
    };
    fetchMonthlyPayments();
  }, [reloadTrigger]);

  // Function to mask revenue values
  const getMaskedValue = (value) => {
    if (showRevenue) {
      return value.toLocaleString();
    }
    return "•••••";
  };

  const cardData = [
    {
      icon: MdGroupWork,
      title: "Chit Groups",
      value: groups.length,
      subtitle: "Active business units",
      color: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-600",
      ringColor: "ring-indigo-500/20",
      redirect: "/group",
      key: "1",
    },
    {
      icon: MdGroups,
      title: "Customers",
      value: users.length,
      subtitle: "Total registered users",
      color: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      borderColor: "border-amber-600",
      ringColor: "ring-amber-500/20",
      redirect: "/user",
      key: "2",
    },
    {
      icon: FaClipboardList,
      title: "Total Enrollments",
      value: enrollmentsCount.toLocaleString(),
      subtitle: "Active enrollments this period",
      color: "from-teal-500 to-teal-600",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      borderColor: "border-teal-600",
      ringColor: "ring-teal-500/20",
      redirect: "/enrollment",
      key: "8",
    },
    // {
    //   icon: FaUserLock,
    //   title: "Staff Management",
    //   value: staffs.length,
    //   subtitle: "Administrative personnel",
    //   color: "from-pink-500 to-pink-600",
    //   iconBg: "bg-pink-100",
    //   iconColor: "text-pink-600",
    //   borderColor: "border-pink-600",
    //   ringColor: "ring-pink-500/20",
    //   redirect: "/staff-menu",
    //   key: "4",
    // },
    {
      icon: FaUserLock,
      title: "Agents",
      value: agents.length,
      subtitle: "Field representatives",
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      borderColor: "border-purple-600",
      ringColor: "ring-purple-500/20",
      redirect: "/staff-menu/agent",
      key: "3",
    },
    {
      icon: FaUserLock,
      title: "Employees",
      value: employees.length,
      subtitle: "Organization workforce",
      color: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      borderColor: "border-orange-600",
      ringColor: "ring-orange-500/20",
      redirect: "/staff-menu/employee-menu",
      key: "5",
    },
    {
      icon: MdOutlinePayments,
      title: "Total Revenue",
      value: `${getMaskedValue(paymentsValue)}`,
      subtitle: "All-time earnings",
      color: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-600",
      ringColor: "ring-emerald-500/20",
        redirect: "/total-revenue", 
      key: "6",
    },
    {
      icon: SlCalender,
      title: "Monthly Revenue",
      value: `${getMaskedValue(paymentsPerMonthValue)}`,
      subtitle: "Current billing cycle",
      color: "from-sky-500 to-sky-600",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
      borderColor: "border-sky-600",
      ringColor: "ring-sky-500/20",
       redirect: "/monthly-revenue",
      key: "7",
    },
  ].filter(
    (card) =>
      card.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      card.subtitle.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div>
      <div className="flex mt-20">
        <Sidebar />
        <Navbar
          onGlobalSearchChangeHandler={GlobalSearchChangeHandler}
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
          <header className="mb-8">
            <h1 className="text-3xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 mb-2">
              Chit Intelligence Dashboard
            </h1>
            <p className="text-gray-500 max-w-2xl text-lg ">
              Real-time analytics and performance metrics for your organization.
              Monitor key business indicators and make data-driven decisions.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 auto-rows-fr">
            {cardData.map((card) => (
              <div
                key={card.key}
                className="transform transition-all duration-300 hover:scale-[1.05] hover:shadow-xl min-w-0"
              >
                <div
                  className={`relative rounded-3xl p-1 cursor-pointer transition-all duration-300 ease-out
                  bg-white border ${card.borderColor} 
                  hover:shadow-violet-500 hover:shadow-xl
                  hover:border-violet-500
                  hover:bg-violet-300`}
                >
                  <div className="bg-white rounded-2xl overflow-hidden h-full">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-xl ${card.iconBg} mb-4`}>
                          <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                        </div>
                        <span className="text-sm font-medium px-2 py-1 rounded-full bg-violet-50 ">
                          Live
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {card.subtitle}
                      </p>

                      <div className="mt-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {card.value}
                        </span>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Updated: Just now
                          </span>
                          <button
                            onClick={() =>
                              handleViewDetailsClick(card.redirect)
                            }
                            className="text-md font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                          >
                            View details
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cardData.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 px-6 rounded-2xl bg-white shadow-lg mx-4 md:mx-0">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2 text-center">
                No results found
              </h3>
              <p className="text-gray-500 max-w-md text-center">
                We couldn't find any matching results for{" "}
                <span className="font-medium">"{searchValue}"</span>. Try
                adjusting your search terms.
              </p>
            </div>
          )}
        </div>
      </div>

   
      {showPasswordPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 scale-100 hover:scale-[1.01]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800"> Secure Access Required</h2>
              <button
                onClick={() => setShowPasswordPrompt(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              Please enter your admin password to proceed to <span className="font-medium text-violet-600">{selectedRedirect} page</span>
            </p>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                autoFocus
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
              {errorMsg && (
                <p className="mt-2 text-sm text-red-500 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errorMsg}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordPrompt(false)}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200"
                disabled={isLoadingVerify}
              >
                Cancel
              </button>
              <button
                onClick={verifyPasswordAndRedirect}
                disabled={isLoadingVerify}
                className={`flex-1 py-3 px-4 font-medium rounded-xl shadow-md transition-all duration-200 flex items-center justify-center
                  ${isLoadingVerify
                    ? "bg-violet-400 cursor-not-allowed opacity-80"
                    : "bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white hover:shadow-lg"
                  }`}
              >
                {isLoadingVerify ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify & Proceed"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;