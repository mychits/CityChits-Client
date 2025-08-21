/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Modal from "../components/modals/Modal";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import { Dropdown } from "antd";
import { IoMdMore } from "react-icons/io";
import { MdGroupWork, MdLibraryAdd } from "react-icons/md";
import CustomAlert from "../components/alerts/CustomAlert";
import filterOption from "../helpers/filterOption";

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [TableGroups, setTableGroups] = useState([]);
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
    useEffect(() => {
    async function getEmployees() {
      try {
        const response = await api.get("/agent/get-employee");
        const responseData = response.data?.employee;
        setEmployees(responseData ? responseData : []);
      } catch (error) {
        setEmployees([]);
        console.log("Error Fetching Employees");
      }
    }
    getEmployees();
  }, []);

  const [updateFormData, setUpdateFormData] = useState({ ...formData });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/group/get-group-admin");
        setGroups(response.data);
        const formatted = response.data.map((group, index) => ({
          _id: group._id,
          id: index + 1,
          name: group?.group_name,
          type: group?.group_type.charAt(0).toUpperCase() + group?.group_type.slice(1) + " Group",
          monthly_installment: group.monthly_installment,
          relationship_manager: group.relationship_manager?.name || "N/A",
          value: group?.group_value,
          installment: group?.group_install,
          members: group?.group_members,
          date: group?.createdAt,
          action: (
            <div className="flex justify-center gap-2">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: (
                        <div className="text-green-600" onClick={() => handleUpdateModalOpen(group._id)}>
                          Edit
                        </div>
                      ),
                    },
                    {
                      key: "2",
                      label: (
                        <div className="text-red-600" onClick={() => handleDeleteModalOpen(group._id)}>
                          Delete
                        </div>
                      ),
                    },
                    {
                      key: "3",
                      label: (
                        <div className="text-blue-600" onClick={() => handleShareClick(group._id)}>
                          Copy
                        </div>
                      ),
                    },
                  ],
                }}
                placement="bottomLeft"
              >
                <IoMdMore className="text-lg cursor-pointer" />
              </Dropdown>
            </div>
          ),
        }));
        setTableGroups(formatted);
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
    const newErrors = {};
    const data = type === "addGroup" ? formData : updateFormData;

    if (!data.group_name?.trim()) newErrors.group_name = "Group Name is required";
    if (!data.group_type) newErrors.group_type = "Group Type is required";
    if (!data.group_value || isNaN(data.group_value) || data.group_value <= 0)
      newErrors.group_value = "Group Value must be a positive number";
    if (!data.group_install || isNaN(data.group_install) || data.group_install <= 0)
      newErrors.group_install = "Installment must be a positive number";
    if (!data.group_members || isNaN(data.group_members) || data.group_members <= 0)
      newErrors.group_members = "Members must be a positive number";
    if (!data.group_duration || isNaN(data.group_duration) || data.group_duration <= 0)
      newErrors.group_duration = "Duration must be a positive number";
     if (!data.relationship_manager) {
      newErrors.relationship_manager = "Relationship Manager is required";
    }
    if (!data.monthly_installment) {
      newErrors.monthly_installment = "Monthly Installment is required";
    }
    if (!data.reg_fee || isNaN(data.reg_fee) || data.reg_fee < 0)
      newErrors.reg_fee = "Registration fee must be zero or positive";
    if (!data.start_date) newErrors.start_date = "Start date is required";
    if (data.end_date && new Date(data.end_date) < new Date(data.start_date))
      newErrors.end_date = "End date cannot be earlier than start date";
    if (!data.minimum_bid || isNaN(data.minimum_bid) || data.minimum_bid <= 0)
      newErrors.minimum_bid = "Minimum bid must be a positive number";
    if (!data.maximum_bid || isNaN(data.maximum_bid) || data.maximum_bid <= 0)
      newErrors.maximum_bid = "Maximum bid must be a positive number";
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
        group_name: "", group_type: "", group_value: "", group_install: "", group_members: "",
        group_duration: "", start_date: "", end_date: "", minimum_bid: "", maximum_bid: "",
        commission: "1", group_commission: "5", incentives: "1", reg_fee: "",relationship_manager: "",
          monthly_installment: "",
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
        relationship_manager: data?.relationship_manager?._id,
        monthly_installment: data?.monthly_installment,
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

    const AddGroupModal = () => (
    <Modal isVisible={showModal} onClose={() => setShowModal(false)} borderColor="custom-blue">
      <div className="py-6 px-5 lg:px-8 text-left">
        <h3 className="mb-4 text-xl font-bold text-custom-blue">Add Group</h3>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Group Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Group Name</label>
            <input
              type="text"
              name="group_name"
              value={formData.group_name}
              onChange={handleChange}
              placeholder="Enter the Group Name"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-blue focus:border-custom-blue w-full p-2.5"
            />
            {errors.group_name && <p className="text-red-500 text-sm mt-1">{errors.group_name}</p>}
          </div>

          {/* Group Type */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Group Type</label>
            <select
              name="group_type"
              value={formData.group_type}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-blue focus:border-custom-blue w-full p-2.5"
            >
              <option value="">Select Group Type</option>
              <option value="divident">Dividend Group</option>
              <option value="double">Double Group</option>
            </select>
            {errors.group_type && <p className="text-red-500 text-sm mt-1">{errors.group_type}</p>}
          </div>

          {/* Two-column fields */}
          <div className="flex gap-4">
            <InputField name="group_value" label="Group Value" value={formData.group_value} onChange={handleChange} error={errors.group_value} />
            <InputField name="group_install" label="Installment" value={formData.group_install} onChange={handleChange} error={errors.group_install} />
          </div>
          <div className="flex gap-4">
            <InputField name="group_members" label="Members" value={formData.group_members} onChange={handleChange} error={errors.group_members} />
            <InputField name="group_duration" label="Duration" value={formData.group_duration} onChange={handleChange} error={errors.group_duration} />
          </div>

          <div>
            <InputField name="reg_fee" label="Registration Fee" value={formData.reg_fee} onChange={handleChange} error={errors.reg_fee} />
          </div>
          <div className="flex gap-4">
          <InputField
            name="monthly_installment"
            label="monthly_installment"
            value={formData.monthly_installment}
            onChange={handleChange}
            error={errors.monthly_installment}
          />
          <InputField
            name="relationship_manager"
            label="relationship_manager"
            value={formData.relationship_manager}
            onChange={handleChange}
            error={errors.relationship_manager}
          />
        </div>

          <div className="flex gap-4">
            <InputField name="start_date" label="Start Date" type="date" value={formData.start_date} onChange={handleChange} error={errors.start_date} />
            <InputField name="end_date" label="End Date" type="date" value={formData.end_date} onChange={handleChange} error={errors.end_date} />
          </div>

          <div className="flex gap-4">
            <InputField name="minimum_bid" label="Min Bid %" value={formData.minimum_bid} onChange={handleChange} error={errors.minimum_bid} />
            <InputField name="maximum_bid" label="Max Bid %" value={formData.maximum_bid} onChange={handleChange} error={errors.maximum_bid} />
          </div>

          <div className="flex gap-4">
            <InputField name="commission" label="Employee Commission %" value={formData.commission} onChange={handleChange} />
            <InputField name="group_commission" label="Commission %" value={formData.group_commission} onChange={handleChange} />
            <InputField name="incentives" label="Incentives %" value={formData.incentives} onChange={handleChange} />
          </div>

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="w-1/4 text-white bg-custom-blue hover:bg-opacity-95 focus:ring-custom-blue outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-lg active:scale-110"
            >
              Save Group
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );

const UpdateGroupModal = () => (
  <Modal
    isVisible={showModalUpdate}
    onClose={() => setShowModalUpdate(false)}
    borderColor="custom-blue"
  >
    <div className="py-6 px-5 lg:px-8 text-left">
      <h3 className="mb-4 text-xl font-bold text-custom-blue">Update Group</h3>
      <form className="space-y-6" onSubmit={handleUpdate} noValidate>
        <InputField
          name="group_name"
          label="Group Name"
          value={updateFormData?.group_name}
          onChange={handleInputChange}
          error={errors.group_name}
        />

        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Group Type
          </label>
          <select
            name="group_type"
            value={updateFormData.group_type}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-blue focus:border-custom-blue w-full p-2.5"
          >
            <option value="">Select Group Type</option>
            <option value="divident">Dividend Group</option>
            <option value="double">Double Group</option>
          </select>
          {errors.group_type && (
            <p className="text-red-500 text-sm mt-1">{errors.group_type}</p>
          )}
        </div>

        <div className="flex gap-4">
          <InputField
            name="group_value"
            label="Group Value"
            value={updateFormData.group_value}
            onChange={handleInputChange}
            error={errors.group_value}
          />
          <InputField
            name="group_install"
            label="Installment"
            value={updateFormData.group_install}
            onChange={handleInputChange}
            error={errors.group_install}
          />
        </div>

        <div className="flex gap-4">
          <InputField
            name="group_members"
            label="Members"
            value={updateFormData.group_members}
            onChange={handleInputChange}
            error={errors.group_members}
          />
          <InputField
            name="group_duration"
            label="Duration"
            value={updateFormData.group_duration}
            onChange={handleInputChange}
            error={errors.group_duration}
          />
        </div>

        <InputField
          name="reg_fee"
          label="Registration Fee"
          value={updateFormData.reg_fee}
          onChange={handleInputChange}
          error={errors.reg_fee}
        />

        <div className="flex gap-4">
          <InputField
            name="monthly_installment"
            label="monthly_installment"
            value={updateFormData.monthly_installment}
            onChange={handleInputChange}
            error={errors.monthly_installment}
          />
          <InputField
            name="relationship_manager"
            label="relationship_manager"
            value={updateFormData.relationship_manager}
            onChange={handleInputChange}
            error={errors.relationship_manager}
          />
        </div>

        <div className="flex gap-4">
          <InputField
            name="start_date"
            label="Start Date"
            type="date"
            value={updateFormData.start_date}
            onChange={handleInputChange}
            error={errors.start_date}
          />
          <InputField
            name="end_date"
            label="End Date"
            type="date"
            value={updateFormData.end_date}
            onChange={handleInputChange}
            error={errors.end_date}
          />
        </div>

        <div className="flex gap-4">
          <InputField
            name="minimum_bid"
            label="Min Bid %"
            value={updateFormData.minimum_bid}
            onChange={handleInputChange}
            error={errors.minimum_bid}
          />
          <InputField
            name="maximum_bid"
            label="Max Bid %"
            value={updateFormData.maximum_bid}
            onChange={handleInputChange}
            error={errors.maximum_bid}
          />
        </div>

        <div className="flex gap-4">
          <InputField
            name="commission"
            label="Employee Commission %"
            value={updateFormData.commission}
            onChange={handleInputChange}
          />
          <InputField
            name="group_commission"
            label="Commission %"
            value={updateFormData.group_commission}
            onChange={handleInputChange}
          />
          <InputField
            name="incentives"
            label="Incentives %"
            value={updateFormData.incentives}
            onChange={handleInputChange}
          />
        </div>

        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="w-1/4 text-white bg-custom-blue hover:bg-opacity-95 focus:ring-custom-blue outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-lg active:scale-110"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </Modal>
);


  const InputField = ({ name, label, value, onChange, error, type = "number" }) => (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label}`}
        required
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-blue focus:border-custom-blue w-full p-2.5"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
  const columns = [
    { key: "id", header: "SL. NO" },
    { key: "name", header: "Group Name" },
    { key: "type", header: "Group Type" },
    { key: "value", header: "Group Value" },
    { key: "installment", header: "Installment" },
    { key: "members", header: "Members" },
     { key: "monthly_installment", header: "Monthly Installment" },
    { key: "relationship_manager", header: "Relationship Manager" },
    { key: "action", header: "Action" },
  ];

  return (
    <>
      <div>
        <CustomAlert
          type={alertConfig.type}
          isVisible={alertConfig.visibility}
          message={alertConfig.message}
        />

        <div className="flex mt-20">
          <Sidebar navSearchBarVisibility={true} onGlobalSearchChangeHandler={onGlobalSearchChangeHandler} />

          <div className="flex-grow p-7">
            <DataTable
             
              iconName="Groups"
              clickableIconName="Add Group"
              catcher="_id"
              onClickHandler={() => {
                setShowModal(true);
                setErrors({});
              }}
              updateHandler={handleUpdateModalOpen}
              data={filterOption(TableGroups, searchText)}
              columns={columns}
              selectionColor="custom-violet"
              exportedPdfName="Groups"
              exportedFileName={`Groups.csv`}
            />
          </div>
        </div>

        {/* Modals */}
        {AddGroupModal()}
        {UpdateGroupModal()}

        {/* Delete Confirm Modal */}
        <Modal isVisible={showModalDelete} onClose={() => setShowModalDelete(false)} borderColor="red-500">
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this group?</h2>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowModalDelete(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteGroup}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Group;

