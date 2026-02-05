import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdGroups, MdOutlinePayments, MdGroupWork, 
  MdPeopleOutline, MdOutlineReceiptLong 
} from "react-icons/md";
import { FaUserLock, FaClipboardList } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { BsArrowRightShort, BsLightningCharge } from "react-icons/bs";
import api from "../instance/TokenInstance";
import Navbar from "../components/layouts/Navbar";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";
import dayjs from "dayjs";
import { Tag } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const Home = () => {
  // --- STATE ---
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
  
  // Modal States
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [selectedRedirect, setSelectedRedirect] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);

  const navigate = useNavigate();

  // --- LOGIC (Preserved) ---
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
      if (!admin?.phoneNumber) { setErrorMsg("No admin contact found."); setIsLoadingVerify(false); return; }
      const response = await api.post("/admin/login", { phoneNumber: admin.phoneNumber, password: passwordInput });
      if (response.data?.token) {
        setShowPasswordPrompt(false);
        setPasswordInput("");
        if (selectedRedirect === "/total-revenue" || selectedRedirect === "/monthly-revenue") {
          setShowRevenue(true);
          setTimeout(() => setShowRevenue(false), 30000);
        }
        navigate(selectedRedirect);
      }
    } catch (err) { setErrorMsg(err.response?.data?.message || "Password failed"); }
    finally { setIsLoadingVerify(false); }
  };

  // Data Fetching (Same as before)
  useEffect(() => {
    const user = localStorage.getItem("user");
    const userObj = JSON.parse(user);
    if (userObj?.admin_access_right_id?.access_permissions?.edit_payment) {
      setHidePayment(userObj.admin_access_right_id.access_permissions.edit_payment === "true");
    }
  }, []);

  useEffect(() => { const fetchGroups = async () => { try { const res = await api.get("/group/get-group-admin"); setGroups(res.data); } catch (e) { console.error(e); } }; fetchGroups(); }, [reloadTrigger]);
  useEffect(() => { const fetchEnrollments = async () => { try { const res = await api.get("/enroll/get-enroll"); setEnrollmentsCount(Array.isArray(res.data) ? res.data.length : 0); } catch (e) { setEnrollmentsCount(0); } }; fetchEnrollments(); }, [reloadTrigger]);
  useEffect(() => { const fetchUsers = async () => { try { const res = await api.get("/user/get-user"); setUsers(res.data); } catch (e) { console.error(e); } }; fetchUsers(); }, [reloadTrigger]);
  useEffect(() => { const fetchAgents = async () => { try { const res = await api.get("/agent/get"); setAgents(res.data?.agent || []); } catch (e) { console.error(e); } }; fetchAgents(); }, [reloadTrigger]);
  useEffect(() => { const fetchStaffs = async () => { try { const res = await api.get("/agent/get-agent"); setStaffs(res.data || []); } catch (e) { console.error(e); } }; fetchStaffs(); }, [reloadTrigger]);
  useEffect(() => { const fetchEmployees = async () => { try { const res = await api.get("/agent/get-employee"); setEmployees(res.data?.employee || []); } catch (e) { console.error(e); } }; fetchEmployees(); }, [reloadTrigger]);
  useEffect(() => { const fetchTotalPayments = async () => { try { const res = await api.get("/payment/get-total-payment-amount"); setPaymentsValue(res?.data?.totalAmount || 0); } catch (e) { console.error(e); } }; fetchTotalPayments(); }, [reloadTrigger]);
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
  useEffect(() => { const timer = setTimeout(() => setIsInitialLoading(false), 800); return () => clearTimeout(timer); }, []);

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
          id: index + 1, orderType: order?.order_type, user_name: order?.user_id?.full_name, phone_number: order?.user_id?.phone_number,
          details: formatArray(order?.groups, 'group_id', 'ticket') + formatArray(order?.pigmys, 'pigme_id', 'payable_amount'),
          status: <Tag color={color} icon={icon} variant="filled">{status}</Tag>, statusRaw: status, date: dayjs(order?.createdAt).format("MMM DD, YYYY"),
        };
      });
      setTableTransactions(filteredData);
    } catch (error) { setTableTransactions([]); }
    finally { setTransactionsLoading(false); }
  }
  useEffect(() => { getTransactions(); }, []);
  const totalStaff = agents.length + employees.length;

  // --- UI COMPONENTS ---
  const Sparkline = ({ color }) => (
    <svg viewBox="0 0 100 40" className="w-full h-12 overflow-visible opacity-80">
      <path d="M0 30 Q 25 30, 40 15 T 70 25 T 100 5" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0 30 Q 25 30, 40 15 T 70 25 T 100 5 V 40 H 0 Z" fill={color} fillOpacity="0.1" stroke="none" />
    </svg>
  );

  const RevenueCard = ({ title, value, icon: Icon, gradientBg, onClick, trend }) => (
    <div onClick={onClick} className="relative group overflow-hidden rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.07)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
      <div className="relative p-8">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradientBg} text-white shadow-lg shadow-indigo-200/50 group-hover:scale-110 transition-transform duration-300`}>
             <Icon size={28} />
          </div>
          <div className={`text-xs font-bold ${trend > 0 ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'} px-2.5 py-1 rounded-full flex items-center gap-1`}>
             {trend > 0 ? <BsLightningCharge /> : <BsLightningCharge className="rotate-180"/>} {trend}%
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wide">{title}</p>
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            {isInitialLoading ? "•••••" : `₹ ${getMaskedValue(value)}`}
          </h2>
        </div>
        <div className="h-12 w-full">
           <Sparkline color={gradientBg.includes("indigo") ? "#4f46e5" : "#10b981"} />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${gradientBg} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
    </div>
  );

  const MetricCard = ({ icon: Icon, label, value, color, redirect, delay }) => (
    <div onClick={() => !isInitialLoading && handleViewDetailsClick(redirect)} className={`group relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden ${isInitialLoading ? 'cursor-wait' : ''}`} style={{ animation: `fadeInUp 0.6s ease-out ${delay}s forwards`, opacity: 0 }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className={`p-3 rounded-xl w-fit bg-gradient-to-br ${color} text-white shadow-md group-hover:shadow-lg transition-all`}>
          <Icon size={20} />
        </div>
        <div className="mt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
          <h3 className="text-3xl font-black text-slate-800 mt-1 tracking-tight">
             {isInitialLoading ? <span className="w-12 h-8 bg-slate-200 rounded inline-block animate-pulse"></span> : value.toLocaleString()}
          </h3>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 translate-x-4">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-400 shadow-sm"><BsArrowRightShort size={20} /></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white pb-10 overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-[30%] left-[30%] w-[30%] h-[30%] bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      </div>

      <div className="relative z-10 flex flex-col w-full">
        
        {/* ONLY NAVBAR */}
        <Navbar
          onGlobalSearchChangeHandler={GlobalSearchChangeHandler}
          visibility={true}
        />

        <main className="pt-[100px] px-6 md:px-10 max-w-[1920px] mx-auto w-full">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 animate-fadeInDown">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Live System</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Super Admin</span>
              </h1>
              <p className="text-slate-500 mt-2 text-lg font-medium">Here is the business overview for today.</p>
            </div>
            <button onClick={() => setReloadTrigger(prev => prev + 1)} className="group relative px-6 py-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-slate-600 font-semibold whitespace-nowrap">
              <span className="group-hover:rotate-180 transition-transform duration-500">↻</span> Refresh Data
            </button>
          </div>

          {/* Revenue Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <RevenueCard title="Total Revenue" value={paymentsValue} icon={MdOutlinePayments} gradientBg="from-indigo-500 to-violet-600" onClick={() => handleViewDetailsClick("/total-revenue")} trend={12.5} />
            <RevenueCard title="Monthly Revenue" value={paymentsPerMonthValue} icon={SlCalender} gradientBg="from-emerald-400 to-teal-500" onClick={() => handleViewDetailsClick("/monthly-revenue")} trend={8.2} />
          </div>

          {/* Quick Metrics - Full Width Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
            <MetricCard icon={MdGroupWork} label="Groups" value={groups.length} color="from-blue-500 to-cyan-500" redirect="/group" delay={0.1} />
            <MetricCard icon={MdGroups} label="Customers" value={users.length} color="from-purple-500 to-pink-500" redirect="/user" delay={0.15} />
            <MetricCard icon={FaClipboardList} label="Enrollments" value={enrollmentsCount} color="from-emerald-500 to-green-500" redirect="/enrollment" delay={0.2} />
            <MetricCard icon={FaClipboardList} label="Staff" value={staffs?.length} color="from-indigo-500 to-violet-500" redirect="/staff-menu" delay={0.25} />
            <MetricCard icon={FaUserLock} label="Agents" value={agents.length} color="from-orange-500 to-amber-500" redirect="/staff-menu/agent" delay={0.3} />
            <MetricCard icon={FaUserLock} label="Employees" value={employees.length} color="from-rose-500 to-red-500" redirect="/staff-menu/employee-menu" delay={0.35} />
          </div>

          {/* Split Section: Staff & Transactions */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            
            {/* Staff Ratio (1 col) */}
            <div className="xl:col-span-1 bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-sm animate-fadeInUp flex flex-col" style={{animationDelay: '0.5s'}}>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                <MdPeopleOutline className="text-indigo-500" /> Staff Ratio
              </h3>
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="relative w-40 h-40 rounded-full shadow-inner transition-all duration-700 hover:scale-105" style={{ background: `conic-gradient(#f59e0b 0% ${(agents.length / totalStaff) * 100}%, #f43f5e ${(agents.length / totalStaff) * 100}% 100%)` }}>
                  <div className="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center shadow-inner border border-slate-100">
                    <span className="text-3xl font-black text-slate-800">{totalStaff}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total</span>
                  </div>
                </div>
                <div className="flex w-full mt-8 gap-2">
                  <div className="flex-1 bg-amber-50 p-2 rounded-xl text-center border border-amber-100">
                    <p className="text-[10px] text-amber-600 font-bold uppercase">Agents</p>
                    <p className="text-lg font-black text-slate-800">{agents.length}</p>
                  </div>
                  <div className="flex-1 bg-rose-50 p-2 rounded-xl text-center border border-rose-100">
                    <p className="text-[10px] text-rose-600 font-bold uppercase">Employees</p>
                    <p className="text-lg font-black text-slate-800">{employees.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions (3 cols) */}
            <div className="xl:col-span-3 bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-sm flex flex-col animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MdOutlineReceiptLong className="text-indigo-500" /> Recent Transactions
                </h3>
                <button onClick={getTransactions} className="text-xs font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-1">
                   <span className="animate-spin-slow">↻</span> Sync
                </button>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                {transactionsLoading || isInitialLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-20 bg-slate-50/50 rounded-2xl animate-pulse border border-white/50"></div>
                    ))}
                  </div>
                ) : tableTransactions.length > 0 ? (
                  <div className="overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-[420px]">
                    {tableTransactions.map((item, idx) => (
                      <div 
                        key={item.id} 
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-white/50 hover:bg-white hover:shadow-lg hover:shadow-indigo-500/5 border border-white hover:border-indigo-100 transition-all duration-300 hover:-translate-x-1 cursor-default"
                        style={{ animation: `fadeInUp 0.3s ease-out forwards ${0.1 + (idx * 0.05)}s`, opacity: 0 }}
                      >
                        <div className={`p-3.5 rounded-2xl shadow-sm transition-colors ${item.statusRaw === 'PAID' ? 'bg-emerald-100 text-emerald-600' : item.statusRaw === 'ACTIVE' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                          <MdOutlinePayments size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-slate-800 truncate text-sm">{item.user_name}</h4>
                            <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded-lg">{item.date}</span>
                          </div>
                          <p className="text-xs text-slate-500 truncate font-medium">
                            {item.details || item.orderType}
                          </p>
                        </div>
                        <div className="transform group-hover:scale-105 transition-transform">
                          {item.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-20 opacity-50">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <MdOutlineReceiptLong size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-semibold">No transactions found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* Password Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowPasswordPrompt(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden transform transition-all scale-100">
            <div className="bg-slate-900 p-8 text-white text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20 shadow-inner">
                <FaUserLock size={32} />
              </div>
              <h2 className="text-2xl font-bold">Security Check</h2>
              <p className="text-slate-300 text-sm mt-2 font-medium">Enter admin password to access this section.</p>
            </div>
            <div className="p-8">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && verifyPasswordAndRedirect()}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all mb-4 text-lg tracking-wide text-center placeholder:text-slate-300"
                autoFocus
              />
              {errorMsg && (
                <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-lg mb-4 font-medium flex items-center gap-2 animate-shake">
                  <span>⚠️</span> {errorMsg}
                </div>
              )}
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPasswordPrompt(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                  disabled={isLoadingVerify}
                >
                  Cancel
                </button>
                <button 
                  onClick={verifyPasswordAndRedirect}
                  disabled={isLoadingVerify}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isLoadingVerify ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-blob { animation: blob 8s infinite ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-fadeInDown { animation: fadeInDown 0.6s ease-out forwards; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      
      <CustomAlertDialog
        type="info"
        isVisible={false}
        message=""
        onClose={() => {}}
      />
    </div>
  );
};

export default Home;