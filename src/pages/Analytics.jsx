/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";
import api from "../instance/TokenInstance";

import CustomAlertDialog from "../components/alerts/CustomAlertDialog";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

import { fieldSize } from "../data/fieldSize";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const formatINR = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const formatNum = (n) => Number(n || 0).toLocaleString("en-IN");
const fmtDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "-");

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const addMonths = (date, m) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + m);
  return d;
};

  const onGlobalSearchChangeHandler = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
    setCurrentPageRelated(1);
  };

// export default function Analytics() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchText, setSearchText] = useState("");
//   const [alertConfig, setAlertConfig] = useState({
//     visibility: false,
//     message: "Something went wrong!",
//     type: "info",
//   });

//   const [kpis, setKpis] = useState({
//     totalCollection: 0,
//     thisPeriodCollection: 0,
//     usersCount: 0,
//     groupsCount: 0,
//     agentsCount: 0,
//     employeesCount: 0,
//     enrollmentsCount: 0,
//   });

//   const [payments, setPayments] = useState([]);
//   const [recent, setRecent] = useState([]);


//   const today = new Date();
//   const currentMonth = today.getMonth();
//         const currentYear = today.getFullYear();
//   const currentMonthStart = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;
//       const lastDay = new Date(currentYear, currentMonth + 1, 0);
//   const currentMonthEnd = lastDay.toISOString().split("T")[0];
  
 
//   const twelveMonthsAgo = fmtDate(startOfMonth(addMonths(today, -11)));
//   const currentDate = fmtDate(today);

//   const monthlyAggregation = useMemo(() => {
//     const end = new Date(currentDate);
//     const labels = [];
//     for (let i = 11; i >= 0; i--) {
//       const d = addMonths(end, -i);
//       labels.push(`${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear()}`);
//     }
//     const sums = new Array(labels.length).fill(0);
//     payments.forEach((p) => {
//       if (!p?.pay_date) return;
//       const dt = new Date(p.pay_date);
//       const monthsDiff =
//         (end.getFullYear() - dt.getFullYear()) * 12 + (end.getMonth() - dt.getMonth());
//       const idx = labels.length - 1 - monthsDiff;
//       if (idx >= 0 && idx < labels.length) sums[idx] += Number(p.amount || 0);
//     });
//     return { labels, sums };
//   }, [payments]);

//   const revenueSplit = useMemo(() => {
//     const map = {};
//     payments.forEach((p) => {
//       const key = (p?.pay_type || "Other").toString();
//       map[key] = (map[key] || 0) + Number(p?.amount || 0);
//     });
//     const labels = Object.keys(map);
//     const values = labels.map((k) => map[k]);
//     return { labels, values };
//   }, [payments]);

//   const topGroups = useMemo(() => {
//     const map = {};
//     payments.forEach((p) => {
//       const gname = p?.group_id?.group_name || "Unknown Group";
//       map[gname] = (map[gname] || 0) + Number(p?.amount || 0);
//     });
//     return Object.entries(map)
//       .map(([name, amt]) => ({ name, amt }))
//       .sort((a, b) => b.amt - a.amt)
//       .slice(0, 7);
//   }, [payments]);

//  const topAgents = useMemo(() => {
//   const map = {};
//   payments.forEach((p) => {
//     let agentName =
//       p?.collected_by?.full_name ||
//       p?.agent?.full_name ||
//       p?.agent_id?.full_name ||
//       p?.collect_by?.full_name;

 
//     if (!agentName && p?.user_id?.full_name) {
//       agentName = p.user_id.full_name;
//     }

//     agentName = agentName || "Unknown Agent";
//     map[agentName] = (map[agentName] || 0) + Number(p?.amount || 0);
//   });
//   return Object.entries(map)
//     .map(([name, amt]) => ({ name, amt }))
//     .sort((a, b) => b.amt - a.amt)
//     .slice(0, 7);
// }, [payments]);

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         backgroundColor: "#1f2937",
//         titleColor: "#fff",
//         bodyColor: "#fff",
//         borderColor: "#374151",
//         borderWidth: 1,
//         cornerRadius: 6,
//         padding: 10,
//       },
//     },
//     maintainAspectRatio: false,
//   };

