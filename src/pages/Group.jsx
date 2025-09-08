/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Modal from "../components/modals/Modal";
import api from "../instance/TokenInstance";
import { Dropdown, Menu } from "antd";
import { IoMdMore } from "react-icons/io";
import { MdLibraryAdd } from "react-icons/md";
import CustomAlert from "../components/alerts/CustomAlert";

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [currentUpdateGroup, setCurrentUpdateGroup] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });

  // Search handler
  const onGlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

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
    relationship_manager: "",
  });

  const [updateFormData, setUpdateFormData] = useState({ ...formData });
  const [errors, setErrors] = useState({});

  // Fetch Employees
  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await api.get("/agent/get-employee");
        setEmployees(response.data?.employee || []);
      } catch (error) {
        console.log("Error fetching employees", error);
        setEmployees([]);
      }
    };
    getEmployees();
  }, []);

  // Fetch Groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/group/get-group-admin");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    };
    fetchGroups();
  }, [reloadTrigger]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (type = "addGroup") => {
    const data = type === "addGroup" ? formData : updateFormData;
    const newErrors = {};

    if (!data.group_name?.trim()) newErrors.group_name = "Group Name is required";
    if (!data.group_type) newErrors.group_type = "Group Type is required";
    if (!data.group_value || isNaN(data.group_value) || data.group_value <= 0)
      newErrors.group_value = "Group Value must be positive";
    if (!data.group_install || isNaN(data.group_install) || data.group_install <= 0)
      newErrors.group_install = "Installment must be positive";
    if (!data.group_members || isNaN(data.group_members) || data.group_members <= 0)
      newErrors.group_members = "Members must be positive";
    if (!data.group_duration || isNaN(data.group_duration) || data.group_duration <= 0)
      newErrors.group_duration = "Duration must be positive";
    if (!data.relationship_manager) newErrors.relationship_manager = "Relationship Manager is required";
    if (!data.monthly_installment) newErrors.monthly_installment = "Monthly Installment is required";
    if (!data.reg_fee || isNaN(data.reg_fee) || data.reg_fee < 0)
      newErrors.reg_fee = "Registration fee must be zero or positive";
    if (!data.start_date) newErrors.start_date = "Start date is required";
    if (data.end_date && new Date(data.end_date) < new Date(data.start_date))
      newErrors.end_date = "End date cannot be earlier than start date";
    if (!data.minimum_bid || isNaN(data.minimum_bid) || data.minimum_bid <= 0)
      newErrors.minimum_bid = "Minimum bid must be positive";
    if (!data.maximum_bid || isNaN(data.maximum_bid) || data.maximum_bid <= 0)
      newErrors.maximum_bid = "Maximum bid must be positive";
    else if (parseFloat(data.maximum_bid) < parseFloat(data.minimum_bid))
      newErrors.maximum_bid = "Maximum bid cannot be less than minimum bid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm("addGroup");
    if (!isValid) return;

    try {
      await api.post("/group/add-group", formData);
      setShowModal(false);
      setReloadTrigger((prev) => prev + 1);
      setAlertConfig({ visibility: true, message: "Group added successfully", type: "success" });
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
        relationship_manager: "",
      });
    } catch (error) {
      console.error("Add group error", error);
    }
  };

  const handleUpdateModalOpen = async (id) => {
    try {
      const res = await api.get(`/group/get-by-id-group/${id}`);
      const data = res.data;
      setCurrentUpdateGroup(data);
      setUpdateFormData({
        ...data,
        start_date: data.start_date?.split("T")[0],
        end_date: data.end_date?.split("T")[0],
        relationship_manager: data.relationship_manager?._id,
        monthly_installment: data.monthly_installment,
      });
      setShowModalUpdate(true);
      setErrors({});
    } catch (err) {
      console.error("Get group by ID error", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const isValid = validateForm("updateGroup");
    if (!isValid) return;

    try {
      await api.put(`/group/update-group/${currentUpdateGroup._id}`, updateFormData);
      setShowModalUpdate(false);
      setReloadTrigger((prev) => prev + 1);
      setAlertConfig({ visibility: true, message: "Group updated successfully", type: "success" });
    } catch (error) {
      console.error("Update group error", error);
    }
  };

  const handleDeleteModalOpen = async (id) => {
    try {
      const res = await api.get(`/group/get-by-id-group/${id}`);
      setCurrentGroup(res.data);
      setShowModalDelete(true);
    } catch (err) {
      console.error("Fetch group for delete error", err);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await api.delete(`/group/delete-group/${currentGroup._id}`);
      setShowModalDelete(false);
      setReloadTrigger((prev) => prev + 1);
      setAlertConfig({ visibility: true, message: "Group deleted successfully", type: "success" });
    } catch (err) {
      console.error("Delete group error", err);
    }
  };

  const handleShareClick = (groupId) => {
    const baseUrl = "http://prod-chit.s3-website.eu-north-1.amazonaws.com";
    const fullUrl = `${baseUrl}/enrollment-request-form/?group_id=${groupId}`;
    window.open(fullUrl, "_blank");
  };

  // Input Field Component
  const InputField = ({ name, label, value, onChange, error, type = "text" }) => (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label}`}
        required
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 w-full p-2.5"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  // Card Component — With All Details & Action Menu
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
          <span className="text-green-600">Copy Link</span>
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
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
              <IoMdMore className="text-xl cursor-pointer text-gray-500 hover:text-purple-700" />
            </Dropdown>
          </div>

       
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-purple-800">{group.group_members}</p>
              <p className="text-xs text-gray-600">Tickets</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-purple-800">₹{group.group_install.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Instalment</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-purple-800">₹{group.group_value.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Chit Amount</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-20 gap-y-1 text-sm text-gray-700">
            <span><strong>Period:</strong> {group.group_duration} months</span>
            <span><strong> Relationship Manager:</strong> {group.relationship_manager?.name || "N/A"}</span>
            <span><strong>Start Date:</strong> {new Date(group.start_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  };

  
  const AddGroupModal = () => (
    <Modal isVisible={showModal} onClose={() => setShowModal(false)} borderColor="purple-600">
      <div className="py-6 px-5 lg:px-8 text-left">
        <h3 className="mb-5 text-xl font-bold text-purple-700">Add New Group</h3>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <InputField name="group_name" label="Group Name" value={formData.group_name} onChange={handleChange} error={errors.group_name} />

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Group Type</label>
            <select
              name="group_type"
              value={formData.group_type}
              onChange={handleChange}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 w-full p-2.5"
            >
              <option value="">Select Group Type</option>
              <option value="divident">Dividend Group</option>
              <option value="double">Double Group</option>
            </select>
            {errors.group_type && <p className="text-red-500 text-sm mt-1">{errors.group_type}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="group_value" label="Group Value" value={formData.group_value} onChange={handleChange} error={errors.group_value} type="number" />
            <InputField name="group_install" label="Installment" value={formData.group_install} onChange={handleChange} error={errors.group_install} type="number" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="group_members" label="Members" value={formData.group_members} onChange={handleChange} error={errors.group_members} type="number" />
            <InputField name="group_duration" label="Duration" value={formData.group_duration} onChange={handleChange} error={errors.group_duration} type="number" />
          </div>

          <InputField name="reg_fee" label="Registration Fee" value={formData.reg_fee} onChange={handleChange} error={errors.reg_fee} type="number" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="monthly_installment" label="Monthly Installment" value={formData.monthly_installment} onChange={handleChange} error={errors.monthly_installment} type="number" />
            <InputField name="relationship_manager" label="Relationship Manager" value={formData.relationship_manager} onChange={handleChange} error={errors.relationship_manager} />
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

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="w-1/4 text-white bg-purple-700 hover:bg-purple-800 focus:ring-purple-700 outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-lg active:scale-105 transition"
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
          <InputField name="group_name" label="Group Name" value={updateFormData?.group_name} onChange={handleInputChange} error={errors.group_name} />

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Group Type</label>
            <select
              name="group_type"
              value={updateFormData.group_type}
              onChange={handleInputChange}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 w-full p-2.5"
            >
              <option value="">Select Group Type</option>
              <option value="divident">Dividend Group</option>
              <option value="double">Double Group</option>
            </select>
            {errors.group_type && <p className="text-red-500 text-sm mt-1">{errors.group_type}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="group_value" label="Group Value" value={updateFormData.group_value} onChange={handleInputChange} error={errors.group_value} type="number" />
            <InputField name="group_install" label="Installment" value={updateFormData.group_install} onChange={handleInputChange} error={errors.group_install} type="number" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="group_members" label="Members" value={updateFormData.group_members} onChange={handleInputChange} error={errors.group_members} type="number" />
            <InputField name="group_duration" label="Duration" value={updateFormData.group_duration} onChange={handleInputChange} error={errors.group_duration} type="number" />
          </div>

          <InputField name="reg_fee" label="Registration Fee" value={updateFormData.reg_fee} onChange={handleInputChange} error={errors.reg_fee} type="number" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="monthly_installment" label="Monthly Installment" value={updateFormData.monthly_installment} onChange={handleInputChange} error={errors.monthly_installment} type="number" />
            <InputField name="relationship_manager" label="Relationship Manager" value={updateFormData.relationship_manager} onChange={handleInputChange} error={errors.relationship_manager} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="start_date" label="Start Date" type="date" value={updateFormData.start_date} onChange={handleInputChange} error={errors.start_date} />
            <InputField name="end_date" label="End Date" type="date" value={updateFormData.end_date} onChange={handleInputChange} error={errors.end_date} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="minimum_bid" label="Min Bid %" value={updateFormData.minimum_bid} onChange={handleInputChange} error={errors.minimum_bid} type="number" />
            <InputField name="maximum_bid" label="Max Bid %" value={updateFormData.maximum_bid} onChange={handleInputChange} error={errors.maximum_bid} type="number" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField name="commission" label="Agent Commission %" value={updateFormData.commission} onChange={handleInputChange} type="number" />
            <InputField name="group_commission" label="Company Commission %" value={updateFormData.group_commission} onChange={handleInputChange} type="number" />
            <InputField name="incentives" label="Employee Incentives %" value={updateFormData.incentives} onChange={handleInputChange} type="number" />
          </div>

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="w-1/4 text-white bg-purple-700 hover:bg-purple-800 focus:ring-purple-700 outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-lg active:scale-105 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );

  return (
    <>
      <CustomAlert
        type={alertConfig.type}
        isVisible={alertConfig.visibility}
        message={alertConfig.message}
      />

      <div className="flex  mt-20 h-screen">
     
        <Sidebar navSearchBarVisibility={true} onGlobalSearchChangeHandler={onGlobalSearchChangeHandler} />

     
        <div className="flex-grow bg-gray-50  overflow-auto">
         
         

          <main className="p-6">
           
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
              {/* <div className="relative flex-1 max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search Groups Here..."
                  value={searchText}
                  onChange={onGlobalSearchChangeHandler}  
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div> */}
              <button
                onClick={() => setShowModal(true)}
                className="shrink-0 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 flex items-center gap-1 transition shadow-md"
              >
                <MdLibraryAdd /> Add New Group
              </button>
            </div>

         
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {groups
                .filter(group =>
                  group.group_name.toLowerCase().includes(searchText.toLowerCase()) ||
                  group.relationship_manager?.name?.toLowerCase().includes(searchText.toLowerCase())
                )
                .map((group) => (
                  <GroupCard key={group._id} group={group} />
                ))}
            </div>
          </main>
        </div>
      </div>

    
      {AddGroupModal()}
      {UpdateGroupModal()}

     
      <Modal isVisible={showModalDelete} onClose={() => setShowModalDelete(false)} borderColor="red-500">
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this group?</h2>
          <div className="flex justify-center gap-4">
            <button
              className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              onClick={() => setShowModalDelete(false)}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              onClick={handleDeleteGroup}
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