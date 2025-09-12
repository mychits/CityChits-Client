import Sidebar from "../components/layouts/Sidebar";
import { MdGroups, MdOutlinePayments, MdGroupWork } from "react-icons/md";
import { FaUserLock } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { useEffect, useState, useCallback } from "react";
import api from "../instance/TokenInstance";
import CustomCard from "../components/cards/CustomCard";

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

  const [isLoading, setIsLoading] = useState(false);

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

  const cardData = [
    {
      icon: MdGroupWork,
      title: "Corporate Groups",
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
      icon: FaUserLock,
      title: "Staff Management",
      value: staffs.length,
      subtitle: "Administrative personnel",
      color: "from-pink-500 to-pink-600",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      borderColor: "border-pink-600",
      ringColor: "ring-pink-500/20",
      redirect: "/staff",
      key: "4",
    },
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
      redirect: "/agent",
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
      redirect: "/employee",
      key: "5",
    },
    {
      icon: MdOutlinePayments,
      title: "Total Revenue",
      value: ` ${paymentsValue}`,
      subtitle: "All-time earnings",
      color: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-600",
      ringColor: "ring-emerald-500/20",
      redirect: "/payment",
      key: "6",
    },
    {
      icon: SlCalender,
      title: "Monthly Revenue",
      value: ` ${paymentsPerMonthValue}`,
      subtitle: "Current billing cycle",
      color: "from-sky-500 to-sky-600",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
      borderColor: "border-sky-600",
      ringColor: "ring-sky-500/20",
      redirect: "/payment",
      key: "7",
    }
  ].filter((card) =>
    card.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    card.subtitle.toLowerCase().includes(searchValue.toLowerCase())
  );

  const onGlobalSearchChangeHandler = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-gray-50 to-gray-100 transition-colors duration-300">
      <div className="flex">
        <Sidebar
          navSearchBarVisibility={true}
          onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
        />
        <div className="flex-1 ml-16 mr-11 mt-11 pb-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 mb-2">
              Chit Intelligence Dashboard
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Real-time analytics and performance metrics for your organization.
              Monitor key business indicators and make data-driven decisions.
            </p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 auto-rows-fr ">
            {cardData.map((card) => (
              <div
                key={card.key}
                className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-violet-700  hover:shadow-2xl"
              >
                <div
                  className={`relative rounded-3xl p-1 
          bg-white border ${card.borderColor}
           transition-all duration-300 ease-out
          hover:shadow-2xl bg-violet-400  hover:scale-[1.07] hover:${card.borderColor}
          hover:${card.ringColor}
          cursor-pointer`}
                >
                  <div className="bg-white  rounded-2xl overflow-hidden h-full ">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-xl ${card.iconBg} mb-4`}>
                          <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          Live
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-gray-800 mb-1">
                        {card.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">{card.subtitle}</p>

                      <div className="mt-2">
                        <span className="text-xl font-bold text-gray-900">
                          {card.value}
                        </span>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Updated: Just now</span>
                          <a
                            href={card.redirect}
                            className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center"
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
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>


          {cardData.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-6 rounded-2xl bg-white shadow-lg">
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
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500 max-w-md text-center">
                We couldn't find any matching results for "{searchValue}". Try adjusting your search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
