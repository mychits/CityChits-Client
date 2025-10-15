/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Modal from "../components/modals/Modal";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import { Input, Select, Dropdown, Collapse } from "antd";

import { IoMdMore } from "react-icons/io";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";
import CircularLoader from "../components/loaders/CircularLoader";
import handleEnrollmentRequestPrint from "../components/printFormats/enrollmentRequestPrint";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";
import { fieldSize } from "../data/fieldSize";
import { Link } from "react-router-dom";

const User = () => {
  const [users, setUsers] = useState([]);
  const [TableUsers, setTableUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUpdateUser, setCurrentUpdateUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState({});
  const [groups, setGroups] = useState([]);
  const [areas, setAreas] = useState([]);
  const [files, setFiles] = useState({});
  const [districts, setDistricts] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [collectionExecutive, setCollectionExecutive] = useState([]);

  const { Panel } = Collapse;

  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });
  const [errors, setErrors] = useState({});
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    address: "",
    pincode: "",
    adhaar_no: "",
    pan_no: "",
    track_source: "admin_panel",
    collection_area: "",
    collection_executive: "",
  });

  const [updateFormData, setUpdateFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    address: "",
    pincode: "",
    adhaar_no: "",
    pan_no: "",
    title: "",
    gender: "",
    marital_status: "",
    dateofbirth: "",
    nationality: "",
    village: "",
    taluk: "",
    father_name: "",
    district: "",
    state: "",
    collection_area: "",
    alternate_number: "",
    referral_name: "",
    nominee_name: "",
    nominee_dateofbirth: "",
    nominee_phone_number: "",
    nominee_relationship: "",
    aadhar_frontphoto: "",
    aadhar_backphoto: "",
    pan_frontphoto: "",
    pan_backphoto: "",
    profilephoto: "",
    bank_name: "",
    bank_branch_name: "",
    bank_account_number: "",
    bank_IFSC_code: "",
    selected_plan: "",
    collection_executive: "",
  });

  const [searchText, setSearchText] = useState("");
  const GlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  useEffect(() => {
    const fetchCollectionArea = async () => {
      try {
        const response = await api.get(
          "/collection-area-request/get-collection-area-data"
        );

        setAreas(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchCollectionArea();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get("/agent/get-agent");
        setCollectionExecutive(response.data);
      } catch (err) {
        console.error("Failed to fetch employee", err);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await api.get("/user/district");
        setDistricts(response.data?.data?.districts);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/user/get-user");
        setUsers(response.data);
        const formattedData = response.data.map((group, index) => ({
          _id: group._id,
          id: index + 1,
          name: group.full_name,
          phone_number: group.phone_number,
          createdAt: group?.createdAt?.split("T")[0],
          address: group.address,
          pincode: group.pincode,
          customer_id: group.customer_id,
          collection_area: group.collection_area?.route_name,
          approval_status:
            group.approval_status === "true" ? (
              <div className="inline-block px-3 py-1 text-md font-medium  bg-green-200 rounded-full shadow-sm">
                Approved
              </div>
            ) : group.approval_status === "false" ? (
              <div className="inline-block px-3 py-1 text-md font-medium  bg-red-200 rounded-full shadow-sm">
                Pending
              </div>
            ) : (
              <div className="inline-block px-3 py-1 text-md font-medium  bg-green-200  rounded-full shadow-sm">
                Approved
              </div>
            ),
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
                          className="text-green-600"
                          onClick={() => handleUpdateModalOpen(group?._id)}
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
                          onClick={() => handleDeleteModalOpen(group?._id)}
                        >
                          Delete
                        </div>
                      ),
                    },
                    {
                      key: "3",
                      label: (
                        <div
                          onClick={() =>
                            handleEnrollmentRequestPrint(group?._id)
                          }
                          className=" text-violet-600 "
                        >
                          Print
                        </div>
                      ),
                    },
                    {
                      key: "4",
                      label: (
                        <div
                          className={`cursor-pointer ${group?.approval_status !== "true"
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                          onClick={() =>
                            handleCustomerStatus(
                              group?._id,
                              group?.approval_status !== "true"
                                ? "true"
                                : "false"
                            )
                          }
                        >
                          {group?.approval_status !== "true"
                            ? "Approve Customer"
                            : "Un Approve Customer"}
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
        let fData = formattedData.map((ele) => {
          if (
            ele?.address &&
            typeof ele.address === "string" &&
            ele?.address?.includes(",")
          )
            ele.address = ele.address.replaceAll(",", " ");
          return ele;
        });
        if (!fData) setTableUsers(formattedData);
        if (!fData) setTableUsers(formattedData);
        setTableUsers(fData);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const res = await api.get("group/get-group-admin");
        setGroups(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchGroupData();
  }, [reloadTrigger]);
  const handleAntDSelect = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };
  const handleAntInputDSelect = (field, value) => {
    setUpdateFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    setErrors({ ...errors, [field]: "" });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevData) => ({
      ...prevData,
      [name]: "",
    }));
  };
  const handleAntDSelectGroup = async (groupId) => {
    try {
      const response = await api.get(`/group/get-by-id-group/${groupId}`);
      setSelectedGroup(response.data);
    } catch (err) {
      console.error("Failed to fetch group:", err);
    }
  };
  const validateForm = (type) => {
    const newErrors = {};
    const data = type === "addCustomer" ? formData : updateFormData;
    const regex = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^[6-9]\d{9}$/,
      pincode: /^\d{6}$/,
      adhaar: /^\d{12}$/,
      pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    };

    if (!data.full_name.trim()) {
      newErrors.full_name = "Full Name is required";
    }

    if (data.email && !regex.email.test(data.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!data.phone_number) {
      newErrors.phone_number = "Phone number is required";
    } else if (!regex.phone.test(data.phone_number)) {
      newErrors.phone_number = "Invalid  phone number";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    }

    if (!data.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!regex.pincode.test(data.pincode)) {
      newErrors.pincode = "Invalid pincode (6 digits required)";
    }

    if (!data.adhaar_no) {
      newErrors.adhaar_no = "Aadhar number is required";
    } else if (!regex.adhaar.test(data.adhaar_no)) {
      newErrors.adhaar_no = "Invalid Aadhar number (12 digits required)";
    }
    if (data.pan_no && !regex.pan.test(data.pan_no.toUpperCase())) {
      newErrors.pan_no = "Invalid PAN format (e.g., ABCDE1234F)";
    }

    if (!data.address.trim()) {
      newErrors.address = "Address is required";
    } else if (data.address.trim().length < 3) {
      newErrors.address = "Address should be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm("addCustomer");
    if (isValid) {
      try {
        const response = await api.post("/user/add-user-admin", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setReloadTrigger((prev) => prev + 1);
        setAlertConfig({
          type: "success",
          message: "User Added Successfully",
          visibility: true,
        });

        setShowModal(false);
        setErrors({});
        setFormData({
          full_name: "",
          email: "",
          phone_number: "",
          password: "",
          address: "",
          pincode: "",
          adhaar_no: "",
          pan_no: "",
          collection_executive: "",
          collection_area: "",
          track_source: "admin-panel",
        });
      } catch (error) {
        console.error("Error adding user:", error);

        if (
          error.response &&
          error.response.data &&
          error.response.data.message &&
          error.response.data.message.toLowerCase().includes("phone number")
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            phone_number: "Phone number already exists",
          }));
        }

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setAlertConfig({
            type: "error",
            message: `${error?.response?.data?.message}`,
            visibility: true,
          });
        } else {
          setAlertConfig({
            type: "error",
            message: "An unexpected error occurred. Please try again.",
            visibility: true,
          });
        }
      }
    }
  };

  const columns = [
    { key: "id", header: "SL. NO" },

    { key: "customer_id", header: "Customer Id" },
    { key: "name", header: "Customer Name" },
    { key: "phone_number", header: "Customer Phone Number" },
    { key: "createdAt", header: "Joined On" },
    { key: "address", header: "Customer Address" },
    { key: "pincode", header: "Customer Pincode" },
    { key: "collection_area", header: "Area" },
    { key: "approval_status", header: "Approval Status" },

    { key: "action", header: "Action" },
  ];

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteModalOpen = async (userId) => {
    try {
      const response = await api.get(`/user/get-user-by-id/${userId}`);
      setCurrentUser(response.data);
      setShowModalDelete(true);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleUpdateModalOpen = async (userId) => {
    try {
      const response = await api.get(`/user/get-user-by-id/${userId}`);
      setCurrentUpdateUser(response.data);
      setSelectedGroup(response?.data?.selected_plan);
      setUpdateFormData({
        full_name: response?.data?.full_name,
        email: response?.data?.email,
        phone_number: response?.data?.phone_number,
        password: response?.data?.password,
        pincode: response?.data?.pincode,
        adhaar_no: response?.data?.adhaar_no,
        pan_no: response?.data?.pan_no,
        address: response?.data?.address,
        selected_plan: response?.data?.selected_plan?._id || "",
        title: response?.data?.title,
        father_name: response?.data?.father_name,
        gender: response?.data?.gender,
        marital_status: response?.data?.marital_status,
        dateofbirth: response?.data?.dateofbirth?.split("T")[0],
        nationality: response?.data?.nationality,
        village: response?.data?.village,
        taluk: response?.data?.taluk,
        district: response?.data?.district,
        state: response?.data?.state,
        collection_area: response?.data?.collection_area?._id || "",
        collection_executive: response?.data?.collection_executive?._id || "",
        alternate_number: response?.data?.alternate_number,
        referral_name: response?.data?.referral_name,
        nominee_name: response?.data?.nominee_name,
        nominee_dateofbirth: response?.data?.nominee_dateofbirth?.split("T")[0],
        nominee_relationship: response?.data?.nominee_relationship,
        nominee_phone_number: response?.data?.nominee_phone_number,
        bank_name: response?.data?.bank_name,
        bank_branch_name: response?.data?.bank_branch_name,
        bank_account_number: response?.data?.bank_account_number,
        bank_IFSC_code: response?.data?.bank_IFSC_code,
        aadhar_frontphoto: response?.data?.aadhar_frontphoto,
        aadhar_backphoto: response?.data?.aadhar_backphoto,
        pan_frontphoto: response?.data?.pan_frontphoto,
        pan_backphoto: response?.data?.pan_backphoto,
        profilephoto: response?.data?.profilephoto,
      });
      setShowModalUpdate(true);
      setErrors({});
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevData) => ({
      ...prevData,
      [name]: "",
    }));
  };

  const handleDeleteUser = async () => {
    if (currentUser) {
      try {
        await api.delete(`/user/delete-user/${currentUser._id}`);

        setAlertConfig({
          visibility: true,
          message: "User deleted successfully",
          type: "success",
        });
        setReloadTrigger((prev) => prev + 1);
        setShowModalDelete(false);
        setCurrentUser(null);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      setUpdateFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    }
  };

  const handleCustomerStatus = async (id, currentStatus) => {
    try {
      if (!id) {
        console.warn("No user ID provided");
        return;
      }
      const response = await api.put(`/user/update-user/${id}`, {
        approval_status: currentStatus,
      });

      if (response.status === 200) {
        setReloadTrigger((prev) => prev + 1);
        setAlertConfig({
          visibility: true,
          message: `User status has been successfully updated to ${currentStatus}`,
          type: "success",
        });
        console.info(
          `Approval status updated to ${currentStatus} for user ID:`,
          id
        );
      } else {
        console.warn("Failed to update customer status:", response?.data);
      }
    } catch (err) {
      console.error("Error updating customer status:", err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const fmData = new FormData();

      Object.entries(updateFormData).forEach(([key, value]) => {
        if (key === "selected_plan" && selectedGroup?._id) {
          fmData.append("selected_plan", selectedGroup._id);
        } else if (value) {
          fmData.append(key, value);
        }
      });

      await api.put(`/user/update-user/${currentUpdateUser?._id}`, fmData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowModalUpdate(false);
      setReloadTrigger((prev) => prev + 1);
      setAlertConfig({
        visibility: true,
        message: "User Updated Successfully",
        type: "success",
      });
      setErrors({});
    } catch (error) {
      console.error("Error updating user:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message
          .toLowerCase()
          .includes("phone number already exists")
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone_number: "Phone number already exists",
        }));
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setAlertConfig({
          type: "error",
          message: `${error?.response?.data?.message}`,
          visibility: true,
        });
      } else {
        setAlertConfig({
          type: "error",
          message: "An unexpected error occurred. Please try again.",
          visibility: true,
        });
      }
    }
  };

  return (
    <>
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

          <div className="flex-grow p-7">
            <div className="mt-6 mb-8">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-semibold">Customers</h1>

                <button
                  onClick={() => {
                    setShowModal(true);
                    setErrors({});
                  }}
                  className="ml-4 bg-violet-800 text-white px-4 py-2 rounded shadow-md hover:bg-violet-600 transition duration-200"
                >
                  + Add Customer
                </button>
              </div>
            </div>
            {TableUsers?.length > 0 && !isLoading ? (
              <DataTable
                catcher="_id"
                updateHandler={handleUpdateModalOpen}
                data={filterOption(TableUsers, searchText)}
                columns={columns}
                exportedPdfName="Customers"
                exportedFileName={`Customers.csv`}
              />
            ) : (
              <CircularLoader
                isLoading={isLoading}
                failure={TableUsers.length <= 0}
                data="Customer Data"
              />
            )}
          </div>
        </div>
        <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Add Customer
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="email"
                >
                  Full Name <span className="text-red-500 ">*</span>
                </label>
                <Input
                  type="text"
                  name="full_name"
                  value={formData?.full_name}
                  onChange={handleChange}
                  id="name"
                  placeholder="Enter the Full Name"
                  required
                  className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                />
                {errors.full_name && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.full_name}
                  </p>
                )}
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    id="text"
                    placeholder="Enter Email"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Phone Number <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    id="text"
                    placeholder="Enter Phone Number"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                  {errors.phone_number && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.phone_number}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Password <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    id="text"
                    placeholder="Enter Password"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Pincode <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="number"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    id="text"
                    placeholder="Enter Pincode"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                  {errors.pincode && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Adhaar Number <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="number"
                    name="adhaar_no"
                    value={formData.adhaar_no}
                    onChange={handleChange}
                    id="text"
                    placeholder="Enter Adhaar Number"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                  {errors.adhaar_no && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.adhaar_no}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Pan Number
                  </label>
                  <Input
                    type="text"
                    name="pan_no"
                    value={formData?.pan_no}
                    onChange={handleChange}
                    id="text"
                    placeholder="Enter Pan Number"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                  {errors.pan_no && (
                    <p className="mt-2 text-sm text-red-600">{errors.pan_no}</p>
                  )}
                </div>
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="email"
                >
                  Address <span className="text-red-500 ">*</span>
                </label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  id="name"
                  placeholder="Enter the Address"
                  required
                  className={`bg-gray-50 border ${fieldSize.height} border-gray-300 text-gray-900 text-sm rounded-lg w-full`}
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="area"
                  >
                    Collection Area
                  </label>
                  <Select
                    className="bg-gray-50 border h-14 border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                    placeholder="Select Or Search Collection Area"
                    popupMatchSelectWidth={false}
                    name="collection_area"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={formData?.collection_area || undefined}
                    onChange={(value) =>
                      handleAntDSelect("collection_area", value)
                    }
                  >
                    {areas.map((area) => (
                      <Select.Option key={area._id} value={area._id}>
                        {area.route_name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="area"
                  >
                    Collection Executive
                  </label>
                  <Select
                    className="bg-gray-50 border h-14 border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                    placeholder="Select Or Search Collection Area"
                    popupMatchSelectWidth={false}
                    name="collection_executive"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={formData?.collection_executive || undefined}
                    onChange={(value) =>
                      handleAntDSelect("collection_executive", value)
                    }
                  >
                    {collectionExecutive.map((collection) => (
                      <Select.Option key={collection._id} value={collection._id}>
                        {`${collection.name} | ${collection.phone_number}`}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="w-1/4 text-white bg-violet-600 hover:bg-violet-800 border-2 border-black
              focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </Modal>
        <Modal
          isVisible={showModalUpdate}
          onClose={() => setShowModalUpdate(false)}
          className="max-w-4xl w-full"
        >
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">Update <span className="text-3xl text-custom-violet">{currentUpdateUser?.full_name || "Customer"}’s</span> Information Details</h3>

            <form className="space-y-6" onSubmit={handleUpdate} noValidate>
              <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                expandIconPosition="end"
                className="rounded-lg"
              >
               
                <Panel
                  header={<span className="font-semibold text-lg">Basic Information</span>}
                  key="1"
                  className="mb-4 rounded-lg border border-gray-200 p-4 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
                      <Select
                        className="w-full"
                        placeholder="Select Title"
                        showSearch
                        value={updateFormData?.title || undefined}
                        onChange={(value) => handleAntInputDSelect("title", value)}
                      >
                        {["Mr", "Ms", "Mrs", "M/S", "Dr"].map((cTitle) => (
                          <Select.Option key={cTitle} value={cTitle}>{cTitle}</Select.Option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="full_name"
                        value={updateFormData?.full_name}
                        onChange={handleInputChange}
                        placeholder="Enter Full Name"
                        className="w-full"
                      />
                      {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                      <Input
                        type="email"
                        name="email"
                        value={updateFormData?.email}
                        onChange={handleInputChange}
                        placeholder="Enter Email"
                        className="w-full"
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="phone_number"
                        value={updateFormData?.phone_number}
                        onChange={handleInputChange}
                        placeholder="Enter Phone Number"
                        className="w-full"
                      />
                      {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>}
                    </div>






                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Father Name</label>
                      <Input
                        name="father_name"
                        value={updateFormData?.father_name}
                        onChange={handleInputChange}
                        placeholder="Enter Father Name"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Date of Birth</label>
                      <Input
                        type="date"
                        name="dateofbirth"
                        value={updateFormData?.dateofbirth || ""}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
                      <Select
                        className="w-full"
                        placeholder="Select Gender"
                        value={updateFormData?.gender || undefined}
                        onChange={(value) => handleAntInputDSelect("gender", value)}
                      >
                        {["Male", "Female"].map((g) => (
                          <Select.Option key={g} value={g}>{g}</Select.Option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Marital Status</label>
                      <Select
                        className="w-full"
                        placeholder="Select"
                        value={updateFormData?.marital_status || undefined}
                        onChange={(value) => handleAntInputDSelect("marital_status", value)}
                      >
                        {["Married", "Unmarried", "Widow", "Divorced"].map((s) => (
                          <Select.Option key={s} value={s}>{s}</Select.Option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Referral Name</label>
                      <Input
                        name="referral_name"
                        value={updateFormData?.referral_name}
                        onChange={handleInputChange}
                        placeholder="Referral Name"
                        className="w-full"
                      />
                    </div>


                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Alternate Phone</label>
                      <Input
                        name="alternate_number"
                        value={updateFormData?.alternate_number}
                        onChange={handleInputChange}
                        placeholder="Alternate Number"
                        className="w-full"
                      />
                    </div>
                  </div>
                </Panel>

             
                <Panel
                  header={<span className="font-semibold text-lg">Address & Location</span>}
                  key="2"
                  className="mb-4 rounded-lg border border-gray-200 p-4 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="address"
                        value={updateFormData?.address}
                        onChange={handleInputChange}
                        placeholder="Enter Address"
                        className="w-full"
                      />
                      {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Village</label>
                      <Input
                        name="village"
                        value={updateFormData?.village}
                        onChange={handleInputChange}
                        placeholder="Village"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Taluk</label>
                      <Input
                        name="taluk"
                        value={updateFormData?.taluk}
                        onChange={handleInputChange}
                        placeholder="Taluk"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">District</label>
                      <Input
                        name="district"
                        value={updateFormData?.district}
                        onChange={handleInputChange}
                        placeholder="District"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">State</label>
                      <Select
                        className="w-full"
                        placeholder="Select State"
                        showSearch
                        value={updateFormData?.state || undefined}
                        onChange={(value) => handleAntInputDSelect("state", value)}
                      >
                        {["Karnataka", "Maharashtra", "Tamil Nadu"].map((s) => (
                          <Select.Option key={s} value={s}>{s}</Select.Option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="pincode"
                        value={updateFormData?.pincode}
                        onChange={handleInputChange}
                        placeholder="Enter Pincode"
                        className="w-full"
                      />
                      {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Nationality</label>
                      <Select
                        className="w-full"
                        placeholder="Select"
                        value={updateFormData?.nationality || undefined}
                        onChange={(value) => handleAntInputDSelect("nationality", value)}
                      >
                        {["Indian", "Other"].map((n) => (
                          <Select.Option key={n} value={n}>{n}</Select.Option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Collection Area</label>
                      <Select
                        className="w-full"
                        placeholder="Select Area"
                        showSearch
                        value={updateFormData?.collection_area || undefined}
                        onChange={(value) => handleAntInputDSelect("collection_area", value)}
                      >
                        {areas.map((area) => (
                          <Select.Option key={area._id} value={area._id}>
                            {area.route_name}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Collection Executive</label>
                      <Select
                        className="w-full"
                        placeholder="Select Executive"
                        showSearch
                        value={updateFormData?.collection_executive || undefined}
                        onChange={(value) => handleAntInputDSelect("collection_executive", value)}
                      >
                        {collectionExecutive.map((exec) => (
                          <Select.Option key={exec._id} value={exec._id}>
                            {`${exec.name} | ${exec.phone_number}`}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </Panel>

           
                <Panel
                  header={<span className="font-semibold text-lg">Nominee Details</span>}
                  key="3"
                  className="mb-4 rounded-lg border border-gray-200 p-4 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Nominee Name</label>
                      <Input
                        name="nominee_name"
                        value={updateFormData?.nominee_name}
                        onChange={handleInputChange}
                        placeholder="Nominee Name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Nominee DOB</label>
                      <Input
                        type="date"
                        name="nominee_dateofbirth"
                        value={updateFormData?.nominee_dateofbirth || ""}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Relationship</label>
                      <Select
                        className="w-full"
                        placeholder="Select"
                        value={updateFormData?.nominee_relationship || undefined}
                        onChange={(value) => handleAntInputDSelect("nominee_relationship", value)}
                      >
                        {["Father", "Mother", "Brother/Sister", "Spouse", "Son/Daughter", "Other"].map((r) => (
                          <Select.Option key={r} value={r}>{r}</Select.Option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Nominee Phone</label>
                      <Input
                        name="nominee_phone_number"
                        value={updateFormData?.nominee_phone_number}
                        onChange={handleInputChange}
                        placeholder="Nominee Phone"
                        className="w-full"
                      />
                    </div>
                  </div>
                </Panel>

            
                <Panel
                  header={<span className="font-semibold text-lg">Documents & Bank Information</span>}
                  key="4"
                  className="rounded-lg border border-gray-200 p-4 bg-gray-50"
                >
                  <div className="space-y-8">

                   
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Aadhar Number <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="adhaar_no"
                          value={updateFormData?.adhaar_no}
                          onChange={handleInputChange}
                          placeholder="Enter Aadhar Number"
                          className="w-full"
                        />
                        {errors.adhaar_no && (
                          <p className="mt-1 text-sm text-red-600">{errors.adhaar_no}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          PAN Number
                        </label>
                        <Input
                          name="pan_no"
                          value={updateFormData?.pan_no}
                          onChange={handleInputChange}
                          placeholder="Enter PAN Number"
                          className="w-full"
                        />
                        {errors.pan_no && (
                          <p className="mt-1 text-sm text-red-600">{errors.pan_no}</p>
                        )}
                      </div>
                    </div>

           
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Profile Picture
                        </label>
                        <input
                          type="file"
                          name="profilephoto"
                          id="profilephoto"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        />
                        {updateFormData.profilephoto && typeof updateFormData.profilephoto === "string" && (
                          <div className="mt-2">
                            <img
                              src={updateFormData.profilephoto}
                              alt="Profile Preview"
                              className="w-24 h-24 rounded-full object-cover border shadow-sm"
                            />
                          </div>
                        )}
                      </div>

                 
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Aadhaar Front
                        </label>
                        <input
                          type="file"
                          name="aadhar_frontphoto"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        />
                        {updateFormData?.aadhar_frontphoto && (
                          <Link to={updateFormData.aadhar_frontphoto} download className="block mt-2">
                            <img
                              src={updateFormData.aadhar_frontphoto}
                              alt="Aadhaar Front"
                              className="w-28 h-28 object-cover rounded border shadow-sm"
                            />
                          </Link>
                        )}
                      </div>

                    
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Aadhaar Back
                        </label>
                        <input
                          type="file"
                          name="aadhar_backphoto"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        />
                        {updateFormData?.aadhar_backphoto && (
                          <Link to={updateFormData.aadhar_backphoto} download className="block mt-2">
                            <img
                              src={updateFormData.aadhar_backphoto}
                              alt="Aadhaar Back"
                              className="w-28 h-28 object-cover rounded border shadow-sm"
                            />
                          </Link>
                        )}
                      </div>
                    </div>

 
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          PAN Front
                        </label>
                        <input
                          type="file"
                          name="pan_frontphoto"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        />
                        {updateFormData?.pan_frontphoto && (
                          <Link to={updateFormData.pan_frontphoto} download className="block mt-2">
                            <img
                              src={updateFormData.pan_frontphoto}
                              alt="PAN Front"
                              className="w-28 h-28 object-cover rounded border shadow-sm"
                            />
                          </Link>
                        )}
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          PAN Back
                        </label>
                        <input
                          type="file"
                          name="pan_backphoto"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        />
                        {updateFormData?.pan_backphoto && (
                          <Link to={updateFormData.pan_backphoto} download className="block mt-2">
                            <img
                              src={updateFormData.pan_backphoto}
                              alt="PAN Back"
                              className="w-28 h-28 object-cover rounded border shadow-sm"
                            />
                          </Link>
                        )}
                      </div>
                    </div>

                 
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Bank Name
                        </label>
                        <Input
                          name="bank_name"
                          value={updateFormData?.bank_name}
                          onChange={handleInputChange}
                          placeholder="Bank Name"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Branch Name
                        </label>
                        <Input
                          name="bank_branch_name"
                          value={updateFormData?.bank_branch_name}
                          onChange={handleInputChange}
                          placeholder="Branch Name"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Account Number
                        </label>
                        <Input
                          name="bank_account_number"
                          value={updateFormData?.bank_account_number}
                          onChange={handleInputChange}
                          placeholder="Account Number"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          IFSC Code
                        </label>
                        <Input
                          name="bank_IFSC_code"
                          value={updateFormData?.bank_IFSC_code}
                          onChange={handleInputChange}
                          placeholder="IFSC Code"
                          className="w-full"
                        />
                      </div>
                    </div>

                  </div>
                </Panel>

              </Collapse>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 focus:ring-2 focus:ring-violet-300 transition"
                >
                  Update Customer
                </button>
              </div>
            </form>
          </div>
        </Modal>

        <Modal
          isVisible={showModalDelete}
          onClose={() => {
            setShowModalDelete(false);
            setCurrentUser(null);
          }}
        >
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Delete Customer
            </h3>
            {currentUser && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteUser();
                }}
                className="space-y-6"
              >
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="groupName"
                  >
                    Please enter{" "}
                    <span className="text-primary font-bold">
                      {currentUser.full_name}
                    </span>{" "}
                    to confirm deletion.{" "}
                    <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="text"
                    id="groupName"
                    placeholder="Enter the User Full Name"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-red-700 hover:bg-red-800
          focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Delete
                </button>
              </form>
            )}
          </div>
        </Modal>
      </div>
    </>
  );
};

export default User;
