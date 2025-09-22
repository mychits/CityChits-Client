/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import api from "../instance/TokenInstance";
import CircularLoader from "../components/loaders/CircularLoader";
import CustomAlert from "../components/alerts/CustomAlert";
import { Table, Tag, Tooltip, Card } from "antd";
import Fuse from "fuse.js";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import Navbar from "../components/layouts/Navbar";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";


const QuickSearch = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [TableUsers, setTableUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const [selectedExactMatch, setSelectedExactMatch] = useState(null);
  const [relatedMatches, setRelatedMatches] = useState([]);

    const GlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

   
  const filters = [
    { id: "1", filterName: "Customer Id", key: "customer_id" },
    { id: "2", filterName: "Name", key: "name" },
    { id: "3", filterName: "Phone", key: "phone_number" },
    { id: "7", filterName: "Status", key: "customer_status" },
  ];

  const [activeFilters, setActiveFilters] = useState([]);
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });
  const [searchText, setSearchText] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const fil =
    activeFilters.length > 0
      ? filters.filter((f) => activeFilters.includes(f.id)).map((f) => f.key)
      : filters.map((f) => f.key);

  const fuse = new Fuse(TableUsers, { includeScore: true, keys: fil });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/user/get-user");
        setUsers(response.data);
        const formattedData = response.data.map((group, index) => ({
          _id: group?._id,
          id: index + 1,
          name: group?.full_name,
          phone_number: group?.phone_number,
          address: group?.address,
          pincode: group?.pincode,
          customer_id: group?.customer_id,
          collection_area: group?.collection_area?.route_name,
          customer_status: group?.customer_status || "Active",
        }));
        setTableUsers(formattedData);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [reloadTrigger]);

  const columns = [
    {
      dataIndex: "customer_id",
      title: "Customer ID",
      key: "customer_id",
      width: 120,
    },
    {
      dataIndex: "name",
      title: "Customer Name",
      key: "name",
      width: 180,
    },
    {
      dataIndex: "phone_number",
      title: "Phone",
      key: "phone_number",
      width: 140,
    },
    {
      dataIndex: "customer_status",
      title: "Status",
      key: "customer_status",
      width: 100,
      render: (text) => (
        <Tag
          color={
            text?.toLowerCase() === "active"
              ? "green"
              : text?.toLowerCase() === "inactive"
              ? "red"
              : "orange"
          }
          className="px-2 py-0.5 text-sm rounded-md"
        >
          {text}
        </Tag>
      ),
    },
    {
      key: "action",
      width: 100,
      render: (_, record) => (
        <Tooltip title="View this customer">
          <button
            onClick={() => navigate(`/customer-view/?user_id=${record._id}`)}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-violet-600 hover:text-white hover:shadow transition"
          >
            <EyeOutlined className="text-lg" /> <span>View</span>
          </button>
        </Tooltip>
      ),
    },
  ];

  const handleFilterToggle = (id) => {
    setActiveFilters((prev) =>
      prev.includes(id)
        ? prev.filter((filterId) => filterId !== id)
        : [...prev, id]
    );
  };

  const searchResults = searchText.trim() ? fuse.search(searchText) : [];
  let exactMatches = [];

  useEffect(() => {
    if (searchText.trim()) {
      const exact = searchResults
        .filter((res) => res.score <= 0.05)
        .map((res) => res.item);
      const related = searchResults
        .filter((res) => res.score > 0.05)
        .map((res) => res.item);

      setRelatedMatches(related);
      if (!selectedExactMatch) {
        exactMatches = exact;
      }
    } else {
      setRelatedMatches([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const handleRelatedClick = (record) => {
    setSelectedExactMatch(record);
    setRelatedMatches((prev) =>
      prev.filter((item) => item._id !== record._id)
    );
  };

  const onGlobalSearchChangeHandler = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div>
    <div className="flex mt-20" >
          <Sidebar />
          <Navbar
            onGlobalSearchChangeHandler={GlobalSearchChangeHandler}
            visibility={true}
          />
          <CustomAlertDialog
            type={alertConfig.type}
            isVisible={alertConfig.visibility}
            message={alertConfig.message}
            onClose={() =>
              setAlertConfig((prev) => ({ ...prev, visibility: false }))
            }
          />

        <div className="flex-1 p-4 md:p-8  md:mr-11   pb-8">
          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 mb-2">
              Customer <span className="text-neutral-500">Search</span>
            </h1>
            <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
              Quickly find, filter, and view customer details using multiple search criteria.
            </p>
          </header>

          {/* Search & Filters Card */}
          <Card
            className="mb-8 shadow-sm border border-gray-200 rounded-xl"
            bodyStyle={{ padding: "1.5rem" }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="relative w-full lg:w-1/3">
                <input
                  type="text"
                  placeholder="Search by ID, Name, or Phone..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-12 pr-5 py-3 text-sm shadow-sm focus:border-violet-700 focus:ring-2 focus:ring-violet-700 outline-none transition"
                />
                <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
              </div>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
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
                        className={`px-5 py-2 rounded-full text-sm font-medium transition shadow-sm ${
                          isActive
                            ? "bg-violet-600 text-white"
                            : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
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

          {/* Results Card */}
          <Card
            className="shadow-md border border-gray-200 rounded-xl"
            bodyStyle={{ padding: "1.5rem" }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              Customer List
            </h3>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <CircularLoader
                  isLoading={isLoading}
                  failure={TableUsers.length <= 0}
                  data="Customer Data"
                />
              </div>
            ) : searchText.trim() ? (
              <>
                {(selectedExactMatch || searchResults.length > 0) && (
                  <div className="mb-8 p-5 border border-violet-200 rounded-xl bg-violet-50/70">
                    <h4 className="text-violet-800 text-lg font-semibold mb-4">
                      Exact Match
                    </h4>
                    <div className="overflow-x-auto">
                      <Table
                        bordered={false}
                        size="middle"
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                        tableLayout="auto"
                        rowClassName={() =>
                          "group hover:bg-violet-50 cursor-pointer transition duration-200"
                        }
                        columns={columns}
                        dataSource={
                          selectedExactMatch
                            ? [selectedExactMatch]
                            : searchResults
                                .filter((res) => res.score <= 0.05)
                                .map((res) => res.item)
                                .slice(0, 1)
                        }
                      />
                    </div>
                  </div>
                )}

                {relatedMatches.length > 0 && (
                  <div className="pt-6 border-t">
                    <h4 className="text-gray-700 text-base font-medium mb-4">
                      Related Results
                    </h4>
                    <div className="overflow-x-auto">
                      <Table
                        bordered={false}
                        size="middle"
                        pagination={{ pageSize: 12, showSizeChanger: false }}
                        scroll={{ x: 'max-content' }}
                        tableLayout="auto"
                        rowClassName={() =>
                          "group hover:bg-violet-50 cursor-pointer transition duration-200"
                        }
                        columns={columns}
                        dataSource={relatedMatches}
                        onRow={(record) => ({
                          onClick: () => handleRelatedClick(record),
                        })}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="overflow-x-auto">
                <Table
                  bordered={false}
                  size="middle"
                  pagination={{ pageSize: 12, showSizeChanger: false }}
                  scroll={{ x: 'max-content' }}
                  tableLayout="auto"
                  rowClassName={() =>
                    "bg-white hover:bg-violet-50 cursor-pointer transition duration-200"
                  }
                  onHeaderRow={() => {
                    return {
                      className:
                        "bg-gray-900 text-white [&>th]:!bg-violet-700 [&>th]:!text-white [&>th]:font-semibold",
                    };
                  }}
                  columns={columns}
                  dataSource={TableUsers}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;