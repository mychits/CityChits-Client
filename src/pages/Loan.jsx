/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Modal from "../components/modals/Modal";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CustomAlert from "../components/alerts/CustomAlert";
import { Dropdown } from "antd";
import { IoMdMore } from "react-icons/io";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";

const Loan = () => {
  const [users, setUsers] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [tableBorrowers, setTableBorrowers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [currentBorrower, setCurrentBorrower] = useState(null);

  const [currentUpdateBorrower, setCurrentUpdateBorrower] = useState(null);
  const [searchText, setSearchText] = useState("");

  const onGlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });

  const [formData, setFormData] = useState({
    borrower: "",
    loan_amount: "",
    tenure: "",
    security_deposit: "",
    total_release_amount: "",
    interest_percentage: "",
    monthly_emi: "",
    interest_payable: "",
    total_payment: "",
    start_date: "",
    due_date: "",
    note: "",
  });
  const [errors, setErrors] = useState({});

  const [updateFormData, setUpdateFormData] = useState({
    borrower: "",
    loan_amount: "",
    tenure: "",
    security_deposit: "",
    total_release_amount: "",
    interest_percentage: "",
    monthly_emi: "",
    interest_payable: "",
    total_payment: "",
    start_date: "",
    due_date: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      const loanAmount = parseFloat(newData.loan_amount);
      const securityDeposit = parseFloat(newData.security_deposit);
      if (!isNaN(loanAmount) && !isNaN(securityDeposit)) {
        newData.total_release_amount = String(loanAmount - securityDeposit);
      } else {
        newData.total_release_amount = "";
      }

      const principal = parseFloat(newData.loan_amount) || 0;
      const rate = parseFloat(newData.interest_percentage) || 0;
      const tenure = parseFloat(newData.tenure) || 1;

      if (principal > 0 && rate > 0 && tenure > 0) {
        const monthlyRate = rate / 1200;
        const emi =
          (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -tenure));
        if (!isNaN(emi)) {
          newData.monthly_emi = emi.toFixed(0);
          newData.total_payment = (emi * tenure).toFixed(0);
          newData.interest_payable = (
            parseFloat(newData.total_payment) - parseFloat(newData.loan_amount)
          ).toFixed(0);
        }
      } else {
        newData.monthly_emi = "";
        newData.total_payment = "";
        newData.interest_payable = "";
      }

      return newData;
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (type) => {
    const newErrors = {};

    const data = type === "addBorrower" ? formData : updateFormData;

    if (!data.borrower) {
      newErrors.borrower = "Borrower Name is required";
    }

    if (!data.loan_amount || isNaN(data.loan_amount) || data.loan_amount <= 0) {
      newErrors.group_value = "Loan Amount must be a positive number";
    }
    if (!data.tenure || isNaN(data.tenure) || data.tenure <= 0) {
      newErrors.tenure = "Tenure must be a positive number";
    }
    if (!data.security_deposit) {
      newErrors.security_deposit = "Security deposit is required";
    }
    if (data.interest_percentage) {
      if (
        isNaN(data.interest_percentage) ||
        data.interest_percentage < 0 ||
        data.interest_percentage > 100
      ) {
        newErrors.interest_percentage =
          "Interest percentage should be between 0 and 100";
      }
    }

    if (!data.start_date) {
      newErrors.start_date = "Start Date is required";
    }
    if (!data.due_date) {
      newErrors.start_date = "Due Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm("addBorrower");
    try {
      console.log(isValid);
      if (isValid) {
        const response = await api.post("/loans/add-borrower", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status >= 400) throw new Error("failed to add Borrower");
        setAlertConfig({
          visibility: true,
          message: "Borrower Added Successfully",
          type: "success",
        });

        setShowModal(false);
        setFormData({
          borrower: "",
          loan_amount: "",
          tenure: "",
          security_deposit: "",
          total_release_amount: "",
          interest_percentage: "",
          monthly_emi: "",
          interest_payable: "",
          total_payment: "",
          start_date: "",
          due_date: "",
          note: "",
        });
      } else {
        console.log(errors);
      }
    } catch (error) {
      console.error("Error adding Borrower:", error);
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/user/get-user");
        if (response.status >= 400)
          throw new Error("Failed to fetch borrowers");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching Loans Borrower Data:", error);
      }
    };
    fetchCustomers();
  }, []);
  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        const response = await api.get("/loans/get-all-borrowers");
        setBorrowers(response.data);
        const formattedData = response.data.map((borrower, index) => ({
          _id: borrower._id,
          id: index + 1,
          borrower_name: borrower.borrower.full_name,
          date: borrower.createdAt,
          loan_amount: borrower.loan_amount,
          tenure: borrower.tenure,
          security_deposit: borrower.security_deposit,
          total_release_amount: borrower.total_release_amount,
          interest_percentage: borrower.interest_percentage,
          monthly_emi: borrower.monthly_emi,
          interest_payable: borrower.interest_payable,
          total_payment: borrower.total_payment,
          start_date: borrower.start_date.split("T")[0],
          due_date: borrower.due_date.split("T")[0],
          note: borrower.note,
          action: (
            <div className="flex justify-center gap-2" key={borrower._id}>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: (
                        <div
                          className="text-green-600"
                          onClick={() => handleUpdateModalOpen(borrower._id)}
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
                          onClick={() => handleDeleteModalOpen(borrower._id)}
                        >
                          Delete
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
        setTableBorrowers(formattedData);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchBorrowers();
  }, []);

  const handleDeleteModalOpen = async (borrowerId) => {
    try {
      const response = await api.get(`loans/get-borrower/${borrowerId}`);
      setCurrentBorrower(response.data);
      setShowModalDelete(true);
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  };

  const handleUpdateModalOpen = async (borrowerId) => {
    try {
      const response = await api.get(`/loans/get-borrower/${borrowerId}`);
      const borrowerData = response.data;
      const formattedStartDate = borrowerData?.start_date?.split("T")[0];
      const formattedEndDate = borrowerData?.due_date?.split("T")[0];
      setCurrentUpdateBorrower(response.data);
      setUpdateFormData({
        borrower: response.data.borrower._id,
        loan_amount: response.data.loan_amount,
        tenure: response.data.tenure,
        security_deposit: response.data.security_deposit,
        total_release_amount: response.data.total_release_amount,
        interest_percentage: response.data.interest_percentage,
        monthly_emi: response.data.monthly_emi,
        interest_payable: response.data.interest_payable,
        total_payment: response.data.total_payment,
        start_date: formattedStartDate,
        due_date: formattedEndDate,
        note: response.data.note,
      });
      setShowModalUpdate(true);
      setErrors({});
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUpdateFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      const loanAmount = parseFloat(newData.loan_amount);
      const securityDeposit = parseFloat(newData.security_deposit);
      if (!isNaN(loanAmount) && !isNaN(securityDeposit)) {
        newData.total_release_amount = String(loanAmount - securityDeposit);
      } else {
        newData.total_release_amount = "";
      }

      const principal = parseFloat(newData.loan_amount) || 0;
      const rate = parseFloat(newData.interest_percentage) || 0;
      const tenure = parseFloat(newData.tenure) || 1;

      if (principal > 0 && rate > 0 && tenure > 0) {
        const monthlyRate = rate / 1200;
        const emi =
          (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -tenure));
        if (!isNaN(emi)) {
          newData.monthly_emi = emi.toFixed(0);
          newData.total_payment = (emi * tenure).toFixed(0);
          newData.interest_payable = (
            parseFloat(newData.total_payment) - parseFloat(newData.loan_amount)
          ).toFixed(0);
        }
      } else {
        newData.monthly_emi = "";
        newData.total_payment = "";
        newData.interest_payable = "";
      }

      return newData;
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDeleteBorrower = async () => {
    console.log(currentBorrower, "urrentjjaksjdk");
    if (currentBorrower) {
      try {
        await api.delete(`/loans/delete-borrower/${currentBorrower._id}`);
        setAlertConfig({
          message: "Borrower deleted successfully",
          type: "success",
          visibility: true,
        });
        setShowModalDelete(false);
        setCurrentBorrower(null);
      } catch (error) {
        console.error("Error deleting Loan Borrower:", error);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    try {
      if (isValid) {
        await api.patch(
          `/loans/update-borrower/${currentUpdateBorrower._id}`,
          updateFormData
        );
        setShowModalUpdate(false);
        setAlertConfig({
          message: "Borrower updated successfully",
          type: "success",
          visibility: true,
        });
      }
    } catch (error) {
      console.error("Error updating Borrower:", error);
    }
  };

  const columns = [
    { key: "id", header: "SL. NO" },
    { key: "borrower_name", header: "Borrower Name" },
    { key: "loan_amount", header: "Loan Amount" },
    { key: "tenure", header: "Tenure" },
    { key: "security_deposit", header: "Security Deposit" },
    { key: "total_release_amount", header: "Total Release Amount" },
    { key: "interest_percentage", header: "Interest Percentage" },
    { key: "monthly_emi", header: "Monthly EMI" },
    { key: "interest_payable", header: "Interest Payable" },
    { key: "total_payment", header: "Total Payment" },
    { key: "start_date", header: "Start Date" },
    { key: "due_date", header: "Due Date" },
    { key: "note", header: "Note" },
    { key: "action", header: "Action" },
  ];

  return (
    <>
      <div>
        <Navbar
          visibility={true}
          onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
        />
        <CustomAlert
          type={alertConfig.type}
          isVisible={alertConfig.visibility}
          message={alertConfig.message}
        />
        <div className="flex mt-20">
          <Sidebar />

          <div className="flex-grow p-7">
            <div className="mt-6 mb-8">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-semibold">Loans</h1>
                <button
                  onClick={() => {
                    setShowModal(true);
                    setErrors({});
                  }}
                  className="ml-4 bg-blue-950 text-white px-4 py-2 rounded shadow-md hover:bg-blue-800 transition duration-200"
                >
                  + Add Loan
                </button>
              </div>
            </div>

            <DataTable
              catcher="_id"
              updateHandler={handleUpdateModalOpen}
              data={filterOption(tableBorrowers, searchText)}
              columns={columns}
              exportedFileName={`Groups-${
                tableBorrowers.length > 0
                  ? tableBorrowers[0].date +
                    " to " +
                    tableBorrowers[tableBorrowers.length - 1].date
                  : "empty"
              }.csv`}
            />
          </div>
        </div>
        <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Add Loan</h3>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="borrower_name"
                >
                  Select Borrower Name
                </label>
                <select
                  name="borrower"
                  id="borrower"
                  value={formData.borrower}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="" selected hidden>
                    Select Borrower Name
                  </option>
                  {users.map((user) => (
                    <option value={user._id}>{user.full_name}</option>
                  ))}
                </select>
                {errors.borrower && (
                  <p className="text-red-500 text-sm mt-1">{errors.borrower}</p>
                )}
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="loan_amount"
                  >
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    name="loan_amount"
                    value={formData.loan_amount}
                    onChange={handleChange}
                    id="loan_amount"
                    placeholder="Enter Loan Amount"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.loan_amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.loan_amount}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="tenure"
                  >
                    Tenure in Months
                  </label>
                  <input
                    type="number"
                    name="tenure"
                    value={formData.tenure}
                    onChange={handleChange}
                    id="tenure"
                    placeholder="Enter Tenure"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.tenure && (
                    <p className="text-red-500 text-sm mt-1">{errors.tenure}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="security_deposit"
                  >
                    Security Deposit
                  </label>
                  <input
                    type="number"
                    name="security_deposit"
                    value={formData.security_deposit}
                    onChange={handleChange}
                    id="security_deposit"
                    placeholder="Enter Security Deposit"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.security_deposit && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.security_deposit}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Total Release Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Total Release Amount"
                    value={formData.total_release_amount}
                    disabled
                    id="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  w-full p-2.5 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="interest_percentage"
                  >
                    Interest Rate per Year (%)
                  </label>
                  <input
                    type="number"
                    name="interest_percentage"
                    value={formData.interest_percentage}
                    onChange={handleChange}
                    id="interest_percentage"
                    placeholder="Enter Interest"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.interest_percentage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.interest_percentage}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="monthly_emi"
                  >
                    Monthly EMI
                  </label>
                  <input
                    type="number"
                    name="monthly_emi"
                    value={formData.monthly_emi}
                    id="monthly_emi"
                    disabled
                    placeholder="Monthly EMI"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="interest_payable"
                  >
                    Interest Payable
                  </label>
                  <input
                    type="number"
                    placeholder="Interest Payable"
                    name="interest_payable"
                    disabled
                    value={formData.interest_payable}
                    id="interest_payable"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg cursor-not-allowed w-full p-2.5"
                  />
                </div>

                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="total_payable"
                  >
                    Total Payment
                  </label>
                  <input
                    type="number"
                    name="total_payable"
                    value={formData.total_payment}
                    disabled
                    placeholder="Total Payment"
                    id="total_payable"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg cursor-not-allowed w-full p-2.5"
                  />
                </div>
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="start_date"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    id="start_date"
                    placeholder="Enter the Date"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.start_date}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="due_date"
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    id="due_date"
                    placeholder="Enter the Date"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.due_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.due_date}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="note"
                >
                  Note
                </label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  id="note"
                  placeholder="Specify Note if any!"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
                {errors.note && (
                  <p className="text-red-500 text-sm mt-1">{errors.note}</p>
                )}
              </div>
              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="w-1/4 text-white bg-blue-700 hover:bg-blue-800
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border-2 border-black"
                >
                  Save Loan
                </button>
              </div>
            </form>
          </div>
        </Modal>
        <Modal
          isVisible={showModalUpdate}
          onClose={() => setShowModalUpdate(false)}
        >
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Update Loan
            </h3>
            <form className="space-y-6" onSubmit={handleUpdate} noValidate>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="borrower_name"
                >
                  Select Borrower Name
                </label>
                <select
                  name="borrower"
                  id="borrower"
                  value={updateFormData.borrower}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="" selected hidden>
                    Select Borrower Name
                  </option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.full_name}
                    </option>
                  ))}
                </select>
                {errors.borrower && (
                  <p className="text-red-500 text-sm mt-1">{errors.borrower}</p>
                )}
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="loan_amount"
                  >
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    name="loan_amount"
                    value={updateFormData.loan_amount}
                    onChange={handleInputChange}
                    id="loan_amount"
                    placeholder="Enter Loan Amount"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.loan_amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.loan_amount}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="tenure"
                  >
                    Tenure
                  </label>
                  <input
                    type="number"
                    name="tenure"
                    value={updateFormData.tenure}
                    onChange={handleInputChange}
                    id="tenure"
                    placeholder="Enter Tenure"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.tenure && (
                    <p className="text-red-500 text-sm mt-1">{errors.tenure}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="security_deposit"
                  >
                    Security Deposit
                  </label>
                  <input
                    type="number"
                    name="security_deposit"
                    value={updateFormData.security_deposit}
                    onChange={handleInputChange}
                    id="security_deposit"
                    placeholder="Enter Security Deposit"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.security_deposit && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.security_deposit}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Total Release Amount
                  </label>
                  <input
                    type="number"
                    disabled
                    name="total_release_amount"
                    value={updateFormData.total_release_amount}
                    onChange={handleInputChange}
                    id="text"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg cursor-not-allowed w-full p-2.5"
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="interest_percentage"
                  >
                    Interest Percentage
                  </label>
                  <input
                    type="number"
                    name="interest_percentage"
                    value={
                      updateFormData.interest_percentage 
                    }
                    onChange={handleInputChange}
                    id="interest_percentage"
                    placeholder="Enter Interest"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.interest_percentage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.interest_percentage}
                    </p>
                  )}
                </div>


                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="monthly_emi"
                    
                  >
                    Monthly EMI
                  </label>
                  <input
                    type="number"
                    name="monthly_emi"
                    disabled
                    value={
                     updateFormData.monthly_emi
                    }
					placeholder="Monthly EMI"
                    id="monthly_emi"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg cursor-not-allowed w-full p-2.5"
                  />
                
                </div>

               
              </div>
              <div className="flex flex-row justify-between space-x-4">
			  <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="interest_payable"
                  >
                    Interest Payable
                  </label>
                  <input
                    type="number"
                    placeholder="Interest Payable"
                    name="interest_payable"
                    value={
                     updateFormData.interest_payable
                    }
                    onChange={handleInputChange}
                    id="interest_payable"
                    disabled
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg cursor-not-allowed w-full p-2.5"
                  />
                
                </div>





                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="total_payment"
                  >
                    Total Payment
                  </label>
                  <input
                    type="number"
                    name="total_payment"
					placeholder="Total Payment"
                    value={updateFormData.total_payment}
                    onChange={handleInputChange}
                    id="total_payment"
                    disabled
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg cursor-not-allowed  w-full p-2.5"
                  />
                 
                </div>
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="start_date"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={updateFormData.start_date}
                    onChange={handleInputChange}
                    id="start_date"
                    placeholder="Enter the Date"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.start_date}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="due_date"
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={updateFormData.due_date}
                    onChange={handleInputChange}
                    id="due_date"
                    placeholder="Enter the Date"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.due_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.due_date}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="note"
                >
                  Note
                </label>
                <input
                  type="text"
                  name="note"
                  value={updateFormData.note}
                  onChange={handleInputChange}
                  id="note"
                  placeholder="Specify Note if any!"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
                {errors.note && (
                  <p className="text-red-500 text-sm mt-1">{errors.note}</p>
                )}
              </div>
              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="w-1/4 text-white bg-blue-700 hover:bg-blue-800
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border-2 border-black"
                >
                  Update Loan
                </button>
              </div>
            </form>
          </div>
        </Modal>
        <Modal
          isVisible={showModalDelete}
          onClose={() => {
            setShowModalDelete(false);
            currentBorrower(null);
          }}
        >
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Delete Group
            </h3>
            {currentBorrower && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteBorrower();
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
                      {currentBorrower.borrower.full_name}
                    </span>{" "}
                    to confirm deletion.
                  </label>
                  <input
                    type="text"
                    id="borrowerName"
                    placeholder="Enter the Borrower Name"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-red-700 hover:bg-red-800
          focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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

export default Loan;
