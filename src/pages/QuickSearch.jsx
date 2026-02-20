import { useEffect, useState, useMemo, useCallback } from "react";
import { Table, Tooltip, Card, Tabs, Input, Button, Tag } from "antd";
import { 
  UserOutlined, 
  UserSwitchOutlined, 
  TeamOutlined, 
  SafetyCertificateOutlined,
  PhoneOutlined, 
  IdcardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import Sidebar from "../components/layouts/Sidebar";
import api from "../instance/TokenInstance";
import CircularLoader from "../components/loaders/CircularLoader";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";
import Fuse from "fuse.js";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import Navbar from "../components/layouts/Navbar";

// --- Custom Hook for Debouncing ---
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Static configurations
const FILTERS_CONFIG = [
  { id: "1", filterName: "ID", key: "customer_id" },
  { id: "2", filterName: "Name", key: "name" },
  { id: "3", filterName: "Phone", key: "phone_number" },
  { id: "4", filterName: "Aadhaar", key: "aadhaar_number" },
  { id: "5", filterName: "Pan", key: "pan_number" },
];

const QuickSearch = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all"); // Track active tab

  // States
  const [tableUsers, setTableUsers] = useState([]);
  const [tableLeads, setTableLeads] = useState([]);
  const [tableAgents, setTableAgents] = useState([]);
  const [tableEmployees, setTableEmployees] = useState([]);
  const [selectedExactMatch, setSelectedExactMatch] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [searchText, setSearchText] = useState(""); // Raw input
  const [activeFilters, setActiveFilters] = useState([]);
  
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });

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
          approval_status: u.approval_status,
        }));
        setTableUsers(formatted);
      } catch (error) { console.error("Error fetching users:", error); }
      finally { updateApiLoader('users', false); }
    };
    fetchUsers();
  }, [reloadTrigger, updateApiLoader]);

  useEffect(() => {
    const fetchLeads = async () => {
      updateApiLoader('leads', true);
      try {
        const response = await api.get("/lead/get-lead");
        const formatted = response.data.map((l, i) => ({
          _id: l._id, id: i + 1, name: l.lead_name || "—", phone_number: l.lead_phone || "—",
          address: l.lead_address || "—", pincode: l.pincode || "—", customer_id: l.leadCode,
          collection_area: l.group_id?.group_name || "—", customer_status: "Active",
          aadhaar_number: l.adhaar_no || l.lead_aadhaar || "—", pan_number: l.pan_no || l.lead_pan || "—",
          isLead: true,
        }));
        setTableLeads(formatted);
      } catch (error) { console.error("Error fetching leads:", error); }
      finally { updateApiLoader('leads', false); }
    };
    fetchLeads();
  }, [reloadTrigger, updateApiLoader]);

  useEffect(() => {
    const fetchAgents = async () => {
      updateApiLoader('agents', true);
      try {
        const response = await api.get("/agent/get");
        const formatted = (response.data?.agent || []).map((a, i) => ({
          _id: a._id, id: i + 1, name: a.name || "—", phone_number: a.phone_number || "—",
          address: a.address || "—", pincode: a.pincode || "—", customer_id: a.employeeCode,
          collection_area: a.designation_id?.title || "—", customer_status: "Active",
          aadhaar_number: a.adhaar_no || "—", pan_number: a.pan_no || "—", isAgent: true,
        }));
        setTableAgents(formatted);
      } catch (error) { console.error("Error fetching agents:", error); }
      finally { updateApiLoader('agents', false); }
    };
    fetchAgents();
  }, [reloadTrigger, updateApiLoader]);

  useEffect(() => {
    const fetchEmployees = async () => {
      updateApiLoader('employees', true);
      try {
        const response = await api.get("/agent/get-employee");
        const formatted = (response.data?.employee || []).map((e, i) => ({
          _id: e._id, id: i + 1, name: e.name || "—", phone_number: e.phone_number || "—",
          address: e.address || "—", pincode: e.pincode || "—", customer_id: e.employeeCode,
          collection_area: e.designation_id?.title || "—", customer_status: "Active",
          aadhaar_number: e.adhaar_no || "—", pan_number: e.pan_no || "—", isEmployee: true,
        }));
        setTableEmployees(formatted);
      } catch (error) { console.error("Error fetching employees:", error); }
      finally { updateApiLoader('employees', false); }
    };
    fetchEmployees();
  }, [reloadTrigger, updateApiLoader]);

  useEffect(() => { setSelectedExactMatch(null); }, [searchText]);

  // --- Computed Values ---
  
  // Optimized: Only runs when underlying data changes
  const combinedData = useMemo(() => {
    const customerPhoneSet = new Set(tableUsers.map(user => user.phone_number));
    const uniqueLeadsMap = new Map();

    tableLeads.forEach(lead => {
      if (customerPhoneSet.has(lead.phone_number)) return;
      if (!uniqueLeadsMap.has(lead.phone_number)) {
        uniqueLeadsMap.set(lead.phone_number, lead);
      }
    });

    const finalLeads = Array.from(uniqueLeadsMap.values());
    return [
      ...tableUsers,
      ...finalLeads,
      ...tableAgents,
      ...tableEmployees
    ];
  }, [tableUsers, tableLeads, tableAgents, tableEmployees]);

  const searchableKeys = useMemo(() => {
    if (activeFilters.length > 0) {
      return FILTERS_CONFIG.filter(f => activeFilters.includes(f.id)).map(f => f.key);
    }
    return FILTERS_CONFIG.map(f => f.key);
  }, [activeFilters]);

  const getTypeInfo = (record) => {
    if (record.isLead) return { label: "Lead", color: "orange", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: <UserSwitchOutlined className="text-2xl" /> };
    if (record.isAgent) return { label: "Agent", color: "purple", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: <TeamOutlined className="text-2xl" /> };
    if (record.isEmployee) return { label: "Employee", color: "cyan", bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", icon: <SafetyCertificateOutlined className="text-2xl" /> };
    if (record.isCustomer) return { label: "Customer", color: "blue", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: <UserOutlined className="text-2xl" /> };
    return { label: "Unknown", color: "default", bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", icon: <IdcardOutlined className="text-2xl" /> };
  };

  const getApprovalStatus = (record) => {
    if (!record.isCustomer) return null;
    if (record.approval_status === "true") return { text: "Approved", color: "success" };
    if (record.approval_status === "false") return { text: "Pending", color: "warning" };
    return { text: "Approved", color: "success" };
  };

  const columns = useMemo(() => [
    {
      title: "SL. NO",
      key: "s_no",
      width: 80,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Type", key: "type", width: 100,
      render: (_, record) => {
        const info = getTypeInfo(record);
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    { dataIndex: "customer_id", title: "ID", key: "customer_id", width: 120 },
    { dataIndex: "name", title: "Name", key: "name", width: 180 },
    { dataIndex: "phone_number", title: "Phone", key: "phone_number", width: 140 },
    { 
      dataIndex: "aadhaar_number", title: "Aadhaar", key: "aadhaar_number", width: 150,
      render: (text) => <span className="font-mono text-sm">{text}</span>
    },
    { 
      dataIndex: "pan_number", title: "Pan", key: "pan_number", width: 140,
      render: (text) => <span className="font-mono text-sm uppercase">{text}</span>
    },
    {
      key: "action", width: 100,
      render: (_, record) => {
        let route = "#", tooltip = "";
        if (record.isLead) { route = `/reports/lead-report?lead_id=${record._id}`; tooltip = "View Lead"; }
        else if (record.isAgent) { route = `/staff-menu/agent?agent_id=${record._id}`; tooltip = "View Agent"; }
        else if (record.isEmployee) { route = `/staff-menu/employee-menu/employee?employee_id=${record._id}`; tooltip = "View Employee"; }
        else { route = `/customer-view?user_id=${record._id}`; tooltip = "View Customer"; }

        return (
          <Tooltip title={tooltip}>
            <button onClick={() => navigate(route)} className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-violet-600 hover:text-white hover:shadow transition">
              <EyeOutlined className="text-lg" /> <span>View</span>
            </button>
          </Tooltip>
        );
      },
    },
  ], [navigate]);

  // --- Optimized Search Logic ---
  
  // 1. Debounce the search text
  const debouncedSearchText = useDebounce(searchText, 300);

  // 2. Determine current data source based on active tab
  const currentDataSource = useMemo(() => {
    if (activeTab === "customers") return tableUsers;
    if (activeTab === "leads") return tableLeads;
    if (activeTab === "agents") return tableAgents;
    if (activeTab === "employees") return tableEmployees;
    return combinedData;
  }, [activeTab, tableUsers, tableLeads, tableAgents, tableEmployees, combinedData]);

  // 3. Create Fuse Instance ONLY when data or keys change (Expensive Operation)
  const fuseInstance = useMemo(() => {
    if (!currentDataSource || currentDataSource.length === 0) return null;
    return new Fuse(currentDataSource, { 
      includeScore: true, 
      keys: searchableKeys, 
      threshold: 0.3 
    });
  }, [currentDataSource, searchableKeys]);

  // 4. Perform Search ONLY when debounced text changes (Fast Operation)
  const rawSearchResults = useMemo(() => {
    if (!debouncedSearchText.trim() || !fuseInstance) return [];
    return fuseInstance.search(debouncedSearchText);
  }, [debouncedSearchText, fuseInstance]);

  // 5. Process results for UI
  const getProcessedResults = useCallback(() => {
    if (!debouncedSearchText.trim()) {
      return { mode: 'all', dataSource: currentDataSource };
    }

    if (rawSearchResults.length === 0) {
      return { mode: 'search', hasResults: false };
    }

    let exactMatches = rawSearchResults.filter(r => r.score <= 0.05).map(r => r.item);
    let relatedMatches = rawSearchResults.filter(r => r.score > 0.05).map(r => r.item);

    if (selectedExactMatch) {
      if (!exactMatches.find(m => m._id === selectedExactMatch._id)) exactMatches = [selectedExactMatch];
      relatedMatches = relatedMatches.filter((item) => item._id !== selectedExactMatch._id);
    }

    return { 
      mode: 'search', 
      exactMatches, 
      relatedMatches, 
      hasResults: true 
    };
  }, [debouncedSearchText, currentDataSource, rawSearchResults, selectedExactMatch]);

  const handleFilterToggle = (id) => {
    setActiveFilters((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  // --- Render Helpers ---

  const renderContent = () => {
    if (isAnyApiLoading) {
      return <div className="flex justify-center py-12"><CircularLoader isLoading={true} failure={false} data="Records" /></div>;
    }

    const searchState = getProcessedResults();

    // Case 1: No Search
    if (searchState.mode === 'all') {
      return (
        <div className="overflow-x-auto">
          <Table pagination={{ pageSize: 10, showSizeChanger: false, hideOnSinglePage: true }} scroll={{ x: "max-content" }} columns={columns} dataSource={searchState.dataSource} rowKey="_id" size="middle" />
        </div>
      );
    }

    // Case 2: No Results
    if (!searchState.hasResults) {
      return (
        <div className="text-center py-12">
          <div className="inline-block p-3 rounded-full bg-gray-100 mb-3"><SearchOutlined className="text-xl text-gray-400" /></div>
          <p className="text-gray-500">No matches found in <span className="font-medium">{activeTab === "all" ? "all records" : activeTab}</span>.</p>
        </div>
      );
    }

    // Case 3: Search Results
    let topRecord = null;
    let tableRecords = [];

    if (searchState.exactMatches.length > 0) {
      topRecord = searchState.exactMatches[0];
      tableRecords = searchState.relatedMatches;
    } else if (searchState.relatedMatches.length > 0) {
      topRecord = searchState.relatedMatches[0];
      tableRecords = searchState.relatedMatches.slice(1);
    }

    const typeInfo = topRecord ? getTypeInfo(topRecord) : null;
    const approvalStatus = topRecord ? getApprovalStatus(topRecord) : null;

    return (
      <div>
        {/* --- TOP HERO CARD --- */}
        {topRecord && (
          <div className={`mb-8 rounded-xl shadow-lg border-l-8 ${typeInfo.border} bg-white overflow-hidden`}>
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Left: Type & Icon */}
              <div className="flex items-start gap-5">
                <div className={`p-4 rounded-full ${typeInfo.bg} ${typeInfo.text} shadow-inner flex-shrink-0`}>
                  {typeInfo.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${typeInfo.bg} ${typeInfo.text}`}>
                      {typeInfo.label}
                    </span>
                    {searchState.exactMatches.includes(topRecord) && (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        Exact Match
                      </span>
                    )}
                    {approvalStatus && (
                       <Tag icon={approvalStatus.text === "Approved" ? <CheckCircleOutlined /> : <ClockCircleOutlined />} color={approvalStatus.color}>
                        {approvalStatus.text}
                      </Tag>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800">{topRecord.name}</h2>
                  <div className="flex flex-col sm:flex-row sm:gap-6 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <IdcardOutlined className="text-gray-400" />
                      <span>ID: {topRecord.customer_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneOutlined className="text-gray-400" />
                      <span>{topRecord.phone_number}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Action */}
              <div className="flex-shrink-0">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<EyeOutlined />} 
                  onClick={() => {
                    let route = "#";
                    if (topRecord.isLead) route = `/reports/lead-report?lead_id=${topRecord._id}`;
                    else if (topRecord.isAgent) route = `/staff-menu/agent?agent_id=${topRecord._id}`;
                    else if (topRecord.isEmployee) route = `/staff-menu/employee-menu/employee?employee_id=${topRecord._id}`;
                    else route = `/customer-view?user_id=${topRecord._id}`;
                    navigate(route);
                  }}
                  className="h-12 px-6 rounded-lg shadow-md bg-violet-600 hover:bg-violet-700 border-none"
                >
                  View Profile
                </Button>
              </div>
            </div>
            
            {/* Optional: Extra details row for the Hero card */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
               <div>
                 <span className="block font-semibold text-gray-400">Aadhaar</span>
                 {topRecord.aadhaar_number}
               </div>
               <div>
                 <span className="block font-semibold text-gray-400">Pan</span>
                 {topRecord.pan_number}
               </div>
               <div>
                 <span className="block font-semibold text-gray-400">Area</span>
                 {topRecord.collection_area}
               </div>
               <div>
                 <span className="block font-semibold text-gray-400">Status</span>
                 {topRecord.customer_status || 'Active'}
               </div>
            </div>
          </div>
        )}

        {/* --- BOTTOM TABLE SECTION --- */}
        {tableRecords.length > 0 && (
          <div>
            <h4 className="text-gray-700 font-semibold mb-4 text-lg border-l-4 border-gray-300 pl-3">
              Other Results
            </h4>
            <Table
              pagination={{ pageSize: 5, showSizeChanger: false }}
              scroll={{ x: "max-content" }}
              columns={columns}
              dataSource={tableRecords}
              rowKey="_id"
              size="middle"
              onRow={(record) => ({
                onClick: () => {
                  setSelectedExactMatch(record);
                },
              })}
              rowClassName={() => "cursor-pointer hover:bg-gray-50 transition-all"}
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
        <Navbar onGlobalSearchChangeHandler={(e) => setSearchText(e.target.value)} visibility={true} />
        <CustomAlertDialog type={alertConfig.type} isVisible={alertConfig.visibility} message={alertConfig.message} onClose={() => setAlertConfig((prev) => ({ ...prev, visibility: false }))} />

        <div className="flex-1 p-4 md:p-8 md:mr-11 pb-8">
          <header className="mb-6">
            <h1 className="text-3xl sm:text-3xl font-bold text-gray-500 mb-2">AI <span className="text-violet-700">Search</span></h1>
            <p className="text-gray-600 max-w-2xl">Professional search results prioritized by relevance.</p>
          </header>

          <Card className="mb-6 shadow-sm border border-gray-200 rounded-xl" bodyStyle={{ padding: "1.25rem" }}>
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
                    <Tooltip key={filter.id} title={`Search by ${filter.filterName}`} placement="top">
                      <button onClick={() => handleFilterToggle(filter.id)} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${isActive ? "bg-violet-600 text-white shadow" : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"}`}>
                        {filter.filterName}
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card className="shadow-md border border-gray-200 rounded-xl overflow-hidden">
            <Tabs 
              defaultActiveKey="all" 
              animated={false} 
              size="large" 
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              items={[
                { key: "all", label: "All", children: renderContent() },
                { key: "customers", label: "Customers", children: renderContent() },
                { key: "leads", label: "Leads", children: renderContent() },
                { key: "agents", label: "Agents", children: renderContent() },
                { key: "employees", label: "Employees", children: renderContent() },
              ]} 
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;