//   const lineData = {
//     labels: monthlyAggregation.labels,
//     datasets: [
//       {
//         label: "Monthly Collection",
//         data: monthlyAggregation.sums,
//         borderColor: "#4f46e5",
//         backgroundColor: "rgba(79, 70, 229, 0.1)",
//         tension: 0.3,
//         fill: true,
//         pointBackgroundColor: "#4f46e5",
//         pointBorderColor: "#fff",
//         pointBorderWidth: 2,
//         pointHoverRadius: 7,
//       },
//     ],
//   };

//   const parseINRString = (val) => {
//     if (val === null || val === undefined) return 0;
//     if (typeof val === 'number') return val;
//     if (typeof val === 'string') {
//       const cleaned = val.replace(/[^0-9.-]/g, ''); 
//       const num = parseFloat(cleaned);
//       return isNaN(num) ? 0 : num;
//     }
//     return 0;
//   };

//   const groupsBarData = {
//     labels: topGroups.map((g) => g.name),
//     datasets: [
//       {
//         label: "Collections",
//         data: topGroups.map((g) => Math.round(g.amt)),
//         backgroundColor: "#06b6d4",
//         borderRadius: 6,
//       },
//     ],
//   };

//   const agentsBarData = {
//     labels: topAgents.map((a) => a.name),
//     datasets: [
//       {
//         label: "Collections",
//         data: topAgents.map((a) => Math.round(a.amt)),
//         backgroundColor: "#f59e0b",
//         borderRadius: 6,
//       },
//     ],
//   };

//   const doughnutData = {
//     labels: revenueSplit.labels.length ? revenueSplit.labels : ["No Data"],
//     datasets: [
//       {
//         data: revenueSplit.values.length ? revenueSplit.values : [1],
//         backgroundColor: [
//           "#3b82f6",
//           "#10b981",
//           "#f59e0b",
//           "#ef4444",
//           "#06b6d4",
//           "#8b5cf6",
//           "#ec4899",
//         ],
//         borderWidth: 2,
//         borderColor: "#fff",
//       },
//     ],
//   };

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");

//         // First, get user data to get current user ID
//         const usersRes = await api.get("/user/get-user").catch(() => ({ data: [] }));
//         if (cancelled) return;
        
//         const users = usersRes?.data || [];
//         // Try to find the current user (adjust based on your auth system)
//         const currentUser = users.length > 0 ? users[0] : null;
//         const currentUserId = currentUser?._id || currentUser?.id || null;

//         // Get groups for constructing payment_group_tickets
//         const groupsRes = await api.get("/group/get-group-admin").catch(() => ({ data: [] }));
//         if (cancelled) return;
        
//         const groups = groupsRes?.data || [];
        
//         // Format payment_group_tickets as required by backend: ["group-{group_id}|{ticket}"]
//         // Since we don't have ticket info, we'll try with a default ticket of "1"
//         // You may need to adjust this based on your actual data structure
//         const paymentGroupTickets = groups.map(group => {
//           const groupId = group._id || group.id;
//           return `group-${groupId}|1`; // Using 1 as default ticket
//         });

//         // If we couldn't get a user ID, we'll handle it gracefully
//         let lastNTransRes;
//         if (currentUserId && paymentGroupTickets.length > 0) {
//           lastNTransRes = await api.get("/payment/get-last-n-transaction", {
//             params: { 
//               user_id: currentUserId,
//               payment_group_tickets: paymentGroupTickets,
//               limit: 10
//             },
//           }).catch(() => ({ data: [] }));
//         } else {
//           // Fallback: use empty array if we can't construct the required parameters
//           lastNTransRes = { data: [] };
//         }

