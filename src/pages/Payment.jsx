/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import api from "../instance/TokenInstance";
import Modal from "../components/modals/Modal";
import DataTable from "../components/layouts/Datatable";
import CustomAlert from "../components/alerts/CustomAlert";
import CircularLoader from "../components/loaders/CircularLoader";
import { FaWhatsappSquare } from "react-icons/fa";
import Navbar from "../components/layouts/Navbar";
import {
  Select,
  Dropdown,
  Modal as AntModal,
  Drawer,
  Tooltip,
  Spin,
  Button,
} from "antd";
import { IoMdMore } from "react-icons/io";
import { Link } from "react-router-dom";
import dataPaymentsFor from "../data/paymentsFor";
import BackdropBlurLoader from "../components/loaders/BackdropBlurLoader";
import { FaReceipt } from "react-icons/fa";
import { fieldSize } from "../data/fieldSize";
import { LoadingOutlined } from "@ant-design/icons";
import { Space } from "lucide-react";
const Payment = () => {
  const [groups, setGroups] = useState([]);
  const [actualGroups, setActualGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [TablePayments, setTablePayments] = useState([]);
  const [selectedAuctionGroup, setSelectedAuctionGroup] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedAuctionGroupId, setSelectedAuctionGroupId] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [viewLoader, setViewLoader] = useState(false);
  const [filteredAuction, setFilteredAuction] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [currentUpdateAmount, setCurrentUpdateAmount] = useState(false);
  //const [showModalView, setShowModelView] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [showModalView, setShowModalView] = useState(false);
  const [currentViewGroup, setCurrentViewGroup] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [receiptNo, setReceiptNo] = useState("");
  const whatsappEnable = true;
  const [paymentMode, setPaymentMode] = useState("cash");
  const today = new Date().toISOString().split("T")[0];
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [paymentFor, setPaymentFor] = useState(dataPaymentsFor.typeChit);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [borrowers, setBorrowers] = useState([]);
  const [pigmeCustomers, setPigmeCustomers] = useState([]);
  const [enableGroupColumn, setEnableGroupColumn] = useState(true);
  const [paymentGroupTickets, setPaymentGroupTickets] = useState([]);
  const [render, setRerender] = useState(0);
  const [openBackdropLoader, setOpenBackdropLoader] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [openAntDDrawer, setOpenAntDDrawer] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [lastThreePayments, setLastThreePayments] = useState([]);

  const dropDownItems = (group) => {
    const dropDownItemList = [
      {
        key: "1",
        label: (
          <Link to={`/print/${group._id}`} className="text-violet-600 ">
            Print
          </Link>
        ),
      },
      {
        key: "2",
        label: (
          <div
            className="text-red-600 "
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
            className="text-green-600 "
            onClick={() => handleViewModalOpen(group._id)}
          >
            View
          </div>
        ),
      },
    ];
    if (modifyPayment) {
      dropDownItemList.push({
        key: "4",
        label: (
          <div
            className="text-violet-600 "
            onClick={() => handleUpdateModalOpen(group._id)}
          >
            Update Amount
          </div>
        ),
      });
    }
    return dropDownItemList;
  };
  const onGlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    noReload: false,
    type: "info",
  });

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    user_id: "",
    receipt_no: "",
    pay_date: today,
    amount: "",
    pay_type: "cash",
    transaction_id: "",
    payment_group_tickets: [],
    account_type: "",
    cheque_number: "",
    cheque_date: "",
    cheque_bank_name: "",
    cheque_bank_branch: "",
    collection_time: "",
  });
  const [updateFormData, setUpdateFormData] = useState({
    amount: "",
    pay_date: "",
  });
  // const [showPrintModal, setShowPrintModal] = useState(false);
  const [modifyPayment, setModifyPayment] = useState(false);
  const [modifyMinMaxPaymentDate, setModifyMinMaxPaymentDate] = useState(false);
  const now = new Date();
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
    .toISOString()
    .split("T")[0];
  // const [printDetails, setPrintDetails] = useState({
  //   customerName: "",
  //   groupName: "",
  //   ticketNumber: "",
  //   receiptNumber: "",
  //   paymentDate: "",
  //   paymentMode: "",
  //   amount: "",
  //   transactionId: "",
  // });
  // const printModalOnCloseHandler = () => setShowPrintModal(false);

  const handleUploadModalClose = () => {
    setShowUploadModal(false);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const userObj = JSON.parse(user);

    if (userObj) {
      // Check for admin access rights
      const adminAccessPermissions =
        userObj.admin_access_right_id?.access_permissions;

      // Set modifyPayment for admin users with the edit_payment permission
      if (adminAccessPermissions?.edit_payment === "true") {
        setModifyPayment(true); // Admin can modify payment date
      }

      // Set modifyPayment and modifyMinMaxPaymentDate for users with limited access
      if (adminAccessPermissions?.edit_limited_payment === "true") {
        setModifyPayment(true); // Limited users can modify payment date
        setModifyMinMaxPaymentDate(true); // Limited users have min/max date restrictions
      }
    }
  }, []);
  useEffect(() => {
    const usr = localStorage.getItem("user");
    let admin_type = null;

    try {
      if (usr) {
        admin_type = JSON.parse(usr);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
    }

    const fetchTodaysPayments = async () => {
      try {
        setTablePayments([]);
        setIsLoading(true);
        const response = await api.get("/payment/get-payments-by-dates", {
          params: {
            from_date: today,
            to_date: today,
          },
        });
        if (response.data && response.data.length > 0) {
          const formattedData = response.data.map((group, index) => {
            if (!group?.group_id?.group_name) return {};
            return {
              _id: group._id,
              id: index + 1,
              name: group?.user_id?.full_name,
              phone_number: group?.user_id?.phone_number,
              group_name: group?.group_id?.group_name,
              pay_type: group?.pay_type,
              ticket: group.ticket,
              receipt: group.receipt_no,
              old_receipt: group.old_receipt_no,
              amount: group.amount,
              date: formatPayDate(group.pay_date),
              transaction_date: formatPayDate(group.createdAt),
              collection_time: group?.collection_time,
              collected_by:
                group?.collected_by?.name ||
                group?.admin_type?.admin_name ||
                "Super Admin",
              action: (
                <div className="flex justify-center gap-2">
                  <Dropdown
                    trigger={["click"]}
                    menu={{
                      items: dropDownItems(group),
                    }}
                    placement="bottomLeft"
                  >
                    <IoMdMore className="text-bold" />
                  </Dropdown>
                </div>
              ),
            };
          });
          setTablePayments(formattedData);
          setEnableGroupColumn(true);
        } else {
          setFilteredAuction([]);
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
        setFilteredAuction([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodaysPayments();
  }, [render]);

  const fetchLastThreeTransactions = async (event) => {
    event.preventDefault();
    setOpenAntDDrawer(true);
    if (formData.user_id && formData.payment_group_tickets) {
      try {
        setShowLoader(true);
        const response = await api.get("payment/get-last-n-transaction", {
          params: {
            user_id: formData.user_id,
            payment_group_tickets: paymentGroupTickets,
            limit: 3,
          },
        });
        if (response?.data) {
          setLastThreePayments(response.data);
        } else {
          setLastThreePayments([]);
        }
      } catch (error) {
        setLastThreePayments([]);
      } finally {
        setShowLoader(false);
      }
    }
  };

  useEffect(() => {
    setBorrowers([]);
    const fetchCustomerLoanDetails = async () => {
      try {
        const response = await api.get(
          `/loans/get-borrower-by-user-id/${selectedGroupId}`
        );
        if (response.status >= 400)
          throw new Error("fetching loan borrowers Failed");
        setBorrowers(response.data);
      } catch (err) {
        console.log("Error Occurred");
      }
    };

    fetchCustomerLoanDetails();
  }, [selectedGroupId]);

  useEffect(() => {
    setPigmeCustomers([]);
    const fetchCustomerLoanDetails = async () => {
      try {
        const response = await api.get(
          `/pigme/get-pigme-customer-by-user-id/${selectedGroupId}`
        );
        if (response.status >= 400)
          throw new Error("fetching pigme customers Failed");
        setPigmeCustomers(response.data);
      } catch (err) {
        console.log(
          "Error Occurred while fetching pigme customers,",
          err.message
        );
      }
    };

    fetchCustomerLoanDetails();
  }, [selectedGroupId]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/user/get-user");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroups();
  }, [alertConfig]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/group/get-group-admin");
        setActualGroups(response.data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroups();
  }, [alertConfig]);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await api.get("/payment/get-latest-receipt");
        setReceiptNo(response.data);
      } catch (error) {
        console.error("Error fetching receipt data:", error);
      }
    };
    fetchReceipt();
  }, [alertConfig]);

  useEffect(() => {
    if (receiptNo) {
      setFormData((prevData) => ({
        ...prevData,
        receipt_no: receiptNo.receipt_no,
      }));
    }
  }, [receiptNo]);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedGroupId) {
      newErrors.customer = "Please select a customer";
    }

    if (!formData.payment_group_tickets) {
      newErrors.payment_group_tickets = "Please select a group and ticket";
    }

    if (!formData.pay_date) {
      newErrors.pay_date = "Payment date is required";
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      newErrors.amount = "Please enter a valid positive amount";
    }

    if (paymentMode === "online" && !formData.transaction_id?.trim()) {
      newErrors.transaction_id =
        "Transaction ID is required for online payments";
    }

    if (paymentMode === "cheque" && !formData.cheque_date?.trim()) {
      newErrors.cheque_date = "Cheque Date is required for cheque payments";
    }
    if (paymentMode === "cheque" && !formData.cheque_number?.trim()) {
      newErrors.cheque_number = "Cheque Number is required for cheque payments";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevData) => ({ ...prevData, [name]: "" }));
  };
  const handlePaymentAntSelect = (values) => {
    setPaymentGroupTickets(values);
  };

  const handleGroupChange = async (groupId) => {
    setSelectedGroup(groupId);

    if (groupId) {
      try {
        setEnrollmentLoading(true);

        const response = await api.get(`/enroll/get-group-enroll/${groupId}`);
        if (response.data && response.data.length > 0) {
          setFilteredUsers(response.data);
        } else {
          setFilteredUsers([]);
        }
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
        setFilteredUsers([]);
      } finally {
        setEnrollmentLoading(false);
      }
    } else {
      setFilteredUsers([]);
    }
  };

  const onChoosePaymentFor = (e) => {
    setPaymentFor(e.target.value);
  };

  const columns = [
    { key: "id", header: "SL. NO" },
    { key: "date", header: "Paid Date" },
    { key: "transaction_date", header: "Transaction Date" },
    { key: "name", header: "Customer Name" },
    { key: "phone_number", header: "Customer Phone Number" },
  ];
  if (enableGroupColumn) {
    columns.push({ key: "group_name", header: "Group Name" });
  }
  columns.push(
    { key: "ticket", header: "Ticket Number" },
    { key: "old_receipt", header: "Old Receipt" },
    { key: "receipt", header: "Receipt" },
    { key: "amount", header: "Amount" },
    {key: "pay_type", header: "Payment Type"},
    {key: "collection_time", header: "Collection Time"},
    { key: "collected_by", header: "Collected By" },
    { key: "action", header: "Action" }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCustomer = async (groupId) => {
    setFilteredAuction([]);
    setFilteredUsers([]);
    setSelectedGroupId(groupId);
    setFormData((prevFormData) => ({
      ...prevFormData,
      user_id: groupId,
    }));
    setErrors((prevData) => ({ ...prevData, customer: "" }));
    setPaymentGroupTickets([]);
    handleGroupChange(groupId);
    handleGroupAuctionChange(groupId);
  };
  const handleGroupPayment = async (groupId) => {
    setSelectedAuctionGroupId(groupId);
    handleGroupPaymentChange(groupId);
  };

  const formatPayDate = (dateString) => {
    return dateString?.split("T")[0];
  };

  const handleGroupPaymentChange = async (groupId) => {
    setSelectedAuctionGroup(groupId);
    if (groupId) {
      let url;
      if (groupId === "today") {
        url = `/payment/get-payments-by-dates?from_date=${today}&to_date=${today}`;
        setEnableGroupColumn(true);
      } else {
        url = `/payment/get-group-payment/${groupId}`;
        setEnableGroupColumn(false);
      }
      try {
        setTablePayments([]);
        setIsLoading(true);
        const response = await api.get(url);

        if (response.data && response.data.length > 0) {
          const formattedData = response.data.map((group, index) => {
            if (!group?.group_id?.group_name) return {};
            return {
              _id: group._id,
              id: index + 1,
              name: group?.user_id?.full_name,
              phone_number: group?.user_id?.phone_number,
              group_name: group?.group_id?.group_name,
              ticket: group.ticket,
              receipt: group.receipt_no,
              old_receipt: group.old_receipt_no,
              amount: group.amount,
              pay_type: group?.pay_type,
              date: group?.pay_date.split("T")[0],
              transaction_date: group?.createdAt?.split("T")[0],
              collected_by:
                group?.collected_by?.name ||
                group?.admin_type?.admin_name ||
                "Super Admin",
              action: (
                <div className="flex justify-center gap-2">
                  <Dropdown
                    trigger={["click"]}
                    menu={{
                      items: dropDownItems(group),
                    }}
                    placement="bottomLeft"
                  >
                    <IoMdMore className="text-bold" />
                  </Dropdown>
                </div>
              ),
            };
          });
          setTablePayments(formattedData);
        } else {
          setFilteredAuction([]);
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
        setFilteredAuction([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setFilteredAuction([]);
    }
  };

  const handlePaymentModeChange = (e) => {
    const selectedMode = e.target.value;
    setPaymentMode(selectedMode);
    setFormData((prevData) => ({
      ...prevData,
      pay_type: selectedMode,

      transaction_id:
        selectedMode === "online" || selectedMode === "online/upi"
          ? prevData.transaction_id
          : "",
    }));
  };
  const handleAccountTypeChange = (e) => {
    const selectedMode = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      account_type: selectedMode,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    try {
      if (isValid) {
        setDisabled(true);
        setAlertConfig((prev) => ({
          ...prev,
          visibility: false,
        }));
        setShowModal(false);
        let payload;
        const usr = localStorage.getItem("user");
        let admin_type = null;
        try {
          if (usr) {
            admin_type = JSON.parse(usr);
          }
        } catch (e) {
          console.error("Failed to parse user from localStorage:", e);
        }

        formData.payment_group_tickets = paymentGroupTickets;
        formData.admin_type = admin_type?._id;
        setOpenBackdropLoader(true);
        const response = await api.post("/payment/add-payments", formData);
        if (response.status === 201) {
          setSelectedGroupId("");
          setPaymentGroupTickets([]);
          setDisabled(false);
          setFormData({
            user_id: "",
            receipt_no: "",
            pay_date: today,
            amount: "",
            pay_type: "cash",
            transaction_id: "",
            payment_group_tickets: [],
            account_type: "",
            cheque_number: "",
            cheque_date: "",
            cheque_bank_name: "",
            cheque_bank_branch: "",
          });
          setAlertConfig({
            visibility: true,
            noReload: true,
            message: "Payment Added Successfully",
            type: "success",
          });
        }

        if (response.status >= 400) {
          setShowModal(false);
          setSelectedGroupId("");
          setPaymentGroupTickets([]);
          setDisabled(false);
          setFormData({
            user_id: "",
            receipt_no: "",
            pay_date: today,
            amount: "",
            pay_type: "cash",
            transaction_id: "",
            payment_group_tickets: [],
            account_type: "",
            cheque_number: "",
            cheque_date: "",
            cheque_bank_name: "",
            cheque_bank_branch: "",
          });
          setAlertConfig({
            visibility: true,
            noReload: true,
            message: "Payment Added Failed",
            type: "error",
          });
        }
      }
    } catch (error) {
      setShowModal(false);
      setSelectedGroupId("");
      setFormData({
        user_id: "",
        receipt_no: "",
        pay_date: "",
        amount: "",
        pay_type: "cash",
        transaction_id: "",
        payment_group_tickets: [],
        account_type: "",
      });
      setAlertConfig({
        visibility: true,
        noReload: true,
        message: `Error submitting payment data`,
        type: "error",
      });
      setDisabled(false);
      console.error("Error submitting payment data:", error);
    } finally {
      setOpenBackdropLoader(false);
      setRerender((prev) => prev + 1);
    }
  };

  const handleDeleteModalOpen = async (groupId) => {
    try {
      const response = await api.get(`/payment/get-payment-by-id/${groupId}`);
      setCurrentGroup(response.data);
      setShowModalDelete(true);
    } catch (error) {
      console.error("Error fetching enroll:", error);
    }
  };

  const handleDeleteAuction = async () => {
    if (currentGroup) {
      try {
        await api.delete(`/payment/delete-payment/${currentGroup._id}`);

        setShowModalDelete(false);
        setCurrentGroup(null);
        setAlertConfig({
          visibility: true,
          message: "Payment deleted successfully",
          type: "success",
        });
        window.location.reload();
      } catch (error) {
        console.error("Error deleting auction:", error);
      }
    }
  };

  const handleViewModalOpen = async (groupId) => {
    try {
      setLoading(true);
      setShowModalView(true);
      setCurrentGroupId(groupId);
      setViewLoader(true);
      const response = await api.get(`/payment/get-payment-by-id/${groupId}`);
      setCurrentViewGroup(response.data);
    } catch (error) {
      console.error("Error viewing Payment:", error);
    } finally {
      setLoading(false);
      setViewLoader(false);
    }
  };

  const handleUpdateModalOpen = async (groupId) => {
    try {
      const response = await api.get(`/payment/get-payment-by-id/${groupId}`);
      setCurrentUpdateAmount(response.data);
      setUpdateFormData({
        amount: response?.data?.amount,
        pay_date: response?.data?.pay_date.split("T")[0],
      });
      setShowUpdateModal(true);
    } catch (error) {
      console.error("Error fetching Payment Amount data:", error);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/payment/update-payment-amount/${currentUpdateAmount._id}`,
        updateFormData
      );
      setShowUpdateModal(false);

      setAlertConfig({
        visibility: true,
        message: "Payment Amount Updated Successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating Payment Amount:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setAlertConfig({
          visibility: true,
          message: `${error?.response?.data?.message}`,
          type: "error",
        });
      } else {
        setAlertConfig({
          visibility: true,
          message: "An unexpected error occurred. Please try again.",
          type: "error",
        });
      }
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();

    const formDatas = new FormData();
    const fileInput = e.target.file;

    formDatas.append("user_id", formData.user_id);
    formDatas.append("group_id", formData.group_id);
    formDatas.append("ticket", formData.ticket);

    if (fileInput && fileInput.files[0]) {
      formDatas.append("file", fileInput.files[0]);

      try {
        const response = await api.post(`/payment/payment-excel`, formDatas, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 200) {
          setShowUploadModal(false);
          setAlertConfig({
            visibility: true,
            message: "File uploaded successfully!",
            type: "success",
          });
        }
      } catch (error) {
        console.error("Error uploading file:", error);

        setAlertConfig({
          visibility: true,
          message: "Failed to upload file.",
          type: "success",
        });
      }
    } else {
      setAlertConfig({
        visibility: true,
        message: "Please select a file to upload.",
        type: "success",
      });
    }
  };

  const handleGroupAuctionChange = async (groupId) => {
    if (groupId) {
      try {
        const response = await api.post(
          `/enroll/get-user-tickets-report/${groupId}`
        );
        if (response.data && response.data.length > 0) {
          const validAuctions = response.data.filter(
            (auction) => auction.enrollment && auction.enrollment.group
          );
          setFilteredAuction(validAuctions);
        } else {
          setFilteredAuction([]);
        }
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
        setFilteredAuction([]);
      }
    } else {
      setFilteredAuction([]);
    }
  };
  const selectednewGroup = actualGroups.find(
    (g) => g._id === selectedAuctionGroupId
  );
  return (
    <>
      {openBackdropLoader ? (
        <BackdropBlurLoader title={"payment Data processing...."} />
      ) : (
        <div>
          <div className="flex mt-20">
            <Navbar
              onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
              visibility={true}
            />
            <Sidebar />
            <CustomAlert
              type={alertConfig.type}
              isVisible={alertConfig.visibility}
              message={alertConfig.message}
              noReload={alertConfig.noReload}
            />
            <div className="flex-grow p-7">
              <h1 className="text-2xl font-semibold">Payments</h1>
              <div className="mt-6  mb-8">
                <div className="mb-10">
                  <label className="font-bold">Search or Select Group</label>
                  <div className="flex justify-between items-center w-full">
                    <Select
                      placeholder="Today's Payment"
                      popupMatchSelectWidth={false}
                      showSearch
                      className="w-full  h-14 max-w-md"
                      filterOption={(input, option) =>
                        option.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      value={selectedAuctionGroupId || undefined}
                      onChange={handleGroupPayment}
                    >
                      <Select.Option key={"#1"} value={"today"}>
                        Today's Payments
                      </Select.Option>
                      {actualGroups.map((group) => (
                        <Select.Option key={group._id} value={group._id}>
                          {group.group_name}
                        </Select.Option>
                      ))}
                    </Select>
                    <div>
                      <button
                        onClick={() => setShowModal(true)}
                        className="ml-4 bg-violet-950 text-white px-4 py-2 rounded shadow-md hover:bg-violet-800 transition duration-200"
                      >
                        + Add Payment
                      </button>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="ml-4 bg-yellow-300 text-black px-4 py-2 rounded shadow-md hover:bg-yellow-400 transition duration-200"
                      >
                        Upload Excel
                      </button>
                    </div>
                  </div>
                </div>

                {TablePayments && TablePayments.length > 0 ? (
                  <DataTable
                    data={TablePayments.filter((item) =>
                      Object.values(item).some((value) =>
                        String(value)
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                      )
                    )}
                    columns={columns}
                    exportedPdfName="Payments"
                    printHeaderKeys={["Group Name"]}
                    printHeaderValues={[
                      selectednewGroup?.group_name || "Today's",
                    ]}
                    exportedFileName={`Payments-${selectednewGroup?.group_name} .csv`}
                  />
                ) : (
                  <div className="mt-10 text-center text-gray-500">
                    <CircularLoader
                      isLoading={isLoading}
                      data="Payments Data"
                      failure={
                        TablePayments.length <= 0 && selectedAuctionGroupId
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            <Drawer
              open={showModal}
              onClose={() => {
                setSelectedGroupId("");
                setShowModal(false);
                setErrors({});
                setPaymentGroupTickets([]);
              }}
              extra={
                <Tooltip title="Last 3 Transactions">
                  <button
                    onClick={fetchLastThreeTransactions}
                    value="Last Three transaction"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-200 font-medium"
                  >
                    <FaReceipt className="text-lg" />
                    <span>Last 3 Transactions</span>
                  </button>
                </Tooltip>
              }
            >
              <>
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Add Payment
                </h3>
                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                  <Drawer
                    closable
                    destroyOnHidden
                    title={<p>Last Three Transactions</p>}
                    placement="right"
                    open={openAntDDrawer}
                    loading={showLoader}
                    onClose={() => setOpenAntDDrawer(false)}
                  >
                    {lastThreePayments?.length <= 0 ? (
                      <div className="font-semibold text-center text-xl">
                        No Transaction Found
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 ">
                        {lastThreePayments.map((payment) => {
                          return (
                            <section className="bg-white shadow-md rounded-lg p-4 space-y-2 border border-gray-200 ">
                              <div className="text-gray-800 font-semibold">
                                Payment Date:{" "}
                                <span className="font-bold">
                                  {payment?.pay_date}
                                </span>
                              </div>

                              {payment.group_id && (
                                <div className="text-gray-800 font-semibold">
                                  Group:{" "}
                                  <span className="font-bold">
                                    {payment.group_id?.group_name}
                                  </span>
                                </div>
                              )}
                              {payment.ticket && (
                                <div className="text-gray-800 font-semibold">
                                  Ticket:{" "}
                                  <span className="font-normal">
                                    {payment?.ticket}
                                  </span>
                                </div>
                              )}
                              <div className="text-gray-800 font-semibold">
                                Amount:{" "}
                                <span className="font-bold">
                                  ₹{payment?.amount}
                                </span>
                              </div>
                              <div className="text-gray-800 font-semibold">
                                Payment Type:{" "}
                                <span className="font-normal">
                                  {payment?.pay_type}
                                </span>
                              </div>
                              <div className="text-gray-800 font-semibold">
                                Name:{" "}
                                <span className="font-normal">
                                  {payment.user_id?.full_name}
                                </span>
                              </div>
                            </section>
                          );
                        })}
                      </div>
                    )}
                  </Drawer>
                  <div className="w-full">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="category"
                    >
                      Customer <span className="text-red-500 ">*</span>
                    </label>

                    <Select
                      className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full ${fieldSize.height}`}
                      placeholder="Select Or Search Customer"
                      popupMatchSelectWidth={false}
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      value={selectedGroupId || undefined}
                      onChange={handleCustomer}
                    >
                      {groups.map((group) => (
                        <Select.Option key={group._id} value={group._id}>
                          {`${group.full_name} | ${group.phone_number}`}
                        </Select.Option>
                      ))}
                    </Select>

                    {errors.customer && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.customer}
                      </p>
                    )}
                  </div>

                  <div
                    className={`${
                      enrollmentLoading ? "cursor-progress" : ""
                    } w-full`}
                  >
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 "
                      htmlFor="category"
                    >
                      Group & Ticket <span className="text-red-500 ">*</span>
                    </label>
                    <Select
                      disabled={enrollmentLoading}
                      mode="multiple"
                      name="group_id"
                      placeholder="Select Group | Ticket"
                      onChange={handlePaymentAntSelect}
                      loading={enrollmentLoading}
                      value={paymentGroupTickets}
                      className={` bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5 `}
                    >
                      {filteredAuction.map((entry, index) => {
                        const groupName =
                          entry?.enrollment?.group?.group_name ||
                          "Unnamed Group";
                        const groupId =
                          entry?.enrollment?.group?._id || `missing-${index}`;
                        const ticket = entry?.enrollment?.tickets || "Unknown";

                        return (
                          <Select.Option
                            key={`chit-${groupId}|${ticket}`}
                            value={`chit-${groupId}|${ticket}`}
                          >
                            {groupName} | {ticket}
                          </Select.Option>
                        );
                      })}
                      {pigmeCustomers?.map((pigme) => {
                        return (
                          <Select.Option value={`pigme-${pigme._id}`}>
                            {`${pigme.pigme_id} | ₹ ${pigme.payable_amount}`}
                          </Select.Option>
                        );
                      })}
                      {borrowers?.map((borrower) => {
                        return (
                          <Select.Option value={`loan-${borrower._id}`}>
                            {`loan-${borrower.loan_id} | ₹ ${borrower.loan_amount}`}
                          </Select.Option>
                        );
                      })}
                    </Select>
                    {errors.payment_group_tickets && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.payment_group_tickets}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-row justify-between space-x-4">
                    <div className="w-full">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="group_install"
                      >
                        Payment Date
                      </label>
                      <input
                        disabled={!modifyPayment}
                        type="date"
                        name="pay_date"
                        min={modifyMinMaxPaymentDate ? yesterday : undefined}
                        max={modifyMinMaxPaymentDate ? today : undefined}
                        value={formData.pay_date}
                        id="pay_date"
                        onChange={handleChange}
                        placeholder=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                      />

                      {errors.pay_date && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.pay_date}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row justify-between space-x-4">
                    <div className="w-1/2">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="group_value"
                      >
                        Amount <span className="text-red-500 ">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          id="amount"
                          onChange={handleChange}
                          placeholder="Enter Amount"
                          required
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                        />
                      </div>

                      {errors.amount && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.amount}
                        </p>
                      )}
                    </div>
                    <div className="w-1/2">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="pay_mode"
                      >
                        Payment Mode
                      </label>
                      <select
                        name="pay_mode"
                        id="pay_mode"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                        onChange={handlePaymentModeChange}
                      >
                        <option value="cash">Cash</option>
                        <option value="online">Online</option>
                        <option value="online/upi">Online/UPI</option>
                        <option value="cheque">Cheque</option>
                      </select>
                    </div>
                  </div>
                  {formData.amount && paymentGroupTickets.length > 1 && (
                    <div>
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="pay_mode"
                      >
                        Individual Ticket Amount
                      </label>

                      <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:cursor-not-allowed w-full p-2.5"
                        placeholder="totalAmount"
                        value={
                          Number(formData.amount) / paymentGroupTickets.length
                        }
                        disabled
                      />
                    </div>
                  )}
                  {(paymentMode === "online" || paymentMode === "online/upi") && (
                    <div className="w-full mt-4">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="transaction_id"
                      >
                        Transaction ID <span className="text-red-500 ">*</span>
                      </label>
                      <input
                        type="text"
                        name="transaction_id"
                        id="transaction_id"
                        value={formData.transaction_id}
                        onChange={handleChange}
                        placeholder="Enter Transaction ID"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                      />
                      {errors.transaction_id && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.transaction_id}
                        </p>
                      )}
                    </div>
                  )}
                  {paymentMode === "cheque" && (
                    <>
                      {/* Row 1 */}
                      <div className="flex gap-4">
                        <div className="w-1/2 mt-4">
                          <label
                            className="block mb-2 text-sm font-medium text-gray-900"
                            htmlFor="cheque_number"
                          >
                            Cheque Number{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cheque_number"
                            id="cheque_number"
                            value={formData.cheque_number}
                            onChange={handleChange}
                            placeholder="Enter Cheque Number"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                     focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                          />
                          {errors.cheque_number && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.cheque_number}
                            </p>
                          )}
                        </div>

                        <div className="w-1/2 mt-4">
                          <label
                            className="block mb-2 text-sm font-medium text-gray-900"
                            htmlFor="cheque_date"
                          >
                            Cheque Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="cheque_date"
                            id="cheque_date"
                            value={formData.cheque_date.split("T")[0]}
                            onChange={handleChange}
                            placeholder="Enter Cheque Date"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                     focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                          />
                          {errors.cheque_date && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.cheque_date}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="flex gap-4">
                        <div className="w-1/2 mt-4">
                          <label
                            className="block mb-2 text-sm font-medium text-gray-900"
                            htmlFor="cheque_bank_name"
                          >
                            Bank Name
                          </label>
                          <input
                            type="text"
                            name="cheque_bank_name"
                            id="cheque_bank_name"
                            value={formData.cheque_bank_name}
                            onChange={handleChange}
                            placeholder="Enter Bank Name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                     focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                          />
                        </div>

                        <div className="w-1/2 mt-4">
                          <label
                            className="block mb-2 text-sm font-medium text-gray-900"
                            htmlFor="cheque_bank_branch"
                          >
                            Bank Branch
                          </label>
                          <input
                            type="text"
                            name="cheque_bank_branch"
                            id="cheque_bank_branch"
                            value={formData.cheque_bank_branch}
                            onChange={handleChange}
                            placeholder="Enter Bank Branch"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                     focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex flex-row justify-between space-x-4">
                    {modifyPayment && (
                      <div className="w-full">
                        <label
                          className="block mb-2 text-sm font-medium text-gray-900"
                          htmlFor="pay_mode"
                        >
                          Account Type
                        </label>
                        <select
                          name="account_type"
                          id="account_type"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                          onChange={handleAccountTypeChange}
                        >
                          <>
                            <option value={""}>Select Account Type</option>
                            <option value="suspense">Suspense</option>
                            <option value="credit">Credit</option>
                            <option value="adjustment">Adjustment</option>
                            <option value="change group">Change Group</option>
                            <option value="others">Others</option>
                          </>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center p-4 max-w-full bg-white rounded-lg shadow-sm space-y-4">
                    <div className="flex items-center space-x-1">
                      <FaWhatsappSquare color="green" className="w-8 h-8" />
                      <h2 className="text-md font-semibold text-gray-800">
                        WhatsApp
                      </h2>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={whatsappEnable}
                        className="text-green-500 checked:ring-2  checked:ring-green-700 rounded-full w-4 h-4"
                      />
                      <span className="text-gray-700 text-sm">
                        Send Via Whatsapp
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 text-white bg-violet-600 hover:bg-violet-700 
               focus:ring-2 focus:outline-none focus:ring-violet-300 
               font-medium rounded-md text-sm px-4 py-2 shadow-sm transition-all"
                    >
                      Save Payment
                    </button>
                  </div>
                </form>
              </>
            </Drawer>

            <Modal
              isVisible={showUpdateModal}
              onClose={() => {
                setSelectedGroupId("");
                setShowUpdateModal(false);
                setErrors({});
                setPaymentGroupTickets([]);
              }}
            >
              <div className="py-6 px-5 lg:px-8 text-left">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Update</h3>

                <form className="space-y-6" onSubmit={handleUpdate} noValidate>
                  <div className="flex flex-row justify-between space-x-4">
                    {/* Payment Date */}
                    <div className="w-1/2">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="pay_date"
                      >
                        Payment Date
                      </label>
                      <input
                        disabled={!modifyPayment}
                        type="date"
                        name="pay_date"
                        min={modifyMinMaxPaymentDate ? yesterday : undefined}
                        max={modifyMinMaxPaymentDate ? today : undefined}
                        id="pay_date"
                        value={
                          updateFormData?.pay_date &&
                          !isNaN(new Date(updateFormData.pay_date))
                            ? new Date(updateFormData.pay_date)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={handleInputChange}
                        placeholder="Update payDate"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                      />
                      {errors.pay_date && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.pay_date}
                        </p>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="w-1/2">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="amount"
                      >
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={updateFormData?.amount || ""}
                        onChange={handleInputChange}
                        placeholder="Enter Amount"
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                      />
                      {errors.amount && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.amount}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="w-full flex justify-end">
                    <button
                      type="submit"
                      className="w-1/4 text-white bg-violet-700 hover:bg-violet-800 border-2 border-black
            focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </Modal>

            {/* <PrintModal
            isVisible={showPrintModal}
            onClose={printModalOnCloseHandler}
          >
            <PaymentPrint printDetails={printDetails} />
          </PrintModal> */}

            {/* <PaymentModal
              isVisible={showModalView}
              onClose={() => setShowModalView(false)}
              onReload={() => handleViewModalOpen(currentGroupId)}
              loading={loading}
            >
              <div className="py-6 px-5 lg:px-8 text-left">
                <form className="space-y-6" onSubmit={() => {}} noValidate>
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="email"
                    >
                      Group
                    </label>
                    <input
                      type="text"
                      name="group_id"
                      value={currentViewGroup?.group_id?.group_name}
                      onChange={() => {}}
                      id="name"
                      placeholder="Enter the Group Name"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                    />
                  </div>
                  <div className="flex flex-row justify-between space-x-4">
                    <div className="w-1/2">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="group_value"
                      >
                        Group Value
                      </label>
                      <input
                        type="text"
                        name="group_value"
                        value={currentViewGroup?.group_id?.group_value}
                        id="group_value"
                        placeholder="select group to check"
                        readOnly
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="group_install"
                      >
                        Group Installment
                      </label>
                      <input
                        type="text"
                        name="group_install"
                        value={currentViewGroup?.group_id?.group_install}
                        id="group_install"
                        placeholder="select group to check"
                        readOnly
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="email"
                    >
                      User
                    </label>
                    <input
                      type="text"
                      name="group_id"
                      value={`${currentViewGroup?.user_id?.full_name} | ${currentViewGroup?.ticket}`}
                      onChange={() => {}}
                      id="name"
                      placeholder="Enter the User Name"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                    />
                  </div>

                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="email"
                    >
                      Bid Amount
                    </label>
                    <input
                      type="number"
                      name="bid_amount"
                      value={
                        currentViewGroup?.group_id?.group_value -
                        currentViewGroup?.win_amount
                      }
                      onChange={() => {}}
                      id="name"
                      placeholder="Enter the Bid Amount"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                    />
                  </div>
                  <div className="flex flex-row justify-between space-x-4">
                    <div className="w-1/2">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="group_value"
                      >
                        Commission
                      </label>
                      <input
                        type="text"
                        name="commission"
                        value={currentViewGroup?.commission}
                        id="commission"
                        placeholder=""
                        readOnly
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="group_install"
                      >
                        Winning Amount
                      </label>
                      <input
                        type="text"
                        name="win_amount"
                        value={currentViewGroup?.win_amount}
                        id="win_amount"
                        placeholder=""
                        readOnly
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row justify-between space-x-4">
                    <div className="w-1/2">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="group_value"
                      >
                        Divident
                      </label>
                      <input
                        type="text"
                        name="divident"
                        value={currentViewGroup?.divident}
                        id="divident"
                        placeholder=""
                        readOnly
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="group_install"
                      >
                        Divident per Head
                      </label>
                      <input
                        type="text"
                        name="divident_head"
                        value={currentViewGroup?.divident_head}
                        id="divident_head"
                        placeholder=""
                        readOnly
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="group_install"
                      >
                        Next Payable
                      </label>
                      <input
                        type="text"
                        name="payable"
                        value={currentViewGroup?.payable}
                        id="payable"
                        placeholder=""
                        readOnly
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row justify-between space-x-4">
                    <div className="w-1/2">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="date"
                      >
                        Auction Date
                      </label>
                      <input
                        type="date"
                        name="auction_date"
                        value={currentViewGroup?.auction_date}
                        onChange={() => {}}
                        id="date"
                        placeholder="Enter the Date"
                        readOnly
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="date"
                      >
                        Next Date
                      </label>
                      <input
                        type="date"
                        name="next_date"
                        value={currentViewGroup?.next_date}
                        onChange={() => {}}
                        id="date"
                        placeholder="Enter the Date"
                        readOnly
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </PaymentModal> */}
            {/* <PaymentModal
  isVisible={showModalView}
  onClose={() => setShowModalView(false)}
  onReload={() => handleViewModalOpen(currentGroupId)}
  loading={loading}
> */}
            <AntModal
              open={showModalView}
              onCancel={() => setShowModalView(false)}
              onClose={() => setShowModalView(false)}
              onOk={() => setShowModalView(false)}
              onReload={() => handleViewModalOpen(currentGroupId)}
              footer={<div></div>}
              loading={viewLoader}
            >
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Payment Details
              </h3>
              <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-full p-2.5">
                <div className="mb-3 flex gap-x-2">
                  <strong>Group: </strong>{" "}
                  {currentViewGroup?.group_id?.group_name}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Group Value:</strong>{" "}
                  {currentViewGroup?.group_id?.group_value}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Group Installment:</strong>{" "}
                  {currentViewGroup?.group_id?.group_install}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>User:</strong> {currentViewGroup?.user_id?.full_name}{" "}
                  | Ticket: {currentViewGroup?.ticket}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Bid Amount:</strong>{" "}
                  {currentViewGroup?.group_id?.group_value -
                  currentViewGroup?.win_amount
                    ? currentViewGroup?.group_id?.group_value -
                      currentViewGroup?.win_amount
                    : ""}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Commission:</strong> {currentViewGroup?.commission}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Winning Amount:</strong>{" "}
                  {currentViewGroup?.win_amount}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Divident:</strong> {currentViewGroup?.divident}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Divident per Head:</strong>{" "}
                  {currentViewGroup?.divident_head}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Next Payable:</strong> {currentViewGroup?.payable}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Auction Date:</strong>{" "}
                  {currentViewGroup?.auction_date}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Next Date:</strong> {currentViewGroup?.next_date}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Created At:</strong>{" "}
                  {currentViewGroup?.createdAt?.split("T")[0]}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Updated At:</strong>{" "}
                  {currentViewGroup?.updatedAt?.split("T")[0]}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Cheque Number:</strong>{" "}
                  {currentViewGroup?.cheque_number}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Cheque Date:</strong>{" "}
                  {currentViewGroup?.cheque_date?.split("T")[0]}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Cheque Bank Name:</strong>{" "}
                  {currentViewGroup?.cheque_bank_name}
                </div>
                <div className="mb-3 flex gap-x-2">
                  <strong>Cheque Bank Branch Name :</strong>{" "}
                  {currentViewGroup?.cheque_bank_branch}
                </div>
              </div>
            </AntModal>
            {/* </PaymentModal> */}

            <Modal
              isVisible={showModalDelete}
              onClose={() => {
                setShowModalDelete(false);
                setCurrentGroup(null);
              }}
            >
              <div className="py-6 px-5 lg:px-8 text-left">
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Sure want to delete this Payment ?
                </h3>
                {currentGroup && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleDeleteAuction();
                    }}
                    className="space-y-6"
                  >
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
        </div>
      )}
    </>
  );
};

