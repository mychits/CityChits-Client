import React, { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";
import api from "../instance/TokenInstance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#4F46E5", "#22C55E", "#F97316", "#EF4444"];

// Number formatting helpers
const formatNumber = (num) =>
  Number.isFinite(num) ? num.toLocaleString("en-IN") : "0";

const formatCurrency = (num) =>
  Number.isFinite(num) ? `₹${Math.round(num).toLocaleString("en-IN")}` : "₹0";

const formatShortCurrency = (num) => {
  if (!Number.isFinite(num) || num <= 0) return "₹0";
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}k`;
  return `₹${num}`;
};

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    customers: 0,
    agents: 0,
    groups: 0,
    enrollments: 0,
    staffs: 0,
    employees: 0,
    totalCollection: 0,
    monthlyCollection: 0,
    yearlyTotal: 0,
    monthlyAverage: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [dueCollectedData, setDueCollectedData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [
          usersRes,
          agentsRes,
          groupsRes,
          staffsRes,
          enrollmentsRes,
          employeesRes,
          totalPaymentsRes,
          monthlyPaymentsRes,
        ] = await Promise.all([
          api.get("/user/get-user"),
          api.get("/agent/get"),
          api.get("/group/get-group-admin"),
          api.get("/agent/get-agent"),
          api.get("/enroll/get-enroll"),
          api.get("/agent/get-employee"),
          api.get("/payment/get-total-payment-amount"),
          api.get("/payment/get-current-month-payment", {
            params: {
              from_date: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              )
                .toISOString()
                .split("T")[0],
              to_date: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0
              )
                .toISOString()
                .split("T")[0],
            },
          }),
        ]);

        // Counts
        const customersCount = usersRes.data?.length || 0;
        const agentsCount = agentsRes.data?.agent?.length || 0;
        const groupsCount = groupsRes.data?.length || 0;
        const staffsCount = staffsRes.data?.length || 0;
        const enrollmentsCount = enrollmentsRes.data?.length || 0;
        const employeesCount = employeesRes.data?.employee?.length || 0;

        const totalCollection =
          Number(totalPaymentsRes?.data?.totalAmount) || 0;
        const monthlyCollection =
          Number(monthlyPaymentsRes?.data?.monthlyPayment) || 0;

        // Monthly collections (last 12 months)
        const today = new Date();
        const monthPromises = [];

        for (let i = 11; i >= 0; i--) {
          const from_date = new Date(today.getFullYear(), today.getMonth() - i, 1)
            .toISOString()
            .split("T")[0];
          const to_date = new Date(
            today.getFullYear(),
            today.getMonth() - i + 1,
            0
          )
            .toISOString()
            .split("T")[0];

          monthPromises.push(
            api.get("/payment/get-payments-by-dates", {
              params: { from_date, to_date },
            })
          );
        }

        const monthlyResults = await Promise.all(monthPromises);

        const monthlyDataFormatted = monthlyResults.map((res, idx) => {
          const date = new Date(today.getFullYear(), today.getMonth() - 11 + idx, 1);
          const monthName = date.toLocaleString("default", { month: "short" });

          const total = Array.isArray(res.data)
            ? res.data.reduce((acc, p) => acc + (p.amount || 0), 0)
            : Number(res.data?.totalAmount) || 0;

          return { month: monthName, collection: Math.round(total) || 0 };
        });

        setMonthlyData(monthlyDataFormatted);

        const yearlyTotal = monthlyDataFormatted.reduce(
          (acc, m) => acc + (m.collection || 0),
          0
        );
        const monthlyAverage =
          yearlyTotal > 0 ? Math.round(yearlyTotal / 12) : 0;

        setSummary({
          customers: customersCount,
          agents: agentsCount,
          groups: groupsCount,
          enrollments: enrollmentsCount,
          staffs: staffsCount,
          employees: employeesCount,
          totalCollection,
          monthlyCollection,
          yearlyTotal,
          monthlyAverage,
        });

        // Example: due vs collected (dummy fallback)
        setDueCollectedData([
          { name: "Collected", value: monthlyCollection || 0 },
          { name: "Due", value: Math.max(yearlyTotal - monthlyCollection, 0) },
        ]);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading Analytics...
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 mt-20">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Analytics <span className="text-custom-violet">Dashboard</span>
          </h1>

          {/* Line chart at the top */}
          <div className="bg-white p-6 rounded-xl shadow mb-10">
            <h2 className="text-lg font-semibold mb-4">
              Monthly Collection Trend (Last 12 Months)
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatShortCurrency} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="collection"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              { label: "Customers", value: summary.customers, isCurrency: false },
              { label: "Agents", value: summary.agents, isCurrency: false },
              { label: "Employees", value: summary.employees, isCurrency: false },
              { label: "Groups", value: summary.groups, isCurrency: false },
              { label: "Enrollments", value: summary.enrollments, isCurrency: false },
              { label: "Total Collection", value: summary.totalCollection, isCurrency: true },
              { label: "Monthly Collection", value: summary.monthlyCollection, isCurrency: true },
              { label: "Yearly Collection", value: summary.yearlyTotal, isCurrency: true },
              { label: "Monthly Avg", value: summary.monthlyAverage, isCurrency: true },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
              >
                <h2 className="text-lg font-semibold text-gray-700">
                  {item.label}
                </h2>
                <p className="text-2xl font-bold text-indigo-600 mt-2">
                  {item.isCurrency
                    ? formatCurrency(item.value)
                    : formatNumber(item.value)}
                </p>
              </div>
            ))}
          </div>

          {/* Pie chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Due vs Collected</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={dueCollectedData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {dueCollectedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => formatCurrency(val)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