//         // Make other API calls - using current month dates for period-specific data
//         const [agentsRes, employeesRes, enrollRes, totalCollRes, currentMonthRes, paymentsByDatesRes] =
//           await Promise.allSettled([
//             api.get("/agent/get").catch(() => ({ data: [] })),
//             api.get("/agent/get-employee").catch(() => ({ data: [] })),
//             api.get("/enroll/get-enroll").catch(() => ({ data: [] })),
//             api.get("/payment/get-total-payment-amount").catch(() => ({ data: {} })),
//             api.get("/payment/get-current-month-payment", {
//               params: { 
//                 from_date: currentMonthStart, 
//                 to_date: currentMonthEnd 
//               },
//             }).catch(() => ({ data: {} })),
//             api.get("/payment/get-payments-by-dates", {
//               params: { 
//                 from_date: twelveMonthsAgo, 
//                 to_date: currentDate 
//               },
//             }).catch(() => ({ data: [] })),
//           ]);

//         if (cancelled) return;

//         const unwrap = (res) => (res?.status === "fulfilled" ? res.value : res.reason);

//         const agents = unwrap(agentsRes)?.data || [];
//         const employees = unwrap(employeesRes)?.data || [];
//         const enrolls = unwrap(enrollRes)?.data || [];
//         const totalColl = unwrap(totalCollRes)?.data || {};
//         const currentMonth = unwrap(currentMonthRes)?.data || {};
//         const paymentsRange = unwrap(paymentsByDatesRes)?.data || [];
//         const lastN = lastNTransRes?.data || [];

//         setKpis({
//           totalCollection: parseINRString(totalColl?.totalAmount),
//           thisPeriodCollection: parseINRString(currentMonth?.monthlyPayment),
//           usersCount: Array.isArray(users) ? users.length : 0,
//           groupsCount: Array.isArray(groups) ? groups.length : 0,
//           agentsCount: Array.isArray(agents?.agent || agents) ? (agents.agent?.length || agents.length) : 0,
//           employeesCount: Array.isArray(employees?.employee || employees) ? (employees.employee?.length || employees.length) : 0,
//           enrollmentsCount: Array.isArray(enrolls) ? enrolls.length : 0,
//         });

//         // Prefer payments from date range, fallback to last N transactions
//         const paymentList = Array.isArray(paymentsRange) && paymentsRange.length > 0 
//           ? paymentsRange 
//           : lastN;

//         const normalized = (paymentList || []).map((p) => ({
//           ...p,
//           amount: Number(p?.amount || 0),
//           pay_date: p?.pay_date || p?.date || null,
//         }));

//         const recentSorted = [...normalized]
//           .filter((p) => p.pay_date)
//           .sort((a, b) => new Date(b.pay_date) - new Date(a.pay_date))
//           .slice(0, 10);

//         setRecent(
//           recentSorted.map((p, idx) => ({
//             id: idx + 1,
//             date: p?.pay_date ? p.pay_date.split("T")[0] : "-",
//             name: p?.user_id?.full_name || p?.name || "-",
//             group: p?.group_id?.group_name || "-",
//             ticket: p?.ticket || "-",
//             receipt: p?.receipt_no || "-",
//             mode: p?.pay_type || "-",
//             amount: p.amount || 0,
//           }))
//         );

//         setPayments(normalized);
//       } catch (err) {
//         console.error("Analytics fetch error:", err);
//         setError("Failed to load analytics. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, []); // Empty dependency array - no longer depends on fromDate/toDate

//   const downloadCSV = () => {
//     const header = ["#", "Date", "Name", "Group", "Ticket", "Receipt", "Mode", "Amount"];
//     const rows = recent.map((r) => [r.id, r.date, r.name, r.group, r.ticket, r.receipt, r.mode, r.amount]);
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       [header, ...rows]
//         .map((e) => e.map(String).map((s) => `"${s.replace(/"/g, '""')}"`).join(","))
//         .join("\n");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `payments_${fmtDate(new Date())}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <>
//         <div>
        
//           <div className="flex mt-20">
//            <Sidebar />
//                <Navbar
//                  onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
//                  visibility={true}
//                />
//                <CustomAlertDialog
//                  type={alertConfig.type}
//                  isVisible={alertConfig.visibility}
//                  message={alertConfig.message}
//                  onClose={() => setAlertConfig((prev) => ({ ...prev, visibility: false }))}
//                />
//             <div className="flex-grow p-7">
//               <Navbar />
//               <div className="animate-pulse space-y-6">
//                 <div className="h-8 bg-gray-200 rounded w-48"></div>
//                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//                   {[...Array(6)].map((_, i) => (
//                     <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
//                   ))}
//                 </div>
//                 <div className="h-64 bg-gray-200 rounded-xl"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <div>
      

