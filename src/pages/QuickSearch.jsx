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

const QuickSearch = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [TableUsers, setTableUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const [selectedExactMatch, setSelectedExactMatch] = useState(null);
  const [relatedMatches, setRelatedMatches] = useState([]);

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <CustomAlert
        type={alertConfig.type}
        isVisible={alertConfig.visibility}
        message={alertConfig.message}
      />

      <div className="flex mt-20">
        <Sidebar
          navSearchBarVisibility={true}
          onGlobalSearchChangeHandler={(e) => setSearchText(e.target.value)}
        />

        <div className="flex-grow p-8 space-y-8">
          {/* Page Header */}
          <Card className="shadow-md border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm">
            <h1 className="text-3xl font-bold text-violet-700">
              Customer <span className="text-neutral-500">Search</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Quickly find, filter, and view customer details
            </p>
          </Card>

          {/* Search & Filters */}
          <Card className="shadow-sm border border-gray-200 rounded-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="relative w-full lg:w-1/3">
                <input
                  type="text"
                  placeholder=" Search by ID, Name, or Phone..."
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

          {/* Results */}
          <Card className="shadow-md border border-gray-200 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Customer List
            </h3>

            {isLoading ? (
              <CircularLoader
                isLoading={isLoading}
                failure={TableUsers.length <= 0}
                data="Customer Data"
              />
            ) : searchText.trim() ? (
              <>
                {(selectedExactMatch || searchResults.length > 0) && (
                  <div className="mb-6 border border-violet-200 rounded-lg p-4 bg-violet-50/70">
                    <h4 className="text-violet-800 text-base font-semibold mb-3">
                      Exact Match
                    </h4>
                    <Table
                      bordered={false}
                      size="middle"
                      pagination={false}
                      scroll={{ x: true }}
                      tableLayout="fixed"
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
                )}

                {relatedMatches.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-gray-700 text-base font-medium mb-2">
                      Related Results
                    </h4>
                    <Table
                      bordered={false}
                      size="middle"
                      pagination={{ pageSize: 12, showSizeChanger: false }}
                      scroll={{ x: true }}
                      tableLayout="fixed"
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
                )}
              </>
            ) : (
              <Table
                bordered={false}
                size="middle"
                pagination={{ pageSize: 12, showSizeChanger: false }}
                scroll={{ x: true }}
                tableLayout="fixed"
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
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;
