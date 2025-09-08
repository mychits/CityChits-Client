/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Modal from "../components/modals/Modal";
import api from "../instance/TokenInstance";
import { Input, Select, Dropdown, Pagination } from "antd";
import { IoMdMore } from "react-icons/io";
import filterOption from "../helpers/filterOption";
import CircularLoader from "../components/loaders/CircularLoader";
import handleEnrollmentRequestPrint from "../components/printFormats/enrollmentRequestPrint";
import CustomAlert from "../components/alerts/CustomAlert"; 
import { fieldSize } from "../data/fieldSize";
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });
  const [errors, setErrors] = useState({});
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9); // Show 9 cards per page (3x3 grid)

  const GlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when searching
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
        
        // Transform data for card display
        const formattedData = response.data.map((user, index) => ({
          _id: user._id,
          id: index + 1,
          name: user.full_name,
          phone_number: user.phone_number,
          email: user.email,
          createdAt: user.createdAt?.split("T")[0],
          address: user.address,
          pincode: user.pincode,
          customer_id: user.customer_id,
          collection_area: user.collection_area?.route_name || "N/A",
          approval_status: user.approval_status === "true" ? "Approved" : "Pending",
          statusColor: user.approval_status === "true" ? "bg-green-300 " : "bg-yellow-300 ",
          isApproved: user.approval_status === "true",
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
      newErrors.phone_number = "Invalid phone number";
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

  // Card Component with Expandable Details
  const UserCard = ({ user }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className="bg-green-50 border border-green-300 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        {/* Card Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-800 truncate">{user.name}</h3>
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "1",
                    label: (
                      <div
                        className="text-green-600 cursor-pointer"
                        onClick={() => handleUpdateModalOpen(user._id)}
                      >
                        Edit
                      </div>
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <div
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDeleteModalOpen(user._id)}
                      >
                        Delete
                      </div>
                    ),
                  },
                  {
                    key: "3",
                    label: (
                      <div
                        onClick={() => handleEnrollmentRequestPrint(user._id)}
                        className="text-blue-600 cursor-pointer"
                      >
                        Print
                      </div>
                    ),
                  },
                  {
                    key: "4",
                    label: (
                      <div
                        className={`cursor-pointer ${
                          user.isApproved ? "text-red-600" : "text-green-600"
                        }`}
                        onClick={() =>
                          handleCustomerStatus(
                            user._id,
                            user.isApproved ? "false" : "true"
                          )
                        }
                      >
                        {user.isApproved ? "Unapprove Customer" : "Approve Customer"}
                      </div>
                    ),
                  },
                ],
              }}
              placement="bottomLeft"
            >
              <IoMdMore className="text-gray-500 hover:text-gray-700 cursor-pointer" />
            </Dropdown>
          </div>
          
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">{user.phone_number}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">ID</p>
              <p className="font-medium text-gray-800">{user.customer_id}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Status</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.statusColor}`}>
                {user.approval_status}
              </span>
            </div>
          </div>
        </div>
        
        {/* Card Body - Basic Info */}
        <div className="p-4 space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <FaMapMarkerAlt className="mr-2 text-gray-500" />
            <span className="truncate">{user.address}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            <span>Joined: {user.createdAt}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaUser className="mr-2 text-gray-500" />
            <span>Area: {user.collection_area}</span>
          </div>
        </div>
        
        {/* Expandable Section for More Details */}
        <div className="px-4 pb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-sm text-purple-600 hover:text-purple-800 font-medium flex justify-center items-center py-2"
          >
            {isExpanded ? (
              <>
                <span>Show Less</span>
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                <span>Show More</span>
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
          
          {isExpanded && (
            <div className="mt-4 space-y-3 border-t pt-4 text-sm">
              <div className="flex items-center text-gray-600">
                <FaEnvelope className="mr-2 text-gray-500" />
                <span>{user.email || "N/A"}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2 text-gray-500" />
                <span>Pincode: {user.pincode}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => handleUpdateModalOpen(user._id)}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-xs"
                >
                  Edit Details
                </button>
                <button 
                  onClick={() => handleEnrollmentRequestPrint(user._id)}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-xs"
                >
                  Print Form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Get current page data
  const filteredData = filterOption(TableUsers, searchText);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div>
        <CustomAlert
          type={alertConfig.type}
          isVisible={alertConfig.visibility}
          message={alertConfig.message}
        />
        <div className="flex mt-20">
          <Sidebar navSearchBarVisibility={true} onGlobalSearchChangeHandler={GlobalSearchChangeHandler} />
          <div className="flex-grow p-7 w-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
              <button
                onClick={() => {
                  setShowModal(true);
                  setErrors({});
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Add Customer</span>
              </button>
            </div>

            {/* Search Bar */}
            {/* <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchText}
                  onChange={GlobalSearchChangeHandler}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div> */}

            {/* Results Info */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} customers
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <CircularLoader />
                </div>
              ) : currentItems.length > 0 ? (
                currentItems.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  total={filteredData.length}
                  pageSize={itemsPerPage}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper={true}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  className="custom-pagination"
                />
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Add Customer</h3>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="full_name">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="full_name"
                  value={formData?.full_name}
                  onChange={handleChange}
                  id="name"
                  placeholder="Enter the Full Name"
                  required
                  className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                />
                {errors.full_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.full_name}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="email">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    id="email"
                    placeholder="Enter Email"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="phone_number">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    id="phone_number"
                    placeholder="Enter Phone Number"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.phone_number && (
                    <p className="mt-2 text-sm text-red-600">{errors.phone_number}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    id="password"
                    placeholder="Enter Password"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="pincode">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    id="pincode"
                    placeholder="Enter Pincode"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.pincode && (
                    <p className="mt-2 text-sm text-red-600">{errors.pincode}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="adhaar_no">
                    Adhaar Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    name="adhaar_no"
                    value={formData.adhaar_no}
                    onChange={handleChange}
                    id="adhaar_no"
                    placeholder="Enter Adhaar Number"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.adhaar_no && (
                    <p className="mt-2 text-sm text-red-600">{errors.adhaar_no}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="pan_no">
                    Pan Number
                  </label>
                  <Input
                    type="text"
                    name="pan_no"
                    value={formData?.pan_no}
                    onChange={handleChange}
                    id="pan_no"
                    placeholder="Enter Pan Number"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.pan_no && (
                    <p className="mt-2 text-sm text-red-600">{errors.pan_no}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="address">
                  Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  id="address"
                  placeholder="Enter the Address"
                  required
                  className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="collection_area">
                    Collection Area
                  </label>
                  <Select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                    placeholder="Select Collection Area"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={formData?.collection_area || undefined}
                    onChange={(value) => handleAntDSelect("collection_area", value)}
                  >
                    {areas.map((area) => (
                      <Select.Option key={area._id} value={area._id}>
                        {area.route_name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="collection_executive">
                    Collection Executive
                  </label>
                  <Select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                    placeholder="Select Collection Executive"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={formData?.collection_executive || undefined}
                    onChange={(value) => handleAntDSelect("collection_executive", value)}
                  >
                    {collectionExecutive.map((collection) => (
                      <Select.Option key={collection._id} value={collection._id}>
                        {`${collection.name} | ${collection.phone_number}`}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-1/4 text-white bg-purple-600 hover:bg-purple-700 border-2 border-black focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-200"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </Modal>

        <Modal isVisible={showModalUpdate} onClose={() => setShowModalUpdate(false)}>
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Update Customer</h3>
            <form className="space-y-6" onSubmit={handleUpdate} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="title">
                    Title
                  </label>
                  <Select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                    placeholder="Select Title"
                    showSearch
                    name="title"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={updateFormData?.title || undefined}
                    onChange={(value) => handleAntInputDSelect("title", value)}
                  >
                    <Select.Option value="">Select Title</Select.Option>
                    {["Mr", "Ms", "Mrs", "M/S", "Dr"].map((cTitle) => (
                      <Select.Option key={cTitle} value={cTitle}>
                        {cTitle}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="full_name">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="full_name"
                    value={updateFormData?.full_name}
                    onChange={handleInputChange}
                    id="full_name"
                    placeholder="Enter the Full Name"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.full_name && (
                    <p className="mt-2 text-sm text-red-600">{errors.full_name}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="email">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={updateFormData?.email}
                    onChange={handleInputChange}
                    id="email"
                    placeholder="Enter Email"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="phone_number">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    name="phone_number"
                    value={updateFormData?.phone_number}
                    onChange={handleInputChange}
                    id="phone_number"
                    placeholder="Enter Phone Number"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.phone_number && (
                    <p className="mt-2 text-sm text-red-600">{errors.phone_number}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="adhaar_no">
                    Aadhar Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="adhaar_no"
                    value={updateFormData?.adhaar_no}
                    onChange={handleInputChange}
                    id="adhaar_no"
                    placeholder="Enter Aadhar Number"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.adhaar_no && (
                    <p className="mt-2 text-sm text-red-600">{errors.adhaar_no}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="pan_no">
                    Pan Number
                  </label>
                  <Input
                    type="text"
                    name="pan_no"
                    value={updateFormData?.pan_no}
                    onChange={handleInputChange}
                    id="pan_no"
                    placeholder="Enter Pan Number"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.pan_no && (
                    <p className="mt-2 text-sm text-red-600">{errors.pan_no}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="address">
                  Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="address"
                  value={updateFormData?.address}
                  onChange={handleInputChange}
                  id="address"
                  placeholder="Enter the Address"
                  required
                  className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="pincode">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="pincode"
                    value={updateFormData?.pincode}
                    onChange={handleInputChange}
                    id="pincode"
                    placeholder="Enter Pincode"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.pincode && (
                    <p className="mt-2 text-sm text-red-600">{errors.pincode}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="father_name">
                    Father Name
                  </label>
                  <Input
                    type="text"
                    name="father_name"
                    value={updateFormData?.father_name}
                    onChange={handleInputChange}
                    id="father_name"
                    placeholder="Enter the Father name"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="collection_area">
                    Collection Area
                  </label>
                  <Select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                    placeholder="Select Collection Area"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={updateFormData?.collection_area || undefined}
                    onChange={(value) => handleAntInputDSelect("collection_area", value)}
                  >
                    <Select.Option value="">Select or Search Collection Area</Select.Option>
                    {areas.map((area) => (
                      <Select.Option key={area._id} value={area._id}>
                        {area.route_name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="collection_executive">
                    Collection Executive
                  </label>
                  <Select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                    placeholder="Select Collection Executive"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={updateFormData?.collection_executive || undefined}
                    onChange={(value) => handleAntInputDSelect("collection_executive", value)}
                  >
                    {collectionExecutive.map((collection) => (
                      <Select.Option key={collection._id} value={collection._id}>
                        {`${collection.name} | ${collection.phone_number}`}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="dateofbirth">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    name="dateofbirth"
                    value={
                      updateFormData?.dateofbirth
                        ? new Date(updateFormData?.dateofbirth || "").toISOString().split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                    id="dateofbirth"
                    placeholder="Enter the Date of Birth"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="gender">
                    Gender
                  </label>
                  <Select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                    placeholder="Select Gender"
                    showSearch
                    name="gender"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={updateFormData?.gender || undefined}
                    onChange={(value) => handleAntInputDSelect("gender", value)}
                  >
                    {["Male", "Female"].map((gType) => (
                      <Select.Option key={gType} value={gType}>
                        {gType}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="marital_status">
                    Marital Status
                  </label>
                  <Select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                    placeholder="Select Marital Status"
                    showSearch
                    name="marital_status"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={updateFormData?.marital_status || undefined}
                    onChange={(value) => handleAntInputDSelect("marital_status", value)}
                  >
                    {["Married", "Unmarried", "Widow", "Divorced"].map((mStatus) => (
                      <Select.Option key={mStatus} value={mStatus}>
                        {mStatus}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="referral_name">
                    Referral Name
                  </label>
                  <Input
                    type="text"
                    name="referral_name"
                    value={updateFormData?.referral_name}
                    onChange={handleInputChange}
                    id="referral_name"
                    placeholder="Enter the Referral Name"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="nationality">
                    Nationality
                  </label>
                  <Select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                    placeholder="Select Nationality"
                    showSearch
                    name="nationality"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={updateFormData?.nationality || undefined}
                    onChange={(value) => handleAntInputDSelect("nationality", value)}
                  >
                    {["Indian", "Other"].map((nation) => (
                      <Select.Option key={nation} value={nation}>
                        {nation}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="alternate_number">
                    Alternate Phone Number
                  </label>
                  <Input
                    type="number"
                    name="alternate_number"
                    value={updateFormData?.alternate_number}
                    onChange={handleInputChange}
                    id="alternate_number"
                    placeholder="Enter the Alternate Phone number"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="village">
                    Village
                  </label>
                  <Input
                    type="text"
                    name="village"
                    value={updateFormData?.village}
                    onChange={handleInputChange}
                    id="village"
                    placeholder="Enter the Village"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="taluk">
                    Taluk
                  </label>
                  <Input
                    type="text"
                    name="taluk"
                    value={updateFormData?.taluk}
                    onChange={handleInputChange}
                    id="taluk"
                    placeholder="Enter the taluk"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="state">
                    State
                  </label>
                  <Select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                    placeholder="Select State"
                    showSearch
                    name="state"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={updateFormData?.state || undefined}
                    onChange={(value) => handleAntInputDSelect("state", value)}
                  >
                    {["Karnataka", "Maharashtra", "Tamil Nadu"].map((state) => (
                      <Select.Option key={state} value={state}>
                        {state}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="district">
                    District
                  </label>
                  <Input
                    type="text"
                    name="district"
                    value={updateFormData?.district}
                    onChange={handleInputChange}
                    placeholder="Enter District"
                    className="w-full p-2 h-14 border rounded-md sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="nominee_name">
                    Nominee Name
                  </label>
                  <Input
                    type="text"
                    name="nominee_name"
                    value={updateFormData?.nominee_name}
                    onChange={handleInputChange}
                    id="nominee_name"
                    placeholder="Enter the Nominee Name"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="nominee_dateofbirth">
                    Nominee Date of Birth
                  </label>
                  <Input
                    type="date"
                    name="nominee_dateofbirth"
                    value={
                      updateFormData?.nominee_dateofbirth
                        ? new Date(updateFormData?.nominee_dateofbirth).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                    id="nominee_dateofbirth"
                    placeholder="Enter the Nominee Date of Birth"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="nominee_relationship">
                    Nominee Relationship
                  </label>
                  <Select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full"
                    placeholder="Select Nominee Relationship"
                    showSearch
                    name="nominee_relationship"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={updateFormData?.nominee_relationship || undefined}
                    onChange={(value) => handleAntInputDSelect("nominee_relationship", value)}
                  >
                    {[
                      "Father",
                      "Mother",
                      "Brother/Sister",
                      "Spouse",
                      "Son/Daughter",
                      "Other",
                    ].map((nominee) => (
                      <Select.Option key={nominee} value={nominee}>
                        {nominee}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="nominee_phone_number">
                    Nominee Phone Number
                  </label>
                  <Input
                    type="number"
                    name="nominee_phone_number"
                    value={updateFormData?.nominee_phone_number}
                    onChange={handleInputChange}
                    id="nominee_phone_number"
                    placeholder="Enter the Nominee Phone number"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="bank_name">
                    Bank Name
                  </label>
                  <Input
                    type="text"
                    name="bank_name"
                    value={updateFormData?.bank_name}
                    onChange={handleInputChange}
                    id="bank_name"
                    placeholder="Enter the Customer Bank Name"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="bank_branch_name">
                    Bank Branch Name
                  </label>
                  <Input
                    type="text"
                    name="bank_branch_name"
                    value={updateFormData?.bank_branch_name}
                    onChange={handleInputChange}
                    id="bank_branch_name"
                    placeholder="Enter the Bank Branch Name"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="bank_account_number">
                    Bank Account Number
                  </label>
                  <Input
                    type="text"
                    name="bank_account_number"
                    value={updateFormData?.bank_account_number}
                    onChange={handleInputChange}
                    id="bank_account_number"
                    placeholder="Enter the Customer Bank Account Number"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="bank_IFSC_code">
                    Bank IFSC Code
                  </label>
                  <Input
                    type="text"
                    name="bank_IFSC_code"
                    value={updateFormData?.bank_IFSC_code}
                    onChange={handleInputChange}
                    id="bank_IFSC_code"
                    placeholder="Enter the Bank IFSC Code"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-1/4 text-white bg-purple-600 hover:bg-purple-700 border-2 border-black focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-200"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </Modal>

        <Modal isVisible={showModalDelete} onClose={() => {
          setShowModalDelete(false);
          setCurrentUser(null);
        }}>
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Delete Customer</h3>
            {currentUser && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteUser();
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="groupName">
                    Please enter{" "}
                    <span className="text-primary font-bold">{currentUser.full_name}</span>{" "}
                    to confirm deletion.{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="groupName"
                    placeholder="Enter the User Full Name"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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