//         <div className="flex mt-20">
//         <Sidebar />
//                <Navbar
//                  onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
//                  visibility={true}
//                />
//                <CustomAlertDialog
//                  type={alertConfig.type}
//                  isVisible={alertConfig.visibility}
//                  message={alertConfig.message}
//                  onClose={() => setAlertConfig((prev) => ({ ...prev, visibility: false }))}
//                />

//           {/* Main Content */}
//           <div className="flex-grow p-7">
//             <Navbar />

//             <main className="space-y-6 max-w-full">
//               {/* Header */}
//               <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                 <div>
//                   <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                 
//                   <button
//                     onClick={downloadCSV}
//                     className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 min-w-max"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                     Export CSV
//                   </button>
//                 </div>
//               </header>

//               {error && (
//                 <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 p-4 text-sm">
//                   <strong>Error:</strong> {error}
//                 </div>
//               )}

//               {/* KPI Cards */}
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//                 <Kpi title="Total Collection" value={formatINR(kpis.totalCollection)} accent="indigo" />
//                 <Kpi title="This Period" value={formatINR(kpis.thisPeriodCollection)} accent="emerald" />
//                 <Kpi title="Users" value={formatNum(kpis.usersCount)} accent="violet" />
//                 <Kpi title="Groups" value={formatNum(kpis.groupsCount)} accent="violet" />
//                 <Kpi title="Agents" value={formatNum(kpis.agentsCount)} accent="cyan" />
//                 <Kpi title="Enrollments" value={formatNum(kpis.enrollmentsCount)} accent="amber" />
//               </div>

//               {/* Charts */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 <section className="bg-white rounded-2xl shadow-lg p-5 col-span-2 hover:shadow-xl transition-shadow duration-300">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-1">Monthly Collection Trend</h3>
//                   <p className="text-sm text-gray-500 mb-4">Last 12 months of revenue</p>
//                   <div className="h-64">
//                     <Line data={lineData} options={chartOptions} />
//                   </div>
//                 </section>

//                 <section className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-1">Payment Mode Split</h3>
//                   <p className="text-sm text-gray-500 mb-4">Distribution by payment method</p>
//                   <div className="flex items-center justify-center h-64">
//                     <div className="w-40">
//                       <Doughnut
//                         data={doughnutData}
//                         options={{ ...chartOptions, plugins: { legend: { display: false } } }}
//                       />
//                     </div>
//                     <div className="ml-4 space-y-2 text-sm flex-1">
//                       {doughnutData.labels.map((label, i) => (
//                         <div key={label} className="flex items-center gap-2">
//                           <div
//                             className="w-3 h-3 rounded-full"
//                             style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[i % 7] }}
//                           ></div>
//                           <span className="capitalize text-gray-700">{label}</span>
//                           <span className="ml-auto font-medium">{formatINR(doughnutData.datasets[0].data[i])}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </section>

//                 <section className="bg-white rounded-2xl shadow-lg p-5 lg:col-span-3 hover:shadow-xl transition-shadow duration-300">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-1">Top Groups & Agents</h3>
//                   <p className="text-sm text-gray-500 mb-5">Top 7 contributors by collection amount</p>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <h4 className="font-medium text-gray-700 mb-3">Top Groups</h4>
//                       <div className="h-60">
//                         <Bar
//                           data={groupsBarData}
//                           options={{
//                             ...chartOptions,
//                             indexAxis: "y",
//                             scales: {
//                               y: { beginAtZero: true, ticks: { color: "#4b5563", autoSkip: false }, grid: { display: false } },
//                               x: {
//                                 ticks: { color: "#4b5563", callback: (value) => `₹${(value / 1e5).toFixed(0)}L` },
//                                 grid: { color: "#f3f4f6" },
//                                 title: { display: true, text: "Collection (in INR)", color: "#6b7280", font: { size: 10 } },
//                               },
//                             },
//                             plugins: {
//                               tooltip: { callbacks: { label: (context) => `Amount: ${formatINR(context.raw)}` } },
//                             },
//                           }}
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-medium text-gray-700 mb-3">Top Users</h4>
//                       <div className="h-60">
//                         <Bar
//                           data={agentsBarData}
//                           options={{
//                             ...chartOptions,
//                             indexAxis: "y",
//                             scales: {
//                               y: { beginAtZero: true, ticks: { color: "#4b5563", autoSkip: false }, grid: { display: false } },
//                               x: {
//                                 ticks: { color: "#4b5563", callback: (value) => `₹${(value / 1e5).toFixed(0)}L` },
//                                 grid: { color: "#f3f4f6" },
//                                 title: { display: true, text: "Collection (in INR)", color: "#6b7280", font: { size: 10 } },
//                               },
//                             },
//                             plugins: {
//                               tooltip: { callbacks: { label: (context) => `Amount: ${formatINR(context.raw)}` } },
//                             },
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </section>
//               </div>