export default Payment;

// function ReceiptButton() {
//   return (
//     <div>
//       {/* Receipt Content */}
//       <div
//         id="receipt"
//         style={{
//           width: "210mm",
//           height: "297mm",
//           padding: "20mm",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//         }}
//       >
//         {/* Top Half */}
//         <div style={{ borderBottom: "1px solid black", height: "50%" }}>
//           <h2>Receipt - Part 1</h2>
//           <p>Details for the first part...</p>
//           <p>
//             <strong>Amount:</strong> $123.45
//           </p>
//           <p>
//             <strong>Date:</strong> 01/22/2025
//           </p>
//         </div>

//         {/* Bottom Half */}
//         <div style={{ height: "50%" }}>
//           <h2>Receipt - Part 2</h2>
//           <p>Details for the second part...</p>
//           <p>
//             <strong>Amount:</strong> $123.45
//           </p>
//           <p>
//             <strong>Date:</strong> 01/22/2025
//           </p>
//         </div>
//       </div>

//       {/* Button to Generate PDF */}
//       <button
//         onClick={() => handleUpdateModalOpen("example-id")}
//         className="border border-violet-400 text-white px-4 py-2 rounded-md shadow hover:border-violet-700 transition duration-200"
//       >
//         <BiPrinter color="violet" />
//       </button>
//     </div>
//   );
// }
