/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Tabs, Tooltip, Input } from "antd";
import Sidebar from "../components/layouts/Sidebar";
import api from "../instance/TokenInstance";
import CircularLoader from "../components/loaders/CircularLoader";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";
import { Table, Tag } from "antd";
import Fuse from "fuse.js";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, SearchOutlined, FilterOutlined, UserOutlined } from "@ant-design/icons";
import Navbar from "../components/layouts/Navbar";

const QuickSearch = () => {
  const navigate = useNavigate();

  // States for all entity types
  const [tableUsers, setTableUsers] = useState([]);
  const [tableLeads, setTableLeads] = useState([]);
  const [tableAgents, setTableAgents] = useState([]);
  const [tableEmployees, setTableEmployees] = useState([]);

  const [selectedExactMatch, setSelectedExactMatch] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [apiLoaders, setApiLoaders] = useState({
    users: false,
    leads: false,
    agents: false,
    employees: false
  });

  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });

  // Filters
  const filters = [
    { id: "1", filterName: "ID", key: "customer_id" },
    { id: "2", filterName: "Name", key: "name" },
    { id: "3", filterName: "Phone", key: "phone_number" },
  ];

  const searchableKeys = activeFilters.length > 0
    ? filters.filter(f => activeFilters.includes(f.id)).map(f => f.key)
    : filters.map(f => f.key);

  const combinedData = [...tableUsers, ...tableLeads, ...tableAgents, ...tableEmployees];

  // Function to update loading state
  const updateApiLoader = (apiName, loading) => {
    setApiLoaders(prev => ({
      ...prev,
      [apiName]: loading
    }));
  };

  // Check if any API is still loading
  const isAnyApiLoading = Object.values(apiLoaders).some(loading => loading);

  useEffect(() => {
    const fetchUsers = async () => {
      updateApiLoader('users', true);
      try {
        const response = await api.get("/user/get-user");
        const formatted = response.data.map((u, i) => ({
          _id: u._id,
          id: i + 1,
          name: u.full_name,
          phone_number: u.phone_number,
          address: u.address,
          pincode: u.pincode,
          customer_id: u.customer_id,
          collection_area: u.collection_area?.route_name,
          isCustomer: true,
        }));
        setTableUsers(formatted);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        updateApiLoader('users', false);
      }
    };
    fetchUsers();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchLeads = async () => {
      updateApiLoader('leads', true);
      try {
        const response = await api.get("/lead/get-lead");
        const formatted = response.data.map((l, i) => ({
          _id: l._id,
          id: i + 1,
          name: l.lead_name || "—",
          phone_number: l.lead_phone || "—",
          address: l.lead_address || "—",
          pincode: l.pincode || "—",
          customer_id: l.leadCode,
          collection_area: l.group_id?.group_name || "—",
          customer_status: "Active",
          isLead: true,
        }));
        setTableLeads(formatted);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        updateApiLoader('leads', false);
      }
    };
    fetchLeads();
  }, [reloadTrigger]);

  useEffect(() => {
    setSelectedExactMatch(null);
  }, [searchText]);

  useEffect(() => {
    const fetchAgents = async () => {
      updateApiLoader('agents', true);
      try {
        const response = await api.get("/agent/get");
        const formatted = (response.data?.agent || []).map((a, i) => ({
          _id: a._id,
          id: i + 1,
          name: a.name || "—",
          phone_number: a.phone_number || "—",
          address: a.address || "—",
          pincode: a.pincode || "—",
          customer_id: a.employeeCode,
          collection_area: a.designation_id?.title || "—",
          customer_status: "Active",
          isAgent: true,
        }));
        setTableAgents(formatted);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        updateApiLoader('agents', false);
      }
    };
    fetchAgents();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchEmployees = async () => {
      updateApiLoader('employees', true);
      try {
        const response = await api.get("/agent/get-employee");
        const formatted = (response.data?.employee || []).map((e, i) => ({
          _id: e._id,
          id: i + 1,
          name: e.name || "—",
          phone_number: e.phone_number || "—",
          address: e.address || "—",
          pincode: e.pincode || "—",
          customer_id: e.employeeCode,
          collection_area: e.designation_id?.title || "—",
          customer_status: "Active",
          isEmployee: true,
        }));
        setTableEmployees(formatted);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        updateApiLoader('employees', false);
      }
    };
    fetchEmployees();
  }, [reloadTrigger]);

  const columns = [
    {
      dataIndex: "customer_id",
      title: <span className="font-semibold text-gray-700">ID</span>,
      key: "customer_id",
      width: 140,
      render: (text) => (
        <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {text}
        </span>
      ),
    },
    { 
      dataIndex: "name", 
      title: <span className="font-semibold text-gray-700">Name</span>, 
      key: "name", 
      width: 200,
      render: (text) => <span className="font-medium text-gray-900">{text}</span>
    },
    { 
      dataIndex: "phone_number", 
      title: <span className="font-semibold text-gray-700">Phone</span>, 
      key: "phone_number", 
      width: 160,
      render: (text) => <span className="text-gray-600">{text}</span>
    },
    {
      dataIndex: "collection_area",
      title: <span className="font-semibold text-gray-700">Area / Role</span>,
      key: "collection_area",
      width: 180,
      render: (text) => <span className="text-gray-500 text-sm">{text}</span>,
    },
    {
      key: "action",
      width: 120,
      align: "right",
      render: (_, record) => {
        if (!record) return null;

        let route = "#";
        let tooltip = "";

        if (record.isLead) {
          route = `/reports/lead-report?lead_id=${record._id}`;
          tooltip = "View Lead";
        } else if (record.isAgent) {
          route = `/staff-menu/agent?agent_id=${record._id}`;
          tooltip = "View Agent";
        } else if (record.isEmployee) {
          route = `/staff-menu/employee-menu/employee?employee_id=${record._id}`;
          tooltip = "View Employee";
        } else {
          route = `customer-view?user_id=${record._id}`;
          tooltip = "View Customer";
        }

        return (
          <Tooltip title={tooltip}>
            <button
              onClick={() => navigate(route)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <EyeOutlined /> <span>View</span>
            </button>
          </Tooltip>
        );
      },
    },
  ];

  const handleFilterToggle = (id) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Styled Empty State Component to match Home.jsx
  const SearchEmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="p-4 rounded-full bg-gray-100 mb-4 shadow-inner">
        <SearchOutlined className="text-3xl text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No Results Found
      </h3>
      <p className="text-gray-500 text-center">
        {message}
      </p>
    </div>
  );

  const renderSearchResults = (tabKey) => {
    if (isAnyApiLoading) {
      return (
        <div className="flex justify-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
          <CircularLoader isLoading={true} failure={false} data="Records" />
        </div>
      );
    }

    let dataSource = [];
    if (tabKey === "customers") dataSource = tableUsers;
    else if (tabKey === "leads") dataSource = tableLeads;
    else if (tabKey === "agents") dataSource = tableAgents;
    else if (tabKey === "employees") dataSource = tableEmployees;
    else dataSource = combinedData;

    if (!searchText.trim()) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <Table
            pagination={{ pageSize: 10, showSizeChanger: false, hideOnSinglePage: true }}
            scroll={{ x: "max-content" }}
            columns={columns}
            dataSource={dataSource}
            rowKey="_id"
            size="middle"
            className="professional-table"
          />
        </div>
      );
    }

    const fuse = new Fuse(dataSource, {
      includeScore: true,
      keys: searchableKeys,
      threshold: 0.3,
    });

    const results = fuse.search(searchText);
    let exactMatches = results.filter(r => r.score <= 0.05).map(r => r.item);
    let relatedMatches = results.filter(r => r.score > 0.05).map(r => r.item);

    if (selectedExactMatch) {
      exactMatches = [selectedExactMatch];
      relatedMatches = relatedMatches.filter(
        (item) => item._id !== selectedExactMatch._id
      );
    }

    if (results.length === 0) {
      return <SearchEmptyState message={`We couldn't find any matches for "${searchText}"`} />;
    }

    return (
      <div>
        {exactMatches.length > 0 && (
          <div className="mb-6 p-5 rounded-xl bg-blue-50 border border-blue-200 shadow-sm animate-fadeIn relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
                <SearchOutlined className="text-lg" />
              </div>
              <h4 className="text-blue-900 font-bold text-lg">Exact Match Found</h4>
            </div>
            <div className="bg-white rounded-lg border border-blue-100 shadow-sm overflow-hidden">
              <Table
                pagination={false}
                scroll={{ x: "max-content" }}
                columns={columns}
                dataSource={[exactMatches[0]]}
                rowKey="_id"
                size="middle"
                showHeader={false}
              />
            </div>
          </div>
        )}

        {relatedMatches.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h4 className="text-gray-800 font-bold flex items-center gap-2">
                <span>Related Results</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {relatedMatches.length}
                </span>
              </h4>
              <span className="text-xs text-gray-500">Click row to highlight</span>
            </div>
            <Table
              pagination={{ pageSize: 8, showSizeChanger: false }}
              scroll={{ x: "max-content" }}
              columns={columns}
              dataSource={relatedMatches}
              rowKey="_id"
              size="middle"
              onRow={(record) => ({
                onClick: () => setSelectedExactMatch(record),
                className: "cursor-pointer hover:bg-blue-50/50 transition-colors"
              })}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen mt-20 bg-gray-50">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        
        /* Professional Table Overrides */
        .professional-table .ant-table-thead > tr > th {
          background-color: #f9fafb;
          color: #374151;
          font-weight: 600;
          border-bottom: 1px solid #e5e7eb;
        }
        .professional-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f3f4f6;
        }
        .professional-table .ant-table-tbody > tr:hover > td {
          background-color: #f9fafb !important;
        }
      `}</style>

      <div className="flex">
        <Sidebar />
        <Navbar
          onGlobalSearchChangeHandler={(e) => setSearchText(e.target.value)}
          visibility={true}
        />
        
        <CustomAlertDialog
          type={alertConfig.type}
          isVisible={alertConfig.visibility}
          message={alertConfig.message}
          onClose={() => setAlertConfig((prev) => ({ ...prev, visibility: false }))}
        />

        <div className="flex-1 p-4 md:p-8 md:ml-16 md:mr-11 md:mt-11 pb-8">
          {/* Professional Header */}
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  AI <span className="text-blue-600">Search</span>
                </h1>
                <p className="text-gray-600 max-w-2xl">
                  Instantly find customers, leads, agents, and employees across your database.
                </p>
              </div>
            </div>
          </header>

          {/* Search & Filters Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 animate-fadeIn">
            <div className="flex flex-col xl:flex-row xl:items-center gap-6">
              {/* Search Input */}
              <div className="relative flex-1 group">
                <div className="relative flex items-center bg-white rounded-lg border border-gray-300 group-hover:border-blue-400 transition-all duration-300 shadow-sm group-hover:shadow-md px-4 py-2.5">
                  <SearchOutlined className="text-gray-400 text-lg group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search by ID, Name, or Phone..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full ml-3 outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                    autoFocus
                  />
                  {searchText && (
                    <button 
                      onClick={() => setSearchText("")}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center text-gray-500 mr-2">
                  <FilterOutlined className="mr-2" />
                  <span className="text-sm font-medium hidden sm:inline">Filter:</span>
                </div>
                {filters.map((filter) => {
                  const isActive = activeFilters.includes(filter.id);
                  return (
                    <Tooltip key={filter.id} title={`Search by ${filter.filterName}`}>
                      <button
                        onClick={() => handleFilterToggle(filter.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 border ${
                          isActive
                            ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm"
                        }`}
                      >
                        {filter.filterName}
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tabs and Results */}
          <div className="animate-fadeIn">
            <Tabs
              defaultActiveKey="all"
              animated={false}
              size="large"
              className="search-tabs"
              tabBarStyle={{ 
                marginBottom: '24px', 
                borderBottom: '1px solid #e5e7eb',
                fontWeight: '500'
              }}
              items={[
                { 
                  key: "all", 
                  label: <span className="text-gray-700 hover:text-blue-600 transition-colors">All Records</span>, 
                  children: renderSearchResults("all") 
                },
                { 
                  key: "customers", 
                  label: <span className="text-gray-700 hover:text-blue-600 transition-colors">Customers</span>, 
                  children: renderSearchResults("customers") 
                },
                { 
                  key: "leads", 
                  label: <span className="text-gray-700 hover:text-blue-600 transition-colors">Leads</span>, 
                  children: renderSearchResults("leads") 
                },
                { 
                  key: "agents", 
                  label: <span className="text-gray-700 hover:text-blue-600 transition-colors">Agents</span>, 
                  children: renderSearchResults("agents") 
                },
                { 
                  key: "employees", 
                  label: <span className="text-gray-700 hover:text-blue-600 transition-colors">Employees</span>, 
                  children: renderSearchResults("employees") 
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;