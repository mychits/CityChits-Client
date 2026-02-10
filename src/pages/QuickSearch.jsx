import { useEffect, useState, useMemo, useCallback } from "react";
import { Table, Tooltip, Card, Tabs, Input, Button } from "antd";
import Sidebar from "../components/layouts/Sidebar";
import api from "../instance/TokenInstance";
import CircularLoader from "../components/loaders/CircularLoader";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";
import Fuse from "fuse.js";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import Navbar from "../components/layouts/Navbar";

// Static configurations outside component to avoid recreation
const FILTERS_CONFIG = [
  { id: "1", filterName: "ID", key: "customer_id" },
  { id: "2", filterName: "Name", key: "name" },
  { id: "3", filterName: "Phone", key: "phone_number" },
  { id: "4", filterName: "Aadhaar", key: "aadhaar_number" },
  { id: "5", filterName: "Pan", key: "pan_number" },
];

const QuickSearch = () => {
  const navigate = useNavigate();

  // States for all entity types
  const [tableUsers, setTableUsers] = useState([]);
  const [tableLeads, setTableLeads] = useState([]);
  const [tableAgents, setTableAgents] = useState([]);
  const [tableEmployees, setTableEmployees] = useState([]);

  const [selectedExactMatch, setSelectedExactMatch] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });

  // Consolidated Loading State
  const [apiLoaders, setApiLoaders] = useState({
    users: false,
    leads: false,
    agents: false,
    employees: false,
  });

  const isAnyApiLoading = Object.values(apiLoaders).some((loading) => loading);

  // --- Data Fetching ---

  const updateApiLoader = useCallback((apiName, loading) => {
    setApiLoaders((prev) => ({ ...prev, [apiName]: loading }));
  }, []);

  // Fetch Users
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
          aadhaar_number: u.adhaar_no || "—",
          pan_number: u.pan_no || "—",
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
  }, [reloadTrigger, updateApiLoader]);

  // Fetch Leads
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
          aadhaar_number: l.adhaar_no || l.lead_aadhaar || "—",
          pan_number: l.pan_no || l.lead_pan || "—",
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
  }, [reloadTrigger, updateApiLoader]);

  // Fetch Agents
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
          aadhaar_number: a.adhaar_no || "—",
          pan_number: a.pan_no || "—",
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
  }, [reloadTrigger, updateApiLoader]);

  // Fetch Employees
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
          aadhaar_number: e.adhaar_no || "—",
          pan_number: e.pan_no || "—",
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
  }, [reloadTrigger, updateApiLoader]);

  // Reset selection when search text changes
  useEffect(() => {
    setSelectedExactMatch(null);
  }, [searchText]);


  // --- Computed Values (Memoized for Performance) ---

  // Memoize combined data to avoid recalculating on unrelated renders
  const combinedData = useMemo(() => [
    ...tableUsers, 
    ...tableLeads, 
    ...tableAgents, 
    ...tableEmployees
  ], [tableUsers, tableLeads, tableAgents, tableEmployees]);

  // Memoize active search keys
  const searchableKeys = useMemo(() => {
    if (activeFilters.length > 0) {
      return FILTERS_CONFIG.filter(f => activeFilters.includes(f.id)).map(f => f.key);
    }
    return FILTERS_CONFIG.map(f => f.key);
  }, [activeFilters]);

  // Memoize Columns
  const columns = useMemo(() => [
    {
      dataIndex: "customer_id",
      title: "ID",
      key: "customer_id",
      width: 120,
      render: (text) => <span>{text}</span>,
    },
    { dataIndex: "name", title: "Name", key: "name", width: 180 },
    { dataIndex: "phone_number", title: "Phone", key: "phone_number", width: 140 },
    { 
      dataIndex: "aadhaar_number", 
      title: "Aadhaar", 
      key: "aadhaar_number", 
      width: 150,
      render: (text) => <span className="font-mono text-sm">{text}</span>
    },
    { 
      dataIndex: "pan_number", 
      title: "Pan", 
      key: "pan_number", 
      width: 140,
      render: (text) => <span className="font-mono text-sm uppercase">{text}</span>
    },
    {
      key: "action",
      width: 100,
      render: (_, record) => {
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
          route = `/customer-view?user_id=${record._id}`;
          tooltip = "View Customer";
        }

        return (
          <Tooltip title={tooltip}>
            <button
              onClick={() => navigate(route)}
              className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-violet-600 hover:text-white hover:shadow transition"
            >
              <EyeOutlined className="text-lg" /> <span>View</span>
            </button>
          </Tooltip>
        );
      },
    },
  ], [navigate]);

  // --- Search Logic ---

  // Memoize search results for the active tab
  const getProcessedResults = useCallback((tabKey) => {
    let dataSource = [];
    if (tabKey === "customers") dataSource = tableUsers;
    else if (tabKey === "leads") dataSource = tableLeads;
    else if (tabKey === "agents") dataSource = tableAgents;
    else if (tabKey === "employees") dataSource = tableEmployees;
    else dataSource = combinedData;

    // If no search text, return "all" mode
    if (!searchText.trim()) {
      return { mode: 'all', dataSource };
    }

    // Initialize Fuse
    // Note: Creating Fuse is expensive, so we do it only when data/search changes
    const fuse = new Fuse(dataSource, {
      includeScore: true,
      keys: searchableKeys,
      threshold: 0.3,
    });

    const results = fuse.search(searchText);
    let exactMatches = results.filter(r => r.score <= 0.05).map(r => r.item);
    let relatedMatches = results.filter(r => r.score > 0.05).map(r => r.item);

    // Handle manually selected exact match from related
    if (selectedExactMatch) {
      // If the selected exact match is already in the exact matches, keep it there
      if (!exactMatches.find(m => m._id === selectedExactMatch._id)) {
         exactMatches = [selectedExactMatch];
      }
      // Remove from related to avoid duplicates
      relatedMatches = relatedMatches.filter((item) => item._id !== selectedExactMatch._id);
    }

    return { mode: 'search', exactMatches, relatedMatches, hasResults: results.length > 0 };
  }, [searchText, searchableKeys, combinedData, tableUsers, tableLeads, tableAgents, tableEmployees, selectedExactMatch]);

  // --- Handlers ---

  const handleFilterToggle = (id) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // --- Render Helpers ---

  const renderContent = (tabKey) => {
    if (isAnyApiLoading) {
      return (
        <div className="flex justify-center py-12">
          <CircularLoader isLoading={true} failure={false} data="Records" />
        </div>
      );
    }

    const searchState = getProcessedResults(tabKey);

    // Case 1: No Search
    if (searchState.mode === 'all') {
      return (
        <div className="overflow-x-auto">
          <Table
            pagination={{ pageSize: 10, showSizeChanger: false, hideOnSinglePage: true }}
            scroll={{ x: "max-content" }}
            columns={columns}
            dataSource={searchState.dataSource}
            rowKey="_id"
            size="middle"
          />
        </div>
      );
    }

    // Case 2: No Results Found
    if (!searchState.hasResults) {
      return (
        <div className="text-center py-12">
          <div className="inline-block p-3 rounded-full bg-gray-100 mb-3">
            <SearchOutlined className="text-xl text-gray-400" />
          </div>
          <p className="text-gray-500">
            No matches found in{" "}
            <span className="font-medium">
              {tabKey === "all" ? "all records" : tabKey}
            </span>
            .
          </p>
        </div>
      );
    }

    // Case 3: Search Results
    return (
      <div>
        {searchState.exactMatches.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-violet-50 border border-violet-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-violet-600"></div>
              <h4 className="text-violet-800 font-medium">Exact Match</h4>
            </div>
            <Table
              pagination={false}
              scroll={{ x: "max-content" }}
              columns={columns}
              dataSource={[searchState.exactMatches[0]]}
              rowKey="_id"
              size="middle"
            />
          </div>
        )}

        {searchState.relatedMatches.length > 0 && (
          <div>
            <h4 className="text-gray-700 font-medium mb-4 flex items-center gap-2">
              Related Results
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                {searchState.relatedMatches.length} found
              </span>
            </h4>
            <Table
              pagination={{ pageSize: 8, showSizeChanger: false }}
              scroll={{ x: "max-content" }}
              columns={columns}
              dataSource={searchState.relatedMatches}
              rowKey="_id"
              size="middle"
              onRow={(record) => ({
                onClick: () => setSelectedExactMatch(record),
              })}
              rowClassName={() => "cursor-pointer hover:bg-violet-50 transition-all"}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex mt-20">
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

        <div className="flex-1 p-4 md:p-8 md:mr-11 pb-8">
          {/* Header */}
          <header className="mb-6">
            <h1 className="text-3xl sm:text-3xl font-bold text-gray-500 mb-2">
              AI <span className="text-violet-700">Search</span>
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Search across your data. Switch tabs to focus on a specific type.
            </p>
          </header>

          {/* Search & Filters */}
          <Card
            className="mb-6 shadow-sm border border-gray-200 rounded-xl"
            bodyStyle={{ padding: "1.25rem" }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="relative w-full lg:w-1/3">
                <input
                  type="text"
                  placeholder="Search by ID, Name, Phone, Aadhaar, or Pan..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-12 pr-5 py-2.5 text-sm shadow-sm focus:border-violet-600 focus:ring-2 focus:ring-violet-200 outline-none transition"
                  autoFocus
                />
                <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              </div>

              <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                {FILTERS_CONFIG.map((filter) => {
                  const isActive = activeFilters.includes(filter.id);
                  return (
                    <Tooltip
                      key={filter.id}
                      title={`Search by ${filter.filterName}`}
                      placement="top"
                    >
                      <button
                        onClick={() => handleFilterToggle(filter.id)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                          isActive
                            ? "bg-violet-600 text-white shadow"
                            : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {filter.filterName}
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Card className="shadow-md border border-gray-200 rounded-xl overflow-hidden">
            <Tabs
              defaultActiveKey="all"
              animated={false}
              size="large"
              items={[
                { key: "all", label: "All", children: renderContent("all") },
                { key: "customers", label: "Customers", children: renderContent("customers") },
                { key: "leads", label: "Leads", children: renderContent("leads") },
                { key: "agents", label: "Agents", children: renderContent("agents") },
                { key: "employees", label: "Employees", children: renderContent("employees") },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;