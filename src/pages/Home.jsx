import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdGroups, MdOutlinePayments, MdGroupWork, 
  MdTrendingUp, MdPeopleOutline, MdOutlineReceiptLong 
} from "react-icons/md";
import { FaUserLock, FaClipboardList } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { BsArrowRightShort, BsArrowUpRight } from "react-icons/bs";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import api from "../instance/TokenInstance";
import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";
import dayjs from "dayjs";
import { Tag } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const Home = () => {
  // --- State Management ---
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
  const [enrollmentsCount, setEnrollmentsCount] = useState(0);
  const [viewMode, setViewMode] = useState("list");

  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [tableTransactions, setTableTransactions] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [alertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });

  const navigate = useNavigate();

  // Password & Auth State
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [selectedRedirect, setSelectedRedirect] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);

  // --- Handlers ---
  const GlobalSearchChangeHandler = (e) => setSearchValue(e.target.value);
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
        setErrorMsg("No admin contact found.");
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
        if (selectedRedirect === "/total-revenue" || selectedRedirect === "/monthly-revenue") {
          setShowRevenue(true);
          setTimeout(() => setShowRevenue(false), 30000);
        }
        navigate(selectedRedirect);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Password failed");
    } finally {
      setIsLoadingVerify(false);
    }
  };

  // --- Data Fetching ---
  useEffect(() => {
    const user = localStorage.getItem("user");
    const userObj = JSON.parse(user);
    if (userObj?.admin_access_right_id?.access_permissions?.edit_payment) {
      setHidePayment(userObj.admin_access_right_id.access_permissions.edit_payment === "true");
    }
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try { const res = await api.get("/group/get-group-admin"); setGroups(res.data); } catch (e) { console.error(e); }
    }; fetchGroups();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try { const res = await api.get("/enroll/get-enroll"); setEnrollmentsCount(Array.isArray(res.data) ? res.data.length : 0); } catch (e) { setEnrollmentsCount(0); }
    }; fetchEnrollments();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchUsers = async () => {
      try { const res = await api.get("/user/get-user"); setUsers(res.data); } catch (e) { console.error(e); }
    }; fetchUsers();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchAgents = async () => {
      try { const res = await api.get("/agent/get"); setAgents(res.data?.agent || []); } catch (e) { console.error(e); }
    }; fetchAgents();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchStaffs = async () => {
      try { const res = await api.get("/agent/get-agent"); setStaffs(res.data || []); } catch (e) { console.error(e); }
    }; fetchStaffs();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try { const res = await api.get("/agent/get-employee"); setEmployees(res.data?.employee || []); } catch (e) { console.error(e); }
    }; fetchEmployees();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchTotalPayments = async () => {
      try { const res = await api.get("/payment/get-total-payment-amount"); setPaymentsValue(res?.data?.totalAmount || 0); } catch (e) { console.error(e); }
    }; fetchTotalPayments();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchMonthlyPayments = async () => {
      try {
        const today = new Date();
        const firstDay = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];
        const res = await api.get("/payment/get-current-month-payment", { params: { from_date: firstDay, to_date: lastDay } });
        setPaymentsPerMonthValue(res?.data?.monthlyPayment || 0);
      } catch (e) { console.error(e); }
    }; fetchMonthlyPayments();
  }, [reloadTrigger]);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getMaskedValue = (value) => showRevenue ? value.toLocaleString() : "•••••";

  async function getTransactions() {
    try {
      setTransactionsLoading(true);
      const response = await api.get("/cashfree-pg-orders/10");
      const transactionsData = response.data?.data;
      const filteredData = transactionsData.map((order, index) => {
        const status = order?.status;
        const color = status === "ACTIVE" ? "blue" : status === "PAID" ? "green" : "red";
        const icon = status === "ACTIVE" ? <ClockCircleOutlined /> : status === "PAID" ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
        
        const formatArray = (arr, key1, key2) => (arr?.map(i => `${i?.[key1]?.group_name || i?.[key1]} | ${i?.[key2] || i[key1]}`).join(", ") || "");
        
        return {
          id: index + 1,
          orderType: order?.order_type,
          user_name: order?.user_id?.full_name,
          phone_number: order?.user_id?.phone_number,
          details: formatArray(order?.groups, 'group_id', 'ticket') + formatArray(order?.pigmys, 'pigme_id', 'payable_amount'),
          status: <Tag color={color} icon={icon} variant="filled">{status}</Tag>,
          statusRaw: status,
          date: dayjs(order?.createdAt).format("MMM DD, YYYY"),
        };
      });
      setTableTransactions(filteredData);
    } catch (error) {
      setTableTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  }

  useEffect(() => { getTransactions(); }, []);

  const totalStaff = agents.length + employees.length;

  // --- UI COMPONENTS ---

  const RevenueCard = ({ title, value, icon: Icon, trend, onClick, isPrimary }) => (
    <div 
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer ${
        isPrimary 
          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-500 hover:border-indigo-400' 
          : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-lg'
      }`}
    >
      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div className={`p-3 rounded-2xl ${isPrimary ? 'bg-white/10 backdrop-blur-sm' : 'bg-indigo-50'}`}>
            <Icon className={`text-2xl ${isPrimary ? 'text-white' : 'text-indigo-600'}`} />
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            trend > 0 
              ? 'bg-emerald-50 text-emerald-700' 
              : 'bg-rose-50 text-rose-700'
          }`}>
            {trend > 0 ? <HiTrendingUp className="text-sm" /> : <HiTrendingDown className="text-sm" />}
            {Math.abs(trend)}%
          </div>
        </div>
        
        <div>
          <p className={`text-sm font-medium mb-2 ${isPrimary ? 'text-indigo-100' : 'text-slate-500'}`}>
            {title}
          </p>
          <h2 className={`text-4xl font-bold tracking-tight ${isPrimary ? 'text-white' : 'text-slate-900'}`}>
            {isInitialLoading ? (
              <span className={`inline-block h-10 w-32 rounded-lg ${isPrimary ? 'bg-white/10' : 'bg-slate-100'} animate-pulse`}></span>
            ) : (
              `₹${getMaskedValue(value)}`
            )}
          </h2>
        </div>

        <div className={`mt-6 pt-6 border-t ${isPrimary ? 'border-white/10' : 'border-slate-100'} flex items-center justify-between`}>
          <span className={`text-xs font-medium ${isPrimary ? 'text-indigo-200' : 'text-slate-500'}`}>
            {isPrimary ? 'All time' : 'This month'}
          </span>
          <BsArrowUpRight className={`text-lg transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${isPrimary ? 'text-white/70' : 'text-slate-400'}`} />
        </div>
      </div>
    </div>
  );

  const MetricCard = ({ icon: Icon, label, value, redirect }) => (
    <div
      onClick={() => !isInitialLoading && handleViewDetailsClick(redirect)}
      className={`group relative bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100 cursor-pointer ${isInitialLoading ? 'cursor-wait' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
          <Icon className="text-lg text-indigo-600" />
        </div>
        <BsArrowUpRight className="text-slate-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      
      <div>
        <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">
          {label}
        </p>
        <h3 className="text-2xl font-bold text-slate-900">
          {isInitialLoading ? (
            <span className="inline-block h-8 w-16 bg-slate-100 rounded animate-pulse"></span>
          ) : (
            value.toLocaleString()
          )}
        </h3>
      </div>
    </div>
  );

  const StaffRatioCard = () => (
    <div className="bg-white border border-slate-200 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-slate-900">Staff Distribution</h3>
        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
          View All
        </button>
      </div>
      
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="#f1f5f9"
              strokeWidth="16"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="#6366f1"
              strokeWidth="16"
              fill="none"
              strokeDasharray={`${(agents.length / totalStaff) * 553} 553`}
              className="transition-all duration-1000"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="#a855f7"
              strokeWidth="16"
              fill="none"
              strokeDasharray={`${(employees.length / totalStaff) * 553} 553`}
              strokeDashoffset={-((agents.length / totalStaff) * 553)}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900">{totalStaff}</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Staff</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Agents</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{agents.length}</p>
        </div>
        <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Employees</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{employees.length}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        onGlobalSearchChangeHandler={GlobalSearchChangeHandler}
        visibility={true}
      />

      <main className="pt-28 pb-12 px-6  mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Live</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Dashboard Overview
            </h1>
            <p className="text-slate-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <button 
            onClick={() => setReloadTrigger(prev => prev + 1)} 
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all flex items-center gap-2"
          >
            <span className={`${reloadTrigger > 0 ? 'animate-spin' : ''}`}>↻</span>
            Refresh
          </button>
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueCard
            title="Total Revenue"
            value={paymentsValue}
            icon={MdOutlinePayments}
            trend={12.5}
            onClick={() => handleViewDetailsClick("/total-revenue")}
            isPrimary={true}
          />
          <RevenueCard
            title="Monthly Revenue"
            value={paymentsPerMonthValue}
            icon={SlCalender}
            trend={8.2}
            onClick={() => handleViewDetailsClick("/monthly-revenue")}
            isPrimary={false}
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <MetricCard icon={MdGroupWork} label="Groups" value={groups.length} redirect="/group" />
          <MetricCard icon={MdGroups} label="Customers" value={users.length} redirect="/user" />
          <MetricCard icon={FaClipboardList} label="Enrollments" value={enrollmentsCount} redirect="/enrollment" />
          <MetricCard icon={FaClipboardList} label="Staff" value={staffs?.length} redirect="/staff-menu" />
          <MetricCard icon={FaUserLock} label="Agents" value={agents.length} redirect="/staff-menu/agent" />
          <MetricCard icon={FaUserLock} label="Employees" value={employees.length} redirect="/staff-menu/employee-menu" />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Staff Ratio */}
          <StaffRatioCard />

          {/* Transactions */}
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MdOutlineReceiptLong className="text-xl text-indigo-600" />
                Recent Transactions
              </h3>
              <button 
                onClick={getTransactions}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
              >
                <span className={transactionsLoading ? 'animate-spin' : ''}>↻</span>
                Refresh
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {transactionsLoading || isInitialLoading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse"></div>
                ))
              ) : tableTransactions.length > 0 ? (
                tableTransactions.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-default"
                  >
                    <div className={`p-3 rounded-xl ${
                      item.statusRaw === 'PAID' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : item.statusRaw === 'ACTIVE' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-rose-50 text-rose-600'
                    }`}>
                      <MdOutlinePayments className="text-lg" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-slate-900 truncate text-sm">
                          {item.user_name}
                        </h4>
                        <span className="text-xs text-slate-500 font-medium ml-2">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {item.details || item.orderType}
                      </p>
                    </div>
                    
                    <div>{item.status}</div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                    <MdOutlineReceiptLong className="text-3xl text-indigo-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No transactions found</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Password Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-center text-white">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                <FaUserLock className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
              <p className="text-indigo-100 text-sm">Please enter your password to continue</p>
            </div>
            
            <div className="p-8">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && verifyPasswordAndRedirect()}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white outline-none transition-all mb-4"
                autoFocus
              />
              
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm p-3 rounded-2xl mb-4 flex items-center gap-2">
                  <span>⚠</span>
                  {errorMsg}
                </div>
              )}
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPasswordPrompt(false)}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
                  disabled={isLoadingVerify}
                >
                  Cancel
                </button>
                <button 
                  onClick={verifyPasswordAndRedirect}
                  disabled={isLoadingVerify}
                  className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoadingVerify ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <CustomAlertDialog
        type={alertConfig.type}
        isVisible={alertConfig.visibility}
        message={alertConfig.message}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visibility: false }))}
      />
    </div>
  );
};

export default Home;