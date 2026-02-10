import React, { useEffect, useState } from "react";
import { Tabs, Tag, Tooltip } from "antd";
import Sidebar from "../components/layouts/Sidebar";
import api from "../instance/TokenInstance";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";
import { Table } from "antd";
import Fuse from "fuse.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import { 
  MdPerson, MdGroup, MdOutlinePersonSearch, MdBadge, 
  MdSearch, MdFilterList, MdRefresh 
} from "react-icons/md";
import { BsArrowRightShort, BsArrowUpRight } from "react-icons/bs";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi"; // Keeping trend icons if needed later, removing unused

const QuickSearch = () => {
  const navigate = useNavigate();

  // States
  const [tableUsers, setTableUsers] = useState([]);
  const [tableLeads, setTableLeads] = useState([]);
  const [tableAgents, setTableAgents] = useState([]);
  const [tableEmployees, setTableEmployees] = useState([]);
  const [selectedExactMatch, setSelectedExactMatch] = useState(null);

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
    { id: "1", filterName: "ID", key: "customer_id", icon: <MdBadge size={16} /> },
    { id: "2", filterName: "Name", key: "name", icon: <MdPerson size={16} /> },
    { id: "3", filterName: "Phone", key: "phone_number", icon: <MdOutlinePersonSearch size={16} /> },
  ];

  const searchableKeys = activeFilters.length > 0
    ? filters.filter(f => activeFilters.includes(f.id)).map(f => f.key)
    : filters.map(f => f.key);

  const combinedData = [...tableUsers, ...tableLeads, ...tableAgents, ...tableEmployees];

  const updateApiLoader = (apiName, loading) => {
    setApiLoaders(prev => ({ ...prev, [apiName]: loading }));
  };

  const isAnyApiLoading = Object.values(apiLoaders).some(loading => loading);
  const isDataEmpty = tableUsers.length === 0 && tableLeads.length === 0 && tableAgents.length === 0 && tableEmployees.length === 0;
  const showInitialLoader = isDataEmpty && isAnyApiLoading;

  // --- Data Fetching ---
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

  useEffect(() => {
    setSelectedExactMatch(null);
  }, [searchText]);

  // Columns for Ant Table
  const columns = [
    {
      dataIndex: "customer_id",
      title: "ID",
      key: "customer_id",
      width: 140,
      render: (text) => (
        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-medium tracking-wide">
          {text}
        </span>
      ),
    },
    { 
      dataIndex: "name", 
      title: "Name", 
      key: "name", 
      render: (text, record) => (
        <div className="flex items-center gap-3">
           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
             record.isCustomer ? 'bg-indigo-100 text-indigo-600' : 
             record.isLead ? 'bg-amber-100 text-amber-600' : 
             record.isAgent ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
           }`}>
             {text ? text.charAt(0).toUpperCase() : '?'}
           </div>
           <span className="font-bold text-slate-800">{text}</span>
        </div>
      )
    },
    { 
      dataIndex: "phone_number", 
      title: "Phone", 
      key: "phone_number",
      render: (text) => <span className="text-slate-600 font-medium">{text}</span>
    },
    {
      key: "action",
      width: 100,
      align: 'right',
      render: (_, record) => {
        if (!record) return null;

        let route = "#";
        let tooltip = "";

        if (record.isLead) {
          route = `/reports/lead-report?lead_id=${record._id}`;
          tooltip = "View Lead Details";
        } else if (record.isAgent) {
          route = `/staff-menu/agent?agent_id=${record._id}`;
          tooltip = "View Agent Profile";
        } else if (record.isEmployee) {
          route = `/staff-menu/employee-menu/employee?employee_id=${record._id}`;
          tooltip = "View Employee Profile";
        } else {
          route = `/customer-view?user_id=${record._id}`;
          tooltip = "View Customer Profile";
        }

        return (
          <Tooltip title={tooltip}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(route);
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              View <BsArrowRightShort size={18} />
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

  const renderSearchResults = (tabKey) => {
    if (isAnyApiLoading && !showInitialLoader) {
      return (
        <div className="space-y-3 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse border border-slate-100"></div>
          ))}
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
        <div className="overflow-x-auto pr-2">
          <Table
            pagination={{ pageSize: 8, showSizeChanger: false, className: "custom-pagination" }}
            scroll={{ x: "max-content" }}
            columns={columns}
            dataSource={dataSource}
            rowKey="_id"
            size="middle"
            showHeader={false} 
            rowClassName={() => `glass-table-row animate-fadeIn`}
            onRow={(record, index) => ({
                style: { animationDelay: `${index * 0.05}s` }
            })}
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
      relatedMatches = relatedMatches.filter((item) => item._id !== selectedExactMatch._id);
    }

    if (results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
            <MdSearch className="text-4xl text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No results found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search criteria or filters.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Exact Matches Section */}
        {exactMatches.length > 0 && (
          <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-1">
             <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                    <BsArrowUpRight size={14} />
                  </div>
                  <h4 className="text-indigo-900 font-bold uppercase tracking-wider text-xs">Best Match</h4>
                </div>
                <Table
                  pagination={false}
                  scroll={{ x: "max-content" }}
                  columns={columns}
                  dataSource={[exactMatches[0]]}
                  rowKey="_id"
                  size="middle"
                  showHeader={false}
                  rowClassName={() => "glass-table-row bg-white/80 hover:bg-white"}
                />
             </div>
          </div>
        )}

        {/* Related Matches */}
        {relatedMatches.length > 0 && (
          <div>
            <h4 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2 ml-2">
              Other Results <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px]">{relatedMatches.length}</span>
            </h4>
            <div className="overflow-x-auto pr-2">
              <Table
                pagination={{ pageSize: 6, showSizeChanger: false, className: "custom-pagination" }}
                scroll={{ x: "max-content" }}
                columns={columns}
                dataSource={relatedMatches}
                rowKey="_id"
                size="middle"
                showHeader={false}
                rowClassName="glass-table-row cursor-pointer hover:bg-white/60"
                onRow={(record, index) => ({
                    onClick: () => setSelectedExactMatch(record),
                    style: { animationDelay: `${index * 0.05}s` }
                })}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        onGlobalSearchChangeHandler={(e) => setSearchText(e.target.value)}
        visibility={true}
      />

      <main className="pt-28 pb-12 px-6 mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Data Discovery</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Global Search
            </h1>
            <p className="text-slate-600">
              Find customers, leads, agents, and employees instantly.
            </p>
          </div>
          
          <button 
            onClick={() => setReloadTrigger(prev => prev + 1)} 
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all flex items-center gap-2 shadow-sm"
          >
            <span className={`${reloadTrigger > 0 ? 'animate-spin' : ''}`}><MdRefresh size={18}/></span>
            Refresh Index
          </button>
        </div>

        {/* Search Hero Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full xl:w-1/2 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MdSearch className="text-slate-400 text-xl group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by ID, Name, Phone Number..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium text-lg"
                autoFocus
              />
            </div>

            {/* Filter Toggles */}
            <div className="flex flex-wrap gap-3 w-full xl:w-auto items-center">
              <div className="flex items-center gap-2 text-slate-400 font-semibold text-sm mr-2">
                 <MdFilterList /> Filters:
              </div>
              {filters.map((filter) => {
                const isActive = activeFilters.includes(filter.id);
                return (
                  <Tooltip key={filter.id} title={`Search by ${filter.filterName}`} placement="top">
                    <button
                      onClick={() => handleFilterToggle(filter.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 border ${
                        isActive
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200"
                          : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50"
                      }`}
                    >
                      {filter.icon} {filter.filterName}
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Container */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 min-h-[500px] shadow-sm">
          {showInitialLoader ? (
             <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Indexing Database...</p>
             </div>
          ) : (
            <Tabs
              defaultActiveKey="all"
              animated={false}
              size="large"
              className="search-tabs"
              items={[
                { 
                  key: "all", 
                  label: <span className="font-semibold text-slate-600 px-2">All Records</span>, 
                  children: renderSearchResults("all") 
                },
                { 
                  key: "customers", 
                  label: <span className="font-semibold text-slate-600 px-2">Customers</span>, 
                  children: renderSearchResults("customers") 
                },
                { 
                  key: "leads", 
                  label: <span className="font-semibold text-slate-600 px-2">Leads</span>, 
                  children: renderSearchResults("leads") 
                },
                { 
                  key: "agents", 
                  label: <span className="font-semibold text-slate-600 px-2">Agents</span>, 
                  children: renderSearchResults("agents") 
                },
                { 
                  key: "employees", 
                  label: <span className="font-semibold text-slate-600 px-2">Employees</span>, 
                  children: renderSearchResults("employees") 
                },
              ]}
            />
          )}
        </div>

      </main>

      <CustomAlertDialog
        type={alertConfig.type}
        isVisible={alertConfig.visibility}
        message={alertConfig.message}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visibility: false }))}
      />

      <style jsx global>{`
        /* Antd Table Customization to match Dashboard */
        .ant-table-wrapper .ant-table-pagination.ant-pagination {
          margin: 20px 0 0 0;
        }
        .custom-pagination .ant-pagination-item {
          background: #fff;
          border-color: #e2e8f0;
          border-radius: 8px;
          transition: all 0.3s;
        }
        .custom-pagination .ant-pagination-item:hover {
          border-color: #818cf8;
          color: #4f46e5;
        }
        .custom-pagination .ant-pagination-item-active {
          background: #4f46e5;
          border-color: #4f46e5;
        }
        .custom-pagination .ant-pagination-item-active a {
          color: white;
          font-weight: bold;
        }
        
        .glass-table-row {
          background: #fff;
          transition: all 0.2s ease-in-out;
          margin-bottom: 12px;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .glass-table-row:hover {
          border-color: #c7d2fe;
          background: #f8fafc;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .ant-table-tbody > tr > td {
          border-bottom: none !important;
          padding: 16px 24px !important;
        }
        .ant-table-thead > tr > th {
          background: transparent !important;
          border-bottom: none !important;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          padding-bottom: 16px;
        }
        
        /* Tab Customization */
        .search-tabs > .ant-tabs-nav {
          margin-bottom: 32px;
          border-bottom: 1px solid #f1f5f9;
        }
        .search-tabs > .ant-tabs-nav .ant-tabs-nav-wrap {
          justify-content: flex-start;
        }
        .search-tabs > .ant-tabs-nav .ant-tabs-tab {
          padding: 12px 20px;
          margin: 0 4px 0 0;
          border-radius: 12px;
          background: transparent;
          border: none;
          transition: all 0.3s;
          color: #64748b;
        }
        .search-tabs > .ant-tabs-nav .ant-tabs-tab:hover {
          color: #4f46e5;
          background: #f1f5f9;
        }
        .search-tabs > .ant-tabs-nav .ant-tabs-tab-active {
          background: #eef2ff;
          color: #4f46e5;
        }
        .search-tabs > .ant-tabs-ink-bar {
          display: none;
        }
        
        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default QuickSearch;