/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Modal from "../components/modals/Modal";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable"; // Import DataTable
import { Dropdown, Menu, Select } from "antd";
import { IoMdMore } from "react-icons/io";
import { MdLibraryAdd, MdViewList, MdGridView, MdClose, MdSearch, MdFilterList } from "react-icons/md";
import CustomAlert from "../components/alerts/CustomAlert";
import CircularLoader from "../components/loaders/CircularLoader";
import Navbar from "../components/layouts/Navbar";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";
import Fuse from "fuse.js";
import handleEnrollmentRequestPrint from "../components/printFormats/enrollmentRequestPrint"; // Import print utility

const { Option } = Select;

const formatDateISO = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [TableGroups, setTableGroups] = useState([]); // State for DataTable compatible data
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    groupType: "",
    relationshipManager: "",
    dateRange: "all",
    startDateFrom: "",
    startDateTo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRelated, setCurrentPageRelated] = useState(1);
  const relatedResultsPerPage = 8;
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    group_name: "",
    group_type: "",
    group_value: "",
    group_install: "",
    group_members: "",
    group_duration: "",
    start_date: "",
    end_date: "",
    minimum_bid: "",
    maximum_bid: "",
    commission: "1",
    group_commission: "5",
    incentives: "1",
    reg_fee: "",
    monthly_installment: "",
    weekly_installment: "",
    daily_installment: "",
    relationship_manager: "",
  });
  const [updateFormData, setUpdateFormData] = useState({ ...formData });
  const [errors, setErrors] = useState({});
  const [currentGroup, setCurrentGroup] = useState(null);
  const [currentUpdateGroup, setCurrentUpdateGroup] = useState(null);
  const [deletionGroupName, setDeletionGroupName] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "",
    type: "info",
  });
  const [viewMode, setViewMode] = useState("grid"); // Added 'table' as a possible view mode

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const res = await api.get("/agent/get-employee");
        setEmployees(res.data?.employee || []);
      } catch (err) {
        console.error("Error fetching employees", err);
        setEmployees([]);
      }
    };
    getEmployees();
  }, []);

  useEffect(() => {
    if (showModal || showModalUpdate || showModalDelete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal, showModalUpdate, showModalDelete]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/group/get-group-admin");
        setGroups(res.data || []);

        // Prepare data for DataTable
        const formattedData = res.data.map((group, index) => ({
          id: index + 1,
          _id: group._id,
          group_name: group.group_name,
          group_type: group.group_type,
          group_value: group.group_value,
          group_install: group.group_install,
          group_members: group.group_members,
          group_duration: group.group_duration,
          reg_fee: group.reg_fee,
          relationship_manager: group.relationship_manager?.name || "N/A", // Access nested property
          start_date: group.start_date ? new Date(group.start_date).toLocaleDateString() : "N/A",
          end_date: group.end_date ? new Date(group.end_date).toLocaleDateString() : "N/A",
          minimum_bid: group.minimum_bid,
          maximum_bid: group.maximum_bid,
          commission: group.commission,
          group_commission: group.group_commission,
          incentives: group.incentives,
          daily_installment: group.daily_installment,
          weekly_installment: group.weekly_installment,
          monthly_installment: group.monthly_installment,
          action: (
            <div className="flex justify-center gap-2">
              <Dropdown
                trigger={["click"]}
                menu={{
                  items: [
                    {
                      key: "1",
                      label: (
                        <div
                          className="text-blue-600"
                          onClick={() => handleUpdateModalOpen(group._id)}
                        >
                          Edit
                        </div>
                      ),
                    },
                    {
                      key: "2",
                      label: (
                        <div
                          className="text-red-600"
                          onClick={() => handleDeleteModalOpen(group._id)}
                        >
                          Delete
                        </div>
                      ),
                    },
                    {
                      key: "3",
                      label: (
                        <div
                          onClick={() => handleShareClick(group._id)}
                          className="text-green-600"
                        >
                          Share Link
                        </div>
                      ),
                    },
                  ],
                }}
                placement="bottomLeft"
              >
                <IoMdMore className="text-bold" />
              </Dropdown>
            </div>
          ),
        }));
        setTableGroups(formattedData);

      } catch (err) {
        console.error("Error fetching groups", err);
        setGroups([]);
        setTableGroups([]); // Ensure TableGroups is also cleared on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroups();
  }, [reloadTrigger]); // Include reloadTrigger to refetch data when it changes

  const onGlobalSearchChangeHandler = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
    setCurrentPageRelated(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
    setCurrentPageRelated(1);
  };

  const handleAntSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleAntUpdateSelectChange = (field, value) => {
    setUpdateFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (type = "addGroup") => {
    const data = type === "addGroup" ? formData : updateFormData;
    const newErrors = {};
    if (!data.group_name || !data.group_name.toString().trim())
      newErrors.group_name = "Group Name is required";
    if (!data.group_type) newErrors.group_type = "Group Type is required";
    if (!data.group_value || isNaN(data.group_value) || Number(data.group_value) <= 0)
      newErrors.group_value = "Group Value must be greater than zero";
    if (!data.group_install || isNaN(data.group_install) || Number(data.group_install) <= 0)
      newErrors.group_install = "Group Installment must be greater than zero";
    if (!data.group_members || isNaN(data.group_members) || Number(data.group_members) <= 0)
      newErrors.group_members = "Group Members must be greater than zero";
    if (!data.group_duration || isNaN(data.group_duration) || Number(data.group_duration) <= 0)
      newErrors.group_duration = "Group Duration must be greater than zero";
    if (!data.relationship_manager) newErrors.relationship_manager = "Relationship Manager is required";
    if (!data.monthly_installment) newErrors.monthly_installment = "Monthly Installment is required";
    if (!data.weekly_installment) newErrors.weekly_installment = "Weekly Installment is required";
    if (!data.daily_installment) newErrors.daily_installment = "Daily Installment is required";
    if (!data.reg_fee || isNaN(data.reg_fee) || Number(data.reg_fee) < 0)
      newErrors.reg_fee = "Registration Fee must be zero or greater";
    if (!data.start_date) newErrors.start_date = "Start Date is required";
    if (data.end_date && new Date(data.end_date) < new Date(data.start_date))
      newErrors.end_date = "End Date cannot be earlier than Start Date";
    if (!data.minimum_bid || isNaN(data.minimum_bid) || Number(data.minimum_bid) <= 0)
      newErrors.minimum_bid = "Minimum Bid must be greater than zero";
    if (!data.maximum_bid || isNaN(data.maximum_bid) || Number(data.maximum_bid) <= 0)
      newErrors.maximum_bid = "Maximum Bid must be greater than zero";
    if (
      data.minimum_bid &&
      data.maximum_bid &&
      parseFloat(data.maximum_bid) < parseFloat(data.minimum_bid)
    )
      newErrors.maximum_bid = "Maximum Bid cannot be less than Minimum Bid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm("addGroup")) return;
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await api.post("/group/add-group", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setAlertConfig({ visibility: true, message: "Group added successfully", type: "success" });
      setShowModal(false);
      setReloadTrigger((p) => p + 1); // Trigger refetch
      setFormData({
        group_name: "",
        group_type: "",
        group_value: "",
        group_install: "",
        group_members: "",
        group_duration: "",
        start_date: "",
        end_date: "",
        minimum_bid: "",
        maximum_bid: "",
        commission: "1",
        group_commission: "5",
        incentives: "1",
        reg_fee: "",
        monthly_installment: "",
        weekly_installment: "",
        daily_installment: "",
        relationship_manager: "",
      });
    } catch (err) {
      console.error("Error adding group", err);
      setAlertConfig({ visibility: true, message: "Failed to add group", type: "error" });
    }
  };

  const handleUpdateModalOpen = async (groupId) => {
    try {
      const res = await api.get(`/group/get-by-id-group/${groupId}`);
      const data = res.data;
      setCurrentUpdateGroup(data);
      setUpdateFormData({
        group_name: data.group_name || "",
        group_type: data.group_type || "",
        group_value: data.group_value || "",
        group_install: data.group_install || "",
        group_members: data.group_members || "",
        group_duration: data.group_duration || "",
        start_date: data.start_date ? data.start_date.split("T")[0] : "",
        end_date: data.end_date ? data.end_date.split("T")[0] : "",
        minimum_bid: data.minimum_bid || "",
        maximum_bid: data.maximum_bid || "",
        commission: data.commission || "",
        group_commission: data.group_commission || "",
        incentives: data.incentives || "",
        reg_fee: data.reg_fee || "",
        relationship_manager: data.relationship_manager?._id || "",
        monthly_installment: data.monthly_installment || "",
        weekly_installment: data.weekly_installment || "",
        daily_installment: data.daily_installment || "",
      });
      setErrors({});
      setShowModalUpdate(true);
    } catch (err) {
      console.error("Error fetching group for update", err);
      setAlertConfig({ visibility: true, message: "Failed to fetch group details", type: "error" });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm("updateGroup")) return;
    try {
      await api.put(`/group/update-group/${currentUpdateGroup._id}`, updateFormData);
      setAlertConfig({ visibility: true, message: "Group updated successfully", type: "success" });
      setShowModalUpdate(false);
      setReloadTrigger((p) => p + 1); // Trigger refetch
    } catch (err) {
      console.error("Error updating group", err);
      setAlertConfig({ visibility: true, message: "Failed to update group", type: "error" });
    }
  };

  const handleDeleteModalOpen = async (groupId) => {
    try {
      const res = await api.get(`/group/get-by-id-group/${groupId}`);
      setCurrentGroup(res.data);
      setDeletionGroupName("");
      setShowModalDelete(true);
    } catch (err) {
      console.error("Error fetching group for delete", err);
      setAlertConfig({ visibility: true, message: "Failed to fetch group", type: "error" });
    }
  };

  const handleDeleteGroup = async () => {
    if (!currentGroup) return;
    if (deletionGroupName.toString().trim() !== currentGroup.group_name) {
      setAlertConfig({
        visibility: true,
        message: "Please type the exact group name to confirm delete",
        type: "info",
      });
      return;
    }
    try {
      await api.delete(`/group/delete-group/${currentGroup._id}`);
      setAlertConfig({ visibility: true, message: "Group deleted successfully", type: "success" });
      setShowModalDelete(false);
      setReloadTrigger((p) => p + 1); // Trigger refetch
      setCurrentGroup(null);
    } catch (err) {
      console.error("Error deleting group", err);
      setAlertConfig({ visibility: true, message: "Failed to delete group", type: "error" });
    }
  };

  const handleShareClick = (groupId) => {
    if (!groupId) return;
    const baseUrl = "http://city-chits.s3-website.eu-north-1.amazonaws.com";
    const fullUrl = `${baseUrl}/enrollment-request-form/?group_id=${groupId}`;
    window.open(fullUrl, "_blank");
  };

  const preFilteredGroups = groups.filter((g) => {
    const matchesGroupType = filters.groupType ? g.group_type === filters.groupType : true;
    const matchesRM = filters.relationshipManager
      ? g.relationship_manager?._id === filters.relationshipManager
      : true;
    let matchesDate = true;
    if (filters.startDateFrom || filters.startDateTo) {
      const groupDate = new Date(g.start_date);
      if (filters.startDateFrom && groupDate < new Date(filters.startDateFrom)) matchesDate = false;
      if (filters.startDateTo && groupDate > new Date(filters.startDateTo)) matchesDate = false;
    }
    return matchesGroupType && matchesRM && matchesDate;
  });

  const isSearching = searchText.trim() !== "";

  let exactMatch = null;
  let relatedMatches = [];
  if (isSearching) {
    const fuse = new Fuse(preFilteredGroups, {
      keys: [
        { name: "group_name", weight: 0.4 },
        { name: "relationship_manager.name", weight: 0.3 },
        { name: "group_value", weight: 0.2 },
        { name: "group_type", weight: 0.1 },
      ],
      includeScore: true,
      threshold: 0.3,
      shouldSort: true,
    });
    const results = fuse.search(searchText);
    const exactResults = results.filter((r) => r.score <= 0.05);
    exactMatch = exactResults.length > 0 ? exactResults[0].item : null;
    relatedMatches = results
      .filter((r) => r.score > 0.05)
      .map((r) => r.item)
      .filter((item) => item !== exactMatch);
  }

  const currentGroupsPerPage = viewMode === "list" ? 6 : 8;
  const indexOfLastRelated = currentPageRelated * relatedResultsPerPage;
  const indexOfFirstRelated = indexOfLastRelated - relatedResultsPerPage;
  const currentRelatedMatches = relatedMatches.slice(indexOfFirstRelated, indexOfLastRelated);
  const totalRelatedPages = Math.ceil(relatedMatches.length / relatedResultsPerPage);

  const indexOfLastGroup = currentPage * currentGroupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - currentGroupsPerPage;
  const currentGroups = preFilteredGroups.slice(indexOfFirstGroup, indexOfLastGroup);
  const totalPages = Math.ceil(preFilteredGroups.length / currentGroupsPerPage);

  // Define columns for DataTable
  const columns = [
    { key: "id", header: "SL. NO" },
    { key: "group_name", header: "Group Name" },
    { key: "group_type", header: "Group Type" },
    { key: "group_value", header: "Group Value" },
    { key: "group_install", header: "Installment" },
    { key: "group_members", header: "Members" },
    { key: "group_duration", header: "Duration (months)" },
    { key: "reg_fee", header: "Registration Fee" },
    { key: "relationship_manager", header: "Relationship Manager" },
    { key: "start_date", header: "Start Date" },
    { key: "end_date", header: "End Date" },
    { key: "minimum_bid", header: "Min Bid %" },
    { key: "maximum_bid", header: "Max Bid %" },
    { key: "commission", header: "Agent Commission %" },
    { key: "group_commission", header: "Company Commission %" },
    { key: "incentives", header: "Employee Incentives %" },
    { key: "daily_installment", header: "Daily Installment" },
    { key: "weekly_installment", header: "Weekly Installment" },
    { key: "monthly_installment", header: "Monthly Installment" },
    { key: "action", header: "Action" },
  ];

  const InputField = ({ name, label, value, onChange, error, type = "text", placeholder }) => (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Enter ${label}`}
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 w-full p-2.5"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  const GroupRow = ({ group }) => {
    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={() => handleUpdateModalOpen(group._id)}>
          <span className="text-blue-600">Edit</span>
        </Menu.Item>
        <Menu.Item key="2" onClick={() => handleDeleteModalOpen(group._id)}>
          <span className="text-red-600">Delete</span>
        </Menu.Item>
        <Menu.Item key="3" onClick={() => handleShareClick(group._id)}>
          <span className="text-green-600">Share Link</span>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{group.group_name}</h3>
            <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-medium rounded-full capitalize">
              {group.group_type || "N/A"}
            </span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">RM:</span> {group.relationship_manager?.name || "N/A"}
            </p>
            <p>
              <span className="font-medium">Start:</span>{" "}
              {group.start_date ? new Date(group.start_date).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 w-full sm:w-auto sm:flex-none text-center">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 px-3 py-2 rounded-lg border border-purple-100">
            <p className="text-sm font-bold text-purple-800">{group.group_members}</p>
            <p className="text-xs text-gray-600">Tickets</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-100">
            <p className="text-sm font-bold text-blue-800">
              ₹{Number(group.group_install).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Inst.</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-3 py-2 rounded-lg border border-green-100">
            <p className="text-sm font-bold text-green-800">
              ₹{Number(group.group_value).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Chit</p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <IoMdMore className="text-xl cursor-pointer text-gray-500 hover:text-purple-700 transition-colors" />
            </button>
          </Dropdown>
        </div>
      </div>
    );
  };

  const GroupCard = ({ group }) => {
    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={() => handleUpdateModalOpen(group._id)}>
          <span className="text-blue-600">Edit</span>
        </Menu.Item>
        <Menu.Item key="2" onClick={() => handleDeleteModalOpen(group._id)}>
          <span className="text-red-600">Delete</span>
        </Menu.Item>
        <Menu.Item key="3" onClick={() => handleShareClick(group._id)}>
          <span className="text-green-600">Share Link</span>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-gray-100">
        <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg leading-tight truncate">{group.group_name}</h3>
              <p className="text-xs text-gray-600 capitalize mt-1">{group.group_type} Group</p>
            </div>
            <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
              <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <IoMdMore className="text-xl cursor-pointer text-gray-500 hover:text-purple-700" />
              </button>
            </Dropdown>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
              <p className="text-lg font-bold text-purple-800">{group.group_members}</p>
              <p className="text-xs text-gray-600">Tickets</p>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <p className="text-lg font-bold text-blue-800">
                ₹{Number(group.group_install).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Instalment</p>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
              <p className="text-lg font-bold text-green-800">
                ₹{Number(group.group_value).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Chit Amount</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-500">Period:</span>
              <span className="font-medium">{group.group_duration} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">RM:</span>
              <span className="font-medium truncate ml-2">{group.relationship_manager?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Start Date:</span>
              <span className="font-medium">
                {group.start_date ? new Date(group.start_date).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGroups = (groupsToRender) => {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {groupsToRender.map((g) => (
            <GroupCard key={g._id} group={g} />
          ))}
        </div>
      );
    } else if (viewMode === "list") {
      return (
        <div className="space-y-4">
          {groupsToRender.map((g) => (
            <GroupRow key={g._id} group={g} />
          ))}
        </div>
      );
    } else { // Table view
      // Filter TableGroups based on preFilteredGroups to maintain consistency with search/filter
      const filteredTableGroups = TableGroups.filter(tableGroup => 
        preFilteredGroups.some(filteredGroup => filteredGroup._id === tableGroup._id)
      );



      return (
        <DataTable
          catcher="_id" // Use the unique ID field
          data={filteredTableGroups} // Pass the data for the current page if handling pagination externally
          columns={columns}
          exportedPdfName="Groups" // Name for the exported PDF
          exportedFileName={`Groups.csv`} // Name for the exported CSV
          // pagination={true} // Enable if DataTable handles pagination internally
          // totalRecords={filteredTableGroups.length} // Pass total count if using DataTable's pagination
        />
      );
    }
  };

  const RelatedPagination = () => {
    if (totalRelatedPages <= 1) return null;
    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPageRelated((p) => Math.max(p - 1, 1))}
          disabled={currentPageRelated === 1}
          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {[...Array(Math.min(5, totalRelatedPages))].map((_, i) => {
            let pageNum;
            if (totalRelatedPages <= 5) {
              pageNum = i + 1;
            } else {
              if (currentPageRelated <= 3) pageNum = i + 1;
              else if (currentPageRelated >= totalRelatedPages - 2)
                pageNum = totalRelatedPages - 4 + i;
              else pageNum = currentPageRelated - 2 + i;
            }
            if (pageNum < 1 || pageNum > totalRelatedPages) return null;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPageRelated(pageNum)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${currentPageRelated === pageNum
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalRelatedPages > 5 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          {totalRelatedPages > 5 && (
            <button
              onClick={() => setCurrentPageRelated(totalRelatedPages)}
              className="w-8 h-8 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
            >
              {totalRelatedPages}
            </button>
          )}
        </div>
        <button
          onClick={() => setCurrentPageRelated((p) => Math.min(p + 1, totalRelatedPages))}
          disabled={currentPageRelated === totalRelatedPages}
          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    );
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages)
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="w-8 h-8 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${currentPage === num
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              {num}
            </button>
          ))}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="w-8 h-8 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="flex mt-20">
        <Sidebar />
        <Navbar
          onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
          visibility={true}
        />
        <CustomAlertDialog
          type={alertConfig.type}
          isVisible={alertConfig.visibility}
          message={alertConfig.message}
          onClose={() => setAlertConfig((prev) => ({ ...prev, visibility: false }))}
        />
        <div className="flex-grow flex flex-col bg-gray-50">
          <main className="flex-grow overflow-auto p-6">
            {/* Header Section */}
            <div className="mb-6 mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-2xl font-bold text-gray-800">Groups</h3>
              <div className="flex items-center gap-3">
                {/* View Toggle Buttons - Added Table View */}
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md flex items-center gap-1 transition-colors ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    title="Grid View"
                  >
                    <MdGridView />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md flex items-center gap-1 transition-colors ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    title="List View"
                  >
                    <MdViewList />
                    <span className="hidden sm:inline">List</span>
                  </button>
                  <button
                    onClick={() => setViewMode("table")} // Add table view toggle
                    className={`p-2 rounded-md flex items-center gap-1 transition-colors ${
                      viewMode === "table"
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    title="Table View"
                  >
                    <MdViewList /> 
                    <span className="hidden sm:inline">Table</span>
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowModal(true);
                    setErrors({});
                  }}
                  className="shrink-0 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 flex items-center gap-1 transition-all duration-200 shadow-md"
                >
                  <MdLibraryAdd /> Add New Group
                </button>
              </div>
            </div>
            {/* Search and Filter Section */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MdSearch className="text-gray-500" />
                  <span className="font-medium text-gray-700">Search & Filter</span>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-1 rounded hover:bg-gray-100 transition-colors sm:hidden"
                >
                  {showFilters ? <MdClose /> : <MdFilterList />}
                </button>
              </div>
              <div className={`p-4 ${showFilters ? 'block' : 'hidden sm:block'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Group Type</label>
                    <select
                      name="groupType"
                      value={filters.groupType}
                      onChange={handleFilterChange}
                      className="bg-white border border-gray-300 rounded-lg p-2 w-full focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">All</option>
                      <option value="divident">Dividend</option>
                      <option value="double">Double</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Relationship Manager
                    </label>
                    <select
                      name="relationshipManager"
                      value={filters.relationshipManager}
                      onChange={handleFilterChange}
                      className="bg-white border border-gray-300 rounded-lg p-2 w-full focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">All</option>
                      {(Array.isArray(employees) ? employees : []).map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} | {emp.phone_number}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Date Range
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => {
                        const range = e.target.value;
                        let from = "";
                        let to = "";
                        const today = new Date();
                        const yyyy = today.getFullYear();
                        const mm = String(today.getMonth() + 1).padStart(2, "0");
                        const dd = String(today.getDate()).padStart(2, "0");
                        const isoToday = `${yyyy}-${mm}-${dd}`;
                        switch (range) {
                          case "today":
                            from = isoToday;
                            to = isoToday;
                            break;
                          case "yesterday":
                            const yesterday = new Date(today);
                            yesterday.setDate(today.getDate() - 1);
                            from = to = formatDateISO(yesterday);
                            break;
                          case "thisWeek":
                            const dayOfWeek = today.getDay();
                            const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                            const monday = new Date(today);
                            monday.setDate(today.getDate() + diffToMonday);
                            const sunday = new Date(monday);
                            sunday.setDate(monday.getDate() + 6);
                            from = formatDateISO(monday);
                            to = formatDateISO(sunday);
                            break;
                          case "thisMonth":
                            from = `${yyyy}-${mm}-01`;
                            to = `${yyyy}-${mm}-${new Date(yyyy, mm, 0).getDate()}`;
                            break;
                          case "thisYear":
                            from = `${yyyy}-01-01`;
                            to = `${yyyy}-12-31`;
                            break;
                          case "custom":
                          case "all":
                          default:
                            from = "";
                            to = "";
                            break;
                        }
                        setFilters((prev) => ({
                          ...prev,
                          dateRange: range,
                          startDateFrom: from,
                          startDateTo: to,
                        }));
                      }}
                      className="bg-white border border-gray-300 rounded-lg p-2 w-full focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="thisWeek">This Week</option>
                      <option value="thisMonth">This Month</option>
                      <option value="thisYear">This Year</option>
                      <option value="custom">Custom Range</option>
                    </select>
                    {filters.dateRange === "custom" && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="block text-sm text-gray-600">From</label>
                          <input
                            type="date"
                            value={filters.startDateFrom}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                startDateFrom: e.target.value,
                              }))
                            }
                            className="bg-white border border-gray-300 rounded p-1 text-sm w-full focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">To</label>
                          <input
                            type="date"
                            value={filters.startDateTo}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                startDateTo: e.target.value,
                              }))
                            }
                            className="bg-white border border-gray-300 rounded p-1 text-sm w-full focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      placeholder="Search by group, RM, or chit amount"
                      value={searchText}
                      onChange={onGlobalSearchChangeHandler}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setFilters({
                        groupType: "",
                        relationshipManager: "",
                        dateRange: "all",
                        startDateFrom: "",
                        startDateTo: "",
                      });
                      setSearchText("");
                      setCurrentPage(1);
                      setCurrentPageRelated(1);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
            {/* Content Section */}
            {isLoading ? (
              <div className="py-12">
                <CircularLoader isLoading={isLoading} failure={false} data={"Group Data"} />
              </div>
            ) : isSearching ? (
              <>
                {exactMatch && (
                  <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-medium text-green-800">Exact Match</h4>
                    </div>
                    {renderGroups([exactMatch])}
                  </div>
                )}
                {relatedMatches.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-gray-700 font-medium mb-4 flex items-center gap-2">
                      Related Results
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {relatedMatches.length} found
                      </span>
                    </h4>
                    {renderGroups(currentRelatedMatches)}
                    <RelatedPagination />
                  </div>
                )}
                {!exactMatch && relatedMatches.length === 0 && (
                  <div className="col-span-full p-12 bg-white rounded-xl shadow-sm text-center text-gray-600">
                    <div className="flex flex-col items-center">
                      <MdSearch className="text-4xl mb-3 text-gray-400" />
                      <p className="text-lg font-medium">No groups found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {groups.length > 0 ? (
                  renderGroups(currentGroups)
                ) : (
                  <div className="col-span-full p-12 bg-white rounded-xl shadow-sm text-center text-gray-600">
                    <div className="flex flex-col items-center">
                      <MdLibraryAdd className="text-4xl mb-3 text-gray-400" />
                      <p className="text-lg font-medium">No groups found</p>
                      <p className="text-sm mt-1">Create your first group to get started</p>
                    </div>
                  </div>
                )}
                {viewMode !== 'table' && <Pagination />} {/* Hide pagination for table view if DataTable handles it */}
              </>
            )}
          </main>
        </div>
      </div>
      {/* Add Group Modal */}
      <Modal isVisible={showModal} onClose={() => setShowModal(false)} borderColor="purple-600">
        <div className="py-6 px-5 lg:px-8 text-left">
          <h3 className="mb-5 text-xl font-bold text-purple-700">Add New Group</h3>
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <InputField
              name="group_name"
              label="Group Name"
              value={formData.group_name}
              onChange={handleChange}
              error={errors.group_name}
            />
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Group Type</label>
              <Select
                showSearch
                placeholder="Select Group Type"
                value={formData.group_type || undefined}
                onChange={(v) => handleAntSelectChange("group_type", v)}
                className="w-full"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                <Option value="divident">Dividend</Option>
                <Option value="double">Double</Option>
              </Select>
              {errors.group_type && <p className="text-red-500 text-sm mt-1">{errors.group_type}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="group_value"
                label="Group Value"
                value={formData.group_value}
                onChange={handleChange}
                error={errors.group_value}
                type="number"
              />
              <InputField
                name="group_install"
                label="Installment"
                value={formData.group_install}
                onChange={handleChange}
                error={errors.group_install}
                type="number"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="group_members"
                label="Members"
                value={formData.group_members}
                onChange={handleChange}
                error={errors.group_members}
                type="number"
              />
              <InputField
                name="group_duration"
                label="Duration (months)"
                value={formData.group_duration}
                onChange={handleChange}
                error={errors.group_duration}
                type="number"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputField
                  name="reg_fee"
                  label="Registration Fee"
                  value={formData.reg_fee}
                  onChange={handleChange}
                  error={errors.reg_fee}
                  type="number"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Relationship Manager
                </label>
                <Select
                  showSearch
                  placeholder="Select Relationship Manager"
                  value={formData.relationship_manager || undefined}
                  onChange={(v) => handleAntSelectChange("relationship_manager", v)}
                  className="w-full"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {(Array.isArray(employees) ? employees : []).map((emp) => (
                    <Option key={emp?._id} value={emp?._id}>
                      {emp?.name} | {emp?.phone_number}
                    </Option>
                  ))}
                </Select>
                {errors.relationship_manager && (
                  <p className="text-red-500 text-sm mt-1">{errors.relationship_manager}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="start_date"
                label="Start Date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                error={errors.start_date}
              />
              <InputField
                name="end_date"
                label="End Date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                error={errors.end_date}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="minimum_bid"
                label="Min Bid %"
                value={formData.minimum_bid}
                onChange={handleChange}
                error={errors.minimum_bid}
                type="number"
              />
              <InputField
                name="maximum_bid"
                label="Max Bid %"
                value={formData.maximum_bid}
                onChange={handleChange}
                error={errors.maximum_bid}
                type="number"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                name="commission"
                label="Agent Commission %"
                value={formData.commission}
                onChange={handleChange}
                type="number"
              />
              <InputField
                name="group_commission"
                label="Company Commission %"
                value={formData.group_commission}
                onChange={handleChange}
                type="number"
              />
              <InputField
                name="incentives"
                label="Employee Incentives %"
                value={formData.incentives}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                name="daily_installment"
                label="Daily Installment"
                value={formData.daily_installment}
                onChange={handleChange}
                error={errors.daily_installment}
                type="number"
              />
              <InputField
                name="weekly_installment"
                label="Weekly Installment"
                value={formData.weekly_installment}
                onChange={handleChange}
                error={errors.weekly_installment}
                type="number"
              />
              <InputField
                name="monthly_installment"
                label="Monthly Installment"
                value={formData.monthly_installment}
                onChange={handleChange}
                error={errors.monthly_installment}
                type="text"
              />
            </div>
            <div className="w-full flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
              >
                Save Group
              </button>
            </div>
          </form>
        </div>
      </Modal>
      {/* Update Group Modal */}
      <Modal
        isVisible={showModalUpdate}
        onClose={() => setShowModalUpdate(false)}
        borderColor="purple-600"
      >
        <div className="py-6 px-5 lg:px-8 text-left">
          <h3 className="mb-5 text-xl font-bold text-purple-700">Update Group</h3>
          <form className="space-y-5" onSubmit={handleUpdate} noValidate>
            <InputField
              name="group_name"
              label="Group Name"
              value={updateFormData.group_name}
              onChange={handleUpdateInputChange}
              error={errors.group_name}
            />
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Group Type</label>
              <Select
                showSearch
                placeholder="Select Group Type"
                value={updateFormData.group_type || undefined}
                onChange={(v) => handleAntUpdateSelectChange("group_type", v)}
                className="w-full"
              >
                <Option value="divident">Dividend</Option>
                <Option value="double">Double</Option>
              </Select>
              {errors.group_type && <p className="text-red-500 text-sm mt-1">{errors.group_type}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="group_value"
                label="Group Value"
                value={updateFormData.group_value}
                onChange={handleUpdateInputChange}
                error={errors.group_value}
                type="number"
              />
              <InputField
                name="group_install"
                label="Installment"
                value={updateFormData.group_install}
                onChange={handleUpdateInputChange}
                error={errors.group_install}
                type="number"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="group_members"
                label="Members"
                value={updateFormData.group_members}
                onChange={handleUpdateInputChange}
                error={errors.group_members}
                type="number"
              />
              <InputField
                name="group_duration"
                label="Duration (months)"
                value={updateFormData.group_duration}
                onChange={handleUpdateInputChange}
                error={errors.group_duration}
                type="number"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputField
                  name="reg_fee"
                  label="Registration Fee"
                  value={updateFormData.reg_fee}
                  onChange={handleUpdateInputChange}
                  error={errors.reg_fee}
                  type="number"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Relationship Manager
                </label>
                <Select
                  showSearch
                  placeholder="Select Relationship Manager"
                  value={updateFormData.relationship_manager || undefined}
                  onChange={(v) => handleAntUpdateSelectChange("relationship_manager", v)}
                  className="w-full"
                >
                  {(Array.isArray(employees) ? employees : []).map((emp) => (
                    <Option key={emp?._id} value={emp._id}>
                      {emp?.name} | {emp?.phone_number}
                    </Option>
                  ))}
                </Select>
                {errors.relationship_manager && (
                  <p className="text-red-500 text-sm mt-1">{errors.relationship_manager}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="start_date"
                label="Start Date"
                type="date"
                value={updateFormData.start_date}
                onChange={handleUpdateInputChange}
                error={errors.start_date}
              />
              <InputField
                name="end_date"
                label="End Date"
                type="date"
                value={updateFormData.end_date}
                onChange={handleUpdateInputChange}
                error={errors.end_date}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="minimum_bid"
                label="Min Bid %"
                value={updateFormData.minimum_bid}
                onChange={handleUpdateInputChange}
                error={errors.minimum_bid}
                type="number"
              />
              <InputField
                name="maximum_bid"
                label="Max Bid %"
                value={updateFormData.maximum_bid}
                onChange={handleUpdateInputChange}
                error={errors.maximum_bid}
                type="number"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                name="commission"
                label="Agent Commission %"
                value={updateFormData.commission}
                onChange={handleUpdateInputChange}
                type="number"
              />
              <InputField
                name="group_commission"
                label="Company Commission %"
                value={updateFormData.group_commission}
                onChange={handleUpdateInputChange}
                type="number"
              />
              <InputField
                name="incentives"
                label="Employee Incentives %"
                value={updateFormData.incentives}
                onChange={handleUpdateInputChange}
                type="number"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                name="daily_installment"
                label="Daily Installment"
                value={updateFormData.daily_installment}
                onChange={handleUpdateInputChange}
                error={errors.daily_installment}
                type="number"
              />
              <InputField
                name="weekly_installment"
                label="Weekly Installment"
                value={updateFormData.weekly_installment}
                onChange={handleUpdateInputChange}
                error={errors.weekly_installment}
                type="number"
              />
              <InputField
                name="monthly_installment"
                label="Monthly Installment"
                value={updateFormData.monthly_installment}
                onChange={handleUpdateInputChange}
                error={errors.monthly_installment}
                type="text"
              />
            </div>
            <div className="w-full flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Modal>
      {/* Delete Group Modal */}
      <Modal
        isVisible={showModalDelete}
        onClose={() => setShowModalDelete(false)}
        borderColor="red-600"
      >
        <div className="py-6 px-5 lg:px-8 text-left">
          <h3 className="mb-4 text-xl font-bold text-gray-900">Delete Group</h3>
          <p className="mb-4 text-sm text-gray-700">
            To confirm deletion, type the group name{" "}
            <strong className="text-red-600">{currentGroup?.group_name}</strong> below and press Delete.
          </p>
          <input
            type="text"
            value={deletionGroupName}
            onChange={(e) => setDeletionGroupName(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg w-full p-2.5 mb-4"
            placeholder="Type exact group name to confirm"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowModalDelete(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteGroup}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Group;