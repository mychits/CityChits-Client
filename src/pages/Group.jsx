/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Modal from "../components/modals/Modal";
import api from "../instance/TokenInstance";
import { Dropdown, Menu, Select } from "antd";
import { IoMdMore } from "react-icons/io";
import { MdLibraryAdd } from "react-icons/md";
import CustomAlert from "../components/alerts/CustomAlert";
import CircularLoader from "../components/loaders/CircularLoader";
import Navbar from "../components/layouts/Navbar";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";

const { Option } = Select;

const GlobalSearchChangeHandler = (e) => {
  const { value } = e.target;
  setSearchText(value);
};



const formatDateISO = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const Group = () => {
  const [groups, setGroups] = useState([]);
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
  const groupsPerPage = 12;



  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
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
      } catch (err) {
        console.error("Error fetching groups", err);
        setGroups([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroups();
  }, [reloadTrigger]);

  const onGlobalSearchChangeHandler = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
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
    if (data.minimum_bid && data.maximum_bid && parseFloat(data.maximum_bid) < parseFloat(data.minimum_bid))
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
      setReloadTrigger((p) => p + 1);
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
      setReloadTrigger((p) => p + 1);
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
      setAlertConfig({ visibility: true, message: "Please type the exact group name to confirm delete", type: "info" });
      return;
    }

    try {
      await api.delete(`/group/delete-group/${currentGroup._id}`);
      setAlertConfig({ visibility: true, message: "Group deleted successfully", type: "success" });
      setShowModalDelete(false);
      setReloadTrigger((p) => p + 1);
      setCurrentGroup(null);
    } catch (err) {
      console.error("Error deleting group", err);
      setAlertConfig({ visibility: true, message: "Failed to delete group", type: "error" });
    }
  };

  const handleShareClick = (groupId) => {
    if (!groupId) return;
    //const baseUrl = "http://prod-chit.s3-website.eu-north-1.amazonaws.com";
    const baseUrl = "http://localhost:5173";

    const fullUrl = `${baseUrl}/enrollment-request-form/?group_id=${groupId}`;
    window.open(fullUrl, "_blank");
  };


  const filteredGroups = groups.filter((g) => {
    const matchesSearch = (() => {
      const lowerSearch = searchText.toLowerCase().trim();
      const isNumericSearch = !isNaN(lowerSearch) && lowerSearch !== "";


      const byGroupName = g.group_name?.toString().toLowerCase().includes(lowerSearch);


      const byRMName = g.relationship_manager?.name?.toString().toLowerCase().includes(lowerSearch);


      const groupValueStr = g.group_value?.toString() || "";
      const normalizedSearch = lowerSearch.replace(/[,]/g, "");
      const byChitAmount =
        isNumericSearch &&
        (groupValueStr.includes(normalizedSearch) || groupValueStr === normalizedSearch);

      return byGroupName || byRMName || byChitAmount;
    })();

    const matchesGroupType = filters.groupType ? g.group_type === filters.groupType : true;
    const matchesRM = filters.relationshipManager ? g.relationship_manager?._id === filters.relationshipManager : true;

    let matchesDate = true;
    if (filters.startDateFrom || filters.startDateTo) {
      const groupDate = new Date(g.start_date);
      if (filters.startDateFrom && groupDate < new Date(filters.startDateFrom)) matchesDate = false;
      if (filters.startDateTo && groupDate > new Date(filters.startDateTo)) matchesDate = false;
    }

    return matchesSearch && matchesGroupType && matchesRM && matchesDate;
  });

  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = filteredGroups.slice(indexOfFirstGroup, indexOfLastGroup);
  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);

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
      <div className="bg-violet-100 border border-custom-violet rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg leading-tight">{group.group_name}</h3>
              <p className="text-xs text-gray-600 capitalize mt-1">{group.group_type} Group</p>
            </div>
            <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
              <IoMdMore className="text-xl cursor-pointer text-gray-500 hover:text-purple-700" />
            </Dropdown>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-purple-800">{group.group_members}</p>
              <p className="text-xs text-gray-600">Tickets</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-purple-800">₹{Number(group.group_install).toLocaleString()}</p>
              <p className="text-xs text-gray-600">Instalment</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-purple-800">₹{Number(group.group_value).toLocaleString()}</p>
              <p className="text-xs text-gray-600">Chit Amount</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-20 gap-y-1 text-sm text-gray-700">
            <span><strong>Period:</strong> {group.group_duration} months</span>
            <span><strong> Relationship Manager:</strong> {group.relationship_manager?.name || "N/A"}</span>
            <span><strong>Start Date:</strong> {group.start_date ? new Date(group.start_date).toLocaleDateString() : "N/A"}</span>
          </div>
        </div>
      </div>
    );
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) startPage = Math.max(1, endPage - maxVisiblePages + 1);

    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1 bg-white border border-gray-300 rounded"
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
            className={`px-3 py-1 rounded ${currentPage === num
                ? "bg-purple-600 text-white"
                : "bg-white border border-gray-300"
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
              className="px-3 py-1 bg-white border border-gray-300 rounded"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  const AddGroupModal = () => (
    <Modal isVisible={showModal} onClose={() => setShowModal(false)} borderColor="purple-600">
      <div className="py-6 px-5 lg:px-8 text-left">
        <h3 className="mb-5 text-xl font-bold text-custom-violet">Add New Group</h3>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <InputField name="group_name" label="Group Name" value={formData.group_name} onChange={handleChange} error={errors.group_name} />
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Group Type</label>
            <Select
              showSearch
              placeholder="Select Group Type"
              value={formData.group_type || undefined}
              onChange={(v) => handleAntSelectChange("group_type", v)}
              className="w-full"
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              <Option value="divident">Dividend</Option>
              <Option value="double">Double</Option>
            </Select>
            {errors.group_type && <p className="text-red-500 text-sm mt-1">{errors.group_type}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="group_value" label="Group Value" value={formData.group_value} onChange={handleChange} error={errors.group_value} type="number" />
            <InputField name="group_install" label="Installment" value={formData.group_install} onChange={handleChange} error={errors.group_install} type="number" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="group_members" label="Members" value={formData.group_members} onChange={handleChange} error={errors.group_members} type="number" />
            <InputField name="group_duration" label="Duration (months)" value={formData.group_duration} onChange={handleChange} error={errors.group_duration} type="number" />
          </div>

          <InputField name="reg_fee" label="Registration Fee" value={formData.reg_fee} onChange={handleChange} error={errors.reg_fee} type="number" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block mb-2 text-sm font-medium text-gray-900">Relationship Manager</label>
            <Select
              showSearch
              placeholder="Select Relationship Manager"
              value={formData.relationship_manager || undefined}
              onChange={(v) => handleAntSelectChange("relationship_manager", v)}
              className="w-full"
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {(Array.isArray(employees) ? employees : []).map((emp) => (
                <Option key={emp?._id} value={emp?._id}>
                  {emp?.name} | {emp?.phone_number}
                </Option>
              ))}
            </Select>
            {errors.relationship_manager && <p className="text-red-500 text-sm mt-1">{errors.relationship_manager}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="start_date" label="Start Date" type="date" value={formData.start_date} onChange={handleChange} error={errors.start_date} />
            <InputField name="end_date" label="End Date" type="date" value={formData.end_date} onChange={handleChange} error={errors.end_date} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="minimum_bid" label="Min Bid %" value={formData.minimum_bid} onChange={handleChange} error={errors.minimum_bid} type="number" />
            <InputField name="maximum_bid" label="Max Bid %" value={formData.maximum_bid} onChange={handleChange} error={errors.maximum_bid} type="number" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField name="commission" label="Agent Commission %" value={formData.commission} onChange={handleChange} type="number" />
            <InputField name="group_commission" label="Company Commission %" value={formData.group_commission} onChange={handleChange} type="number" />
            <InputField name="incentives" label="Employee Incentives %" value={formData.incentives} onChange={handleChange} type="number" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField name="daily_installment" label="Daily Installment" value={formData.daily_installment} onChange={handleChange} error={errors.daily_installment} type="number" />
            <InputField name="weekly_installment" label="Weekly Installment" value={formData.weekly_installment} onChange={handleChange} error={errors.weekly_installment} type="number" />
            <InputField name="monthly_installment" label="Monthly Installment" value={formData.monthly_installment} onChange={handleChange} error={errors.monthly_installment} type="text" />
          </div>

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="w-1/4 text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 shadow-lg"
            >
              Save Group
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );

  const UpdateGroupModal = () => (
    <Modal isVisible={showModalUpdate} onClose={() => setShowModalUpdate(false)} borderColor="purple-600">
      <div className="py-6 px-5 lg:px-8 text-left">
        <h3 className="mb-5 text-xl font-bold text-purple-700">Update Group</h3>
        <form className="space-y-5" onSubmit={handleUpdate} noValidate>
          <InputField name="group_name" label="Group Name" value={updateFormData.group_name} onChange={handleUpdateInputChange} error={errors.group_name} />
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
            <InputField name="group_value" label="Group Value" value={updateFormData.group_value} onChange={handleUpdateInputChange} error={errors.group_value} type="number" />
            <InputField name="group_install" label="Installment" value={updateFormData.group_install} onChange={handleUpdateInputChange} error={errors.group_install} type="number" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="group_members" label="Members" value={updateFormData.group_members} onChange={handleUpdateInputChange} error={errors.group_members} type="number" />
            <InputField name="group_duration" label="Duration (months)" value={updateFormData.group_duration} onChange={handleUpdateInputChange} error={errors.group_duration} type="number" />
          </div>

          <InputField name="reg_fee" label="Registration Fee" value={updateFormData.reg_fee} onChange={handleUpdateInputChange} error={errors.reg_fee} type="number" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block mb-2 text-sm font-medium text-gray-900">Relationship Manager</label>
            <Select
              showSearch
              placeholder="Select Relationship Manager"
              value={updateFormData.relationship_manager || undefined}
              onChange={(v) => handleAntUpdateSelectChange("relationship_manager", v)}
              className="w-full"
            >
              {(Array.isArray(employees) ? employees : []).map((emp) => (
                <Option key={emp?._id} value={emp?._id}>
                  {emp?.name} | {emp?.phone_number}
                </Option>
              ))}
            </Select>
            {errors.relationship_manager && <p className="text-red-500 text-sm mt-1">{errors.relationship_manager}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="start_date" label="Start Date" type="date" value={updateFormData.start_date} onChange={handleUpdateInputChange} error={errors.start_date} />
            <InputField name="end_date" label="End Date" type="date" value={updateFormData.end_date} onChange={handleUpdateInputChange} error={errors.end_date} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="minimum_bid" label="Min Bid %" value={updateFormData.minimum_bid} onChange={handleUpdateInputChange} error={errors.minimum_bid} type="number" />
            <InputField name="maximum_bid" label="Max Bid %" value={updateFormData.maximum_bid} onChange={handleUpdateInputChange} error={errors.maximum_bid} type="number" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField name="commission" label="Agent Commission %" value={updateFormData.commission} onChange={handleUpdateInputChange} type="number" />
            <InputField name="group_commission" label="Company Commission %" value={updateFormData.group_commission} onChange={handleUpdateInputChange} type="number" />
            <InputField name="incentives" label="Employee Incentives %" value={updateFormData.incentives} onChange={handleUpdateInputChange} type="number" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField name="daily_installment" label="Daily Installment" value={updateFormData.daily_installment} onChange={handleUpdateInputChange} error={errors.daily_installment} type="number" />
            <InputField name="weekly_installment" label="Weekly Installment" value={updateFormData.weekly_installment} onChange={handleUpdateInputChange} error={errors.weekly_installment} type="number" />
            <InputField name="monthly_installment" label="Monthly Installment" value={updateFormData.monthly_installment} onChange={handleUpdateInputChange} error={errors.monthly_installment} type="text" />
          </div>

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="w-1/4 text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );

  const DeleteGroupModal = () => (
    <Modal isVisible={showModalDelete} onClose={() => setShowModalDelete(false)} borderColor="red-600">
      <div className="py-6 px-5 lg:px-8 text-left">
        <h3 className="mb-4 text-xl font-bold text-gray-900">Delete Group</h3>
        <p className="mb-4 text-sm text-gray-700">
          To confirm deletion, type the group name <strong className="text-red-600">{currentGroup?.group_name}</strong> below and press Delete.
        </p>
        <input
          type="text"
          value={deletionGroupName}
          onChange={(e) => setDeletionGroupName(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg w-full p-2.5 mb-4"
          placeholder="Type exact group name to confirm"
        />
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowModalDelete(false)} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button onClick={handleDeleteGroup} className="px-4 py-2 bg-red-600 text-white rounded">
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <>
      <div className="flex mt-20 " >
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

        <div className="flex-grow flex flex-col bg-gray-50">
          <main className="flex-grow overflow-auto p-6">
            <div className="mb-6 mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-2xl font-bold text-gray-800">Groups</h3>
              <button
                onClick={() => {
                  setShowModal(true);
                  setErrors({});
                }}
                className="shrink-0 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 flex items-center gap-1 transition shadow-md"
              >
                <MdLibraryAdd /> Add New Group
              </button>
            </div>


            <div className="mb-6 p-4 bg-white rounded-lg shadow border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block mb-2 text-md font-medium text-gray-700">Group Type</label>
                  <select
                    name="groupType"
                    value={filters.groupType}
                    onChange={handleFilterChange}
                    className="bg-white border border-gray-300 rounded-lg p-2 w-full"
                  >
                    <option value="">All</option>
                    <option value="divident">Dividend</option>
                    <option value="double">Double</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-md font-medium text-gray-700">Relationship Manager</label>
                  <select
                    name="relationshipManager"
                    value={filters.relationshipManager}
                    onChange={handleFilterChange}
                    className="bg-white border border-gray-300 rounded-lg p-2 w-full"
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
                  <label className="block mb-2 w-24 text-md font-medium text-gray-700">Date Range</label>
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
                    className="bg-white border border-gray-300 rounded-lg p-2 w-full"
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
                          className="bg-white border border-gray-300 rounded p-1 text-sm w-full"
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
                          className="bg-white border border-gray-300 rounded p-1 text-sm w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="w-1/3">

                  <input
                    placeholder="Search by group, RM, or chit amount"
                    value={searchText}
                    onChange={onGlobalSearchChangeHandler}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex gap-2">
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
                    }}
                    className="px-3 py-2 bg-gray-100 rounded"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>


            {isLoading ? (
              <div className="py-12">
                <CircularLoader isLoading={isLoading} failure={false} data={"Group Data"} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {currentGroups.length > 0 ? (
                    currentGroups.map((g) => <GroupCard key={g._id} group={g} />)
                  ) : (
                    <div className="col-span-full p-6 bg-white rounded shadow text-center text-gray-600">
                      No groups found.
                    </div>
                  )}
                </div>

                <Pagination />
              </>
            )}
          </main>
        </div>
      </div>


      <AddGroupModal />
      <UpdateGroupModal />
      <DeleteGroupModal />
    </>
  );
};

export default Group;