//               {/* Recent Transactions */}
//               <section className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
//                   <h3 className="text-lg font-semibold text-gray-800">Recent Payments</h3>
//                   <span className="text-sm text-gray-500">
//                     {recent.length} records · Updated: {fmtDate(new Date())}
//                   </span>
//                 </div>

//                 <div className="overflow-x-auto rounded-lg border border-gray-200">
//                   <table className="min-w-full text-sm">
//                     <thead>
//                       <tr className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wide">
//                         <th className="py-3 px-4 text-left rounded-l-lg">#</th>
//                         <th className="py-3 px-4 text-left">Date</th>
//                         <th className="py-3 px-4 text-left">Name</th>
//                         <th className="py-3 px-4 text-left">Group</th>
//                         <th className="py-3 px-4 text-left">Ticket</th>
//                         <th className="py-3 px-4 text-left">Receipt</th>
//                         <th className="py-3 px-4 text-left">Mode</th>
//                         <th className="py-3 px-4 text-right rounded-r-lg">Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {recent.length === 0 ? (
//                         <tr>
//                           <td colSpan="8" className="py-10 text-center text-gray-500">No recent payments found</td>
//                         </tr>
//                       ) : (
//                         recent.map((r) => (
//                           <tr key={r.id} className="hover:bg-gray-50 transition-colors duration-150">
//                             <td className="py-3 px-4 text-gray-600">{r.id}</td>
//                             <td className="py-3 px-4 text-gray-700">{r.date}</td>
//                             <td className="py-3 px-4 font-medium text-gray-800 truncate max-w-xs">{r.name}</td>
//                             <td className="py-3 px-4 text-gray-600">{r.group}</td>
//                             <td className="py-3 px-4 text-gray-600">{r.ticket}</td>
//                             <td className="py-3 px-4 text-gray-600">{r.receipt}</td>
//                             <td className=" text-gray-600 uppercase text-xs bg-gray-100 rounded-full px-2 py-1 w-fit">
//                               {r.mode}
//                             </td>
//                             <td className="py-3 px-4 text-right font-semibold text-gray-800">{formatINR(r.amount)}</td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </section>

//               <div className="text-right text-xs text-gray-400">Data is refreshed in real-time from secure endpoints</div>
//             </main>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

export default function Analytics() {}

// // KPI Component
// function Kpi({ title, value, accent = "indigo" }) {
//   const accentClasses = {
//     indigo: "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700",
//     emerald: "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700",
//     violet: "from-violet-50 to-violet-100 border-violet-200 text-violet-700",
//     violet: "from-violet-50 to-violet-100 border-violet-200 text-violet-700",
//     cyan: "from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-700",
//     amber: "from-amber-50 to-amber-100 border-amber-200 text-amber-700",
//   };

//   const cls = accentClasses[accent] || accentClasses.indigo;

//   return (
//     <div className={`rounded-2xl border bg-gradient-to-br ${cls} p-5 shadow-sm hover:shadow-md transition-shadow duration-200`}>
//       <div className="flex items-center gap-2">
//         <p className="text-sm font-medium text-gray-700">{title}</p>
//       </div>
//       <p className="text-xl font-bold mt-2 text-gray-800">{value}</p>
//     </div>
//   );
// }