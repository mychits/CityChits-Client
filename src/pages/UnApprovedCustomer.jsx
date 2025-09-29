/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Modal from "../components/modals/Modal";
import api from "../instance/TokenInstance";
import { Input, Select, Dropdown } from "antd";
import { IoMdMore } from "react-icons/io";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";
import CircularLoader from "../components/loaders/CircularLoader";
import handleEnrollmentRequestPrint from "../components/printFormats/enrollmentRequestPrint";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";
import { fieldSize } from "../data/fieldSize";

const UnApprovedCustomer = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
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
  const [districts, setDistricts] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });
  const [errors, setErrors] = useState({});
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
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const GlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
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
        const response = await api.get("/user/approval-status/false");
        setUsers(response.data);
        
        // Format users data
        const formattedData = response.data.map((user) => ({
          ...user,
          id: user._id,
          name: user.full_name,
          phone_number: user.phone_number,
          createdAt: user.createdAt?.split("T")[0],
          address: user.address,
          pincode: user.pincode,
          customer_id: user.customer_id,
          collection_area: user.collection_area?.route_name,
          approval_status: user.approval_status === "true" ? "Approved" : "Pending",
        }));
        
        // Filter users based on search term
        const filtered = formattedData.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone_number.toString().includes(searchTerm)
        );
        
        setFilteredUsers(filtered);
        setCurrentPage(1); // Reset to first page when search changes
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [reloadTrigger, searchTerm]);

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
        full_name: response.data?.full_name,
        email: response.data?.email,
        phone_number: response.data?.phone_number,
        password: response.data?.password,
        pincode: response.data?.pincode,
        adhaar_no: response.data?.adhaar_no,
        pan_no: response.data?.pan_no,
        address: response.data?.address,
        selected_plan: response.data?.selected_plan?._id || "",
        title: response.data?.title,
        father_name: response.data?.father_name,
        gender: response.data?.gender,
        marital_status: response.data?.marital_status,
        dateofbirth: response.data?.dateofbirth?.split("T")[0],
        nationality: response.data?.nationality,
        village: response.data?.village,
        taluk: response.data?.taluk,
        district: response.data?.district,
        state: response.data?.state,
        collection_area: response.data?.collection_area?._id || "",
        alternate_number: response.data?.alternate_number,
        referral_name: response.data?.referral_name,
        nominee_name: response.data?.nominee_name,
        nominee_dateofbirth: response.data?.nominee_dateofbirth?.split("T")[0],
        nominee_relationship: response.data?.nominee_relationship,
        nominee_phone_number: response.data?.nominee_phone_number,
        bank_name: response.data?.bank_name,
        bank_branch_name: response.data?.bank_branch_name,
        bank_account_number: response.data?.bank_account_number,
        bank_IFSC_code: response.data?.bank_IFSC_code,
        aadhar_frontphoto: response.data?.aadhar_frontphoto,
        aadhar_backphoto: response.data?.aadhar_backphoto,
        pan_frontphoto: response.data?.pan_frontphoto,
        pan_backphoto: response.data?.pan_backphoto,
        profilephoto: response.data?.profilephoto,
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-red-200 border-red-600 border-2 ';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  const SimplePagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    const maxPagesToShow = 5;
    
 
    pages.push(1);
    
  
    if (totalPages > maxPagesToShow) {
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Add pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    } else {
      // Show all pages if total pages is small
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    }
    
    return (
      <div className="flex items-center justify-center space-x-2 mt-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${
              page === currentPage
                ? 'bg-purple-600 text-white'
                : typeof page === 'number'
                ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                : 'bg-white text-gray-500 border border-gray-300 cursor-default'
            }`}
            disabled={typeof page !== 'number'}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  const renderCustomerCard = (customer) => (
    <div key={customer.id} className="bg-red-50 border border-red-300 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-xl">{customer.name}</h3>
        <Dropdown 
          trigger={['click']} 
          menu={{
            items: [
              {
                key: "1",
                label: (
                  <div
                    className="text-green-600 cursor-pointer"
                    onClick={() => handleUpdateModalOpen(customer._id)}
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
                    onClick={() => handleDeleteModalOpen(customer._id)}
                  >
                    Delete
                  </div>
                ),
              },
              {
                key: "3",
                label: (
                  <div
                    onClick={() => handleEnrollmentRequestPrint(customer._id)}
                    className="text-violet-600 cursor-pointer"
                  >
                    Print
                  </div>
                ),
              },
              {
                key: "4",
                label: (
                  <div
                    className={`cursor-pointer ${customer.approval_status !== "Approved"
                      ? "text-green-600"
                      : "text-red-600"
                    }`}
                    onClick={() =>
                      handleCustomerStatus(
                        customer._id,
                        customer.approval_status !== "Approved"
                          ? "Approved"
                          : "Pending"
                      )
                    }
                  >
                    {customer.approval_status !== "Approved"
                      ? "Approve Customer"
                      : "Un Approve Customer"}
                  </div>
                ),
              },
            ],
          }}
          placement="bottomRight"
        >
          <IoMdMore className="text-purple-700" />
        </Dropdown>
      </div>
      
      <div className="mt-7 grid grid-cols-3 gap-4">
        <div>
          <p className="text-md text-gray-500">Phone</p>
          <p className="font-medium">{customer.phone_number}</p>
        </div>
        <div>
          <p className="text-md text-gray-500">ID</p>
          <p className="font-medium">{customer.customer_id}</p>
        </div>
        <div>
          <p className="text-md text-gray-500">Status</p>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.approval_status)}`}>
            {customer.approval_status}
          </span>
        </div>
      </div>
      
      <div className="mt-7 flex items-center text-lg   text-gray-600">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <span>Joined: {customer.createdAt}</span>
      </div>
      
      {customer.address && (
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.707 12.707l-3.95 3.95a2 2 0 11-2.828-2.828l3.95-3.95-3.95-3.95a2 2 0 012.828-2.828l3.95 3.95 3.95-3.95a2 2 0 112.828 2.828l-3.95 3.95 3.95 3.95a2 2 0 01-2.828 2.828z"></path>
          </svg>
          <span>{customer.address}</span>
        </div>
      )}
      
      {customer.collection_area && (
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"></path>
          </svg>
          <span>Area: {customer.collection_area}</span>
        </div>
      )}
      
      {/* <div className="mt-4 text-center">
        <button 
          onClick={() => handleUpdateModalOpen(customer._id)}
          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
        >
          Show More
        </button>
      </div> */}
    </div>
  );

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
          <div className="flex-grow mt-9 p-7">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800"> Unverified Customers</h1>
             
            </div>
            
            {isLoading ? (
              <CircularLoader isLoading={isLoading} failure={false} data="Customer Data" />
            ) : (
              <>
                <div className="mb-4 text-md text-gray-600">
                  Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} customers
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentItems.map(renderCustomerCard)}
                </div>
                
                {filteredUsers.length > itemsPerPage && (
                  <div className="mt-8">
                    <SimplePagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <Modal
          isVisible={showModalUpdate}
          onClose={() => setShowModalUpdate(false)}
        >
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-custom-violet">
              Update Customer
            </h3>
            <form className="space-y-6" onSubmit={handleUpdate} noValidate>
              <div className="flex flex-row justify-between gap-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <Select
                    className="bg-gray-50 border h-14 border-gray-300 text-gray-900 text-md rounded-lg w-full"
                    placeholder="Select Title"
                    popupMatchSelectWidth={false}
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
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Full Name <span className="text-red-500 text-md mt-1">*</span>
                  </label>
                  <Input
                    type="text"
                    name="full_name"
                    value={updateFormData?.full_name}
                    onChange={handleInputChange}
                    id="name"
                    placeholder="Enter the Full Name"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                  {errors.full_name && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.full_name}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={updateFormData?.email}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Email"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-md text-red-600">{errors.email}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Phone Number <span className="text-red-500 text-md mt-1">*</span>
                  </label>
                  <Input
                    type="number"
                    name="phone_number"
                    value={updateFormData?.phone_number}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Phone Number"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                  {errors.phone_number && (
                    <p className="mt-2 text-md text-red-600">
                      {errors.phone_number}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Aadhar Number <span className="text-red-500 text-md mt-1">*</span>
                  </label>
                  <Input
                    type="text"
                    name="adhaar_no"
                    value={updateFormData?.adhaar_no}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Adhaar Number"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                  {errors.adhaar_no && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.adhaar_no}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Pan Number
                  </label>
                  <Input
                    type="text"
                    name="pan_no"
                    value={updateFormData?.pan_no}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Pan Number"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                  {errors.pan_no && (
                    <p className="mt-2 text-sm text-red-600">{errors.pan_no}</p>
                  )}
                </div>
              </div>
              <div>
                <label
                  className="block mb-2 text-md font-medium text-gray-900"
                  htmlFor="address"
                >
                  Address <span className="text-red-500 text-md mt-1">*</span>
                </label>
                <Input
                  type="text"
                  name="address"
                  value={updateFormData?.address}
                  onChange={handleInputChange}
                  id="address"
                  placeholder="Enter the Address"
                  required
                  className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                />
                {errors.address && (
                  <p className="mt-2 text-md text-red-600">{errors.address}</p>
                )}
              </div>
              <div className="flex flex-row justify-between gap-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Pincode <span className="text-red-500 text-md mt-1">*</span>
                  </label>
                  <Input
                    type="text"
                    name="pincode"
                    value={updateFormData?.pincode}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Pincode"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                  {errors.pincode && (
                    <p className="mt-2 text-md text-red-600">
                      {errors.pincode}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Father Name
                  </label>
                  <Input
                    type="text"
                    name="father_name"
                    value={updateFormData?.father_name}
                    onChange={handleInputChange}
                    id="father-name"
                    placeholder="Enter the Father name"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4">
                <div className="w-full">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="area"
                  >
                    Collection Area
                  </label>
                  <Select
                    className="bg-gray-50 border h-14 border-gray-300 text-gray-900 text-md rounded-lg w-full"
                    placeholder="Select Or Search Collection Area"
                    popupMatchSelectWidth={false}
                    showSearch
                    name="collection_area"
                    filterOption={(input, option) =>
                      option.children
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={updateFormData?.collection_area || undefined}
                    onChange={(value) =>
                      handleAntInputDSelect("collection_area", value)
                    }
                  >
                    <Select.Option value="">
                      Select or Search Collection Area
                    </Select.Option>
                    {areas.map((area) => (
                      <Select.Option key={area._id} value={area._id}>
                        {area.route_name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Customer Date of Birth
                  </label>
                  <Input
                    type="date"
                    name="dateofbirth"
                    value={
                      updateFormData?.dateofbirth
                        ? new Date(updateFormData?.dateofbirth || "")
                          .toISOString()
                          .split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                    id="date"
                    placeholder="Enter the Date of Birth"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="gender"
                  >
                    Gender
                  </label>
                  <Select
                    className="bg-gray-50 border h-14 border-gray-300 text-gray-900 text-md rounded-lg w-full"
                    placeholder="Select Gender"
                    popupMatchSelectWidth={false}
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
              <div className="flex flex-row justify-between gap-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="marital-status"
                  >
                    Marital Status
                  </label>
                  <Select
                    className="bg-gray-50 border h-14 border-gray-300 text-gray-900 text-md rounded-lg w-full"
                    placeholder="Select Marital Status"
                    popupMatchSelectWidth={false}
                    showSearch
                    name="marital_status"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={updateFormData?.marital_status || undefined}
                    onChange={(value) =>
                      handleAntInputDSelect("marital_status", value)
                    }
                  >
                    {["Married", "Unmarried", "Widow", "Divorced"].map(
                      (mStatus) => (
                        <Select.Option key={mStatus} value={mStatus}>
                          {mStatus}
                        </Select.Option>
                      )
                    )}
                  </Select>
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="referral-name"
                  >
                    Referral Name
                  </label>
                  <Input
                    type="text"
                    name="referral_name"
                    value={updateFormData?.referral_name}
                    onChange={handleInputChange}
                    id="referral-name"
                    placeholder="Enter the Referral Name"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="nationality"
                  >
                    Nationality
                  </label>
                  <Select
                    className="bg-gray-50 border h-14 border-gray-300 text-gray-900 text-md rounded-lg w-full"
                    placeholder="Select Nationality"
                    popupMatchSelectWidth={false}
                    showSearch
                    name="nationality"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={updateFormData?.nationality || undefined}
                    onChange={(value) =>
                      handleAntInputDSelect("nationality", value)
                    }
                  >
                    {["Indian", "Other"].map((nation) => (
                      <Select.Option key={nation} value={nation}>
                        {nation}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="alternate-number"
                  >
                    Alternate Phone Number
                  </label>
                  <Input
                    type="number"
                    name="alternate_number"
                    value={updateFormData?.alternate_number}
                    onChange={handleInputChange}
                    id="alternate-number"
                    placeholder="Enter the Alternate Phone number"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="village"
                  >
                    Village
                  </label>
                  <Input
                    type="text"
                    name="village"
                    value={updateFormData?.village}
                    onChange={handleInputChange}
                    id="village"
                    placeholder="Enter the Village"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="taluk"
                  >
                    Taluk
                  </label>
                  <Input
                    type="text"
                    name="taluk"
                    value={updateFormData?.taluk}
                    onChange={handleInputChange}
                    id="taluk"
                    placeholder="Enter the taluk"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="state"
                  >
                    State
                  </label>
                  <Select
                    className="bg-gray-50 border h-14 border-gray-300 text-gray-900 text-md rounded-lg w-full"
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
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="district"
                  >
                    District
                  </label>
                  <Input
                    type="text"
                    name="district"
                    value={updateFormData?.district}
                    onChange={handleInputChange}
                    placeholder="Enter District"
                    className="w-full p-2 h-14 border rounded-md sm:text-lg text-md bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="nominee"
                  >
                    Nominee Name
                  </label>
                  <Input
                    type="text"
                    name="nominee_name"
                    value={updateFormData?.nominee_name}
                    onChange={handleInputChange}
                    id="nominee"
                    placeholder="Enter the Nominee Name"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="nominee-date"
                  >
                    Nominee Date of Birth
                  </label>
                  <Input
                    type="date"
                    name="nominee_dateofbirth"
                    value={
                      updateFormData?.nominee_dateofbirth
                        ? new Date(updateFormData?.nominee_dateofbirth)
                          .toISOString()
                          .split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                    id="nominee-date"
                    placeholder="Enter the Nominee Date of Birth"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="nominee-relationship"
                  >
                    Nominee Relationship
                  </label>
                  <Select
                    className="bg-gray-50 border h-14 border-gray-300 text-gray-900 text-md rounded-lg w-full"
                    placeholder="Select Nominee Relationship"
                    popupMatchSelectWidth={false}
                    showSearch
                    name="nominee_relationship"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={updateFormData?.nominee_relationship || undefined}
                    onChange={(value) =>
                      handleAntInputDSelect("nominee_relationship", value)
                    }
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
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="nominee-phone-number"
                  >
                    Nominee Phone Number
                  </label>
                  <Input
                    type="number"
                    name="nominee_phone_number"
                    value={updateFormData?.nominee_phone_number}
                    onChange={handleInputChange}
                    id="nominee-phone-number"
                    placeholder="Enter the Nominee Phone number"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="bank-name"
                  >
                    Bank Name
                  </label>
                  <Input
                    type="text"
                    name="bank_name"
                    value={updateFormData?.bank_name}
                    onChange={handleInputChange}
                    id="bank-name"
                    placeholder="Enter the Customer Bank Name"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="bank-branch-name"
                  >
                    Bank Branch Name
                  </label>
                  <Input
                    type="text"
                    name="bank_branch_name"
                    value={updateFormData?.bank_branch_name}
                    onChange={handleInputChange}
                    id="bank-branch-name"
                    placeholder="Enter the Bank Branch Name"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="account-number"
                  >
                    Bank Account Number
                  </label>
                  <Input
                    type="text"
                    name="bank_account_number"
                    value={updateFormData?.bank_account_number}
                    onChange={handleInputChange}
                    id="account-number"
                    placeholder="Enter the Customer Bank Account Number"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="ifsc"
                  >
                    Bank IFSC Code
                  </label>
                  <Input
                    type="text"
                    name="bank_IFSC_code"
                    value={updateFormData?.bank_IFSC_code}
                    onChange={handleInputChange}
                    id="ifsc"
                    placeholder="Enter the Bank IFSC Code"
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-md rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5`}
                  />
                </div>
              </div>
              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="w-1/4 text-white bg-violet-700 hover:bg-violet-800 border-2 border-black
              focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-md px-5 py-2.5 text-center"
                >
                  Update
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
            <h3 className="mb-4 text-2xl font-bold ">
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
                    className="block mb-2 text-md font-medium text-gray-900"
                    htmlFor="groupName"
                  >
                    Please enter{" "}
                    <span className="text-violet-800 font-bold">
                      {currentUser.full_name}
                    </span>{" "}
                    to confirm deletion.{" "}
                    <span className="text-red-500 text-lg mt-1">*</span>
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
                  className="w-full text-white bg-red-300 hover:bg-red-500
          focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center"
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

export default UnApprovedCustomer;