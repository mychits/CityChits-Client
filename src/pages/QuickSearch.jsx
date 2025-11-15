/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Tabs } from "antd";
import Sidebar from "../components/layouts/Sidebar";
import api from "../instance/TokenInstance";
import CircularLoader from "../components/loaders/CircularLoader";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";
import { Table, Tag, Tooltip, Card } from "antd";
import Fuse from "fuse.js";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
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
    // { id: "7", filterName: "Type", key: "customer_status" },
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

        console.log(formatted, "hello")

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
      title: "ID",
      key: "customer_id",
      width: 120,
      render: (text, record) => (
        <span >
          {text}
        </span>
      ),
    },
    { dataIndex: "name", title: "Name", key: "name", width: 180 },
    { dataIndex: "phone_number", title: "Phone", key: "phone_number", width: 140 },
    // {
    //   dataIndex: "customer_status",
    //   title: "Status",
    //   key: "customer_status",
    //   width: 100,
    //   render: (text, record) => { 
    //     if (!record) {
    //       return <Tag color="default">Invalid</Tag>;
    //     }

    //     let statusText = "Unknown"; 
    //     let color = "default";

    //     if (record.isCustomer) {
    //       statusText = record.customer_status || "Active";
    //       color = record.customer_status?.toLowerCase() === "active" ? "red" : "green";
    //     } else if (record.isLead) {
    //       statusText = "Active";
    //       color = "green";
    //     } else if (record.isAgent) {
    //       statusText = "Active";
    //       color = "green";
    //     } else if (record.isEmployee) {
    //       statusText = "Active";
    //       color = "green";
    //     }

    //     return <Tag color={color}>{statusText}</Tag>;
    //   },
    // },
    {
      key: "action",
      width: 100,
      render: (_, record) => {
        if (!record) return null;

        let route = "#";
        let tooltip = "";

        if (record.isLead) {
          route = `/lead?lead_id=${record._id}`;
          tooltip = "View Lead";
        } else if (record.isAgent) {
          route = `/agent?agent_id=${record._id}`;
          tooltip = "View Agent";
        } else if (record.isEmployee) {
          route = `/employee?employee_id=${record._id}`;
          tooltip = "View Employee";
        } else {
          route = `/customer-view/?user_id=${record._id}`;
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
  ];

  const handleFilterToggle = (id) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const renderSearchResults = (tabKey) => {
    if (isAnyApiLoading) {
      return (
        <div className="flex justify-center py-12">
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
        <div className="overflow-x-auto">
          <Table
            pagination={{ pageSize: 10, showSizeChanger: false, hideOnSinglePage: true }}
            scroll={{ x: "max-content" }}
            columns={columns}
            dataSource={dataSource}
            rowKey="_id"
            size="middle"
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

    return (
      <div>
        {exactMatches.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-violet-50 border border-violet-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-violet-600"></div>
              <h4 className="text-violet-800 font-medium">Exact Match</h4>
            </div>
            <Table
              pagination={false}
              scroll={{ x: "max-content" }}
              columns={columns}
              dataSource={[exactMatches[0]]}
              rowKey="_id"
              size="middle"
            />
          </div>
        )}

        {relatedMatches.length > 0 && (
          <div>
            <h4 className="text-gray-700 font-medium mb-4 flex items-center gap-2">
              Related Results
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                {relatedMatches.length} found
              </span>
            </h4>
            <Table
              pagination={{ pageSize: 8, showSizeChanger: false }}
              scroll={{ x: "max-content" }}
              columns={columns}
              dataSource={relatedMatches}
              rowKey="_id"
              size="middle"
              onRow={(record) => ({
                onClick: () => {
                  setSelectedExactMatch(record);
                }
              })}
              rowClassName={() =>
                "cursor-pointer hover:bg-violet-50 transition-all"
              }
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
                  placeholder="Search by ID, Name, or Phone..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-12 pr-5 py-2.5 text-sm shadow-sm focus:border-violet-600 focus:ring-2 focus:ring-violet-200 outline-none transition"
                  autoFocus
                />
                <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              </div>

              <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                {filters.map((filter) => {
                  const isActive = activeFilters.includes(filter.id);
                  return (
                    <Tooltip
                      key={filter.id}
                      title={`Search by ${filter.filterName}`}
                      placement="top"
                    >
                      <button
                        onClick={() => handleFilterToggle(filter.id)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${isActive
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
                { key: "all", label: "All", children: renderSearchResults("all") },
                { key: "customers", label: "Customers", children: renderSearchResults("customers") },
                { key: "leads", label: "Leads", children: renderSearchResults("leads") },
                { key: "agents", label: "Agents", children: renderSearchResults("agents") },
                { key: "employees", label: "Employees", children: renderSearchResults("employees") },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;