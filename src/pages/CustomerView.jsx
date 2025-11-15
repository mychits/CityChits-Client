/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CircularLoader from "../components/loaders/CircularLoader";
import { Select, Card } from "antd";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import Sidebar from "../components/layouts/Sidebar";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import Fuse from "fuse.js";
import { Collapse } from "antd";
const { Panel } = Collapse;
import { Tag } from "antd";
import { Modal } from "antd";
import { Tabs } from "antd";
const { TabPane } = Tabs;
import { Progress } from "antd";

import { Button, message } from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { BsCurrencyRupee } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiCreditCard,
  FiFileText,
  FiUsers,
  FiDollarSign,
} from "react-icons/fi";

const CustomerView = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [TableDaybook, setTableDaybook] = useState([]);
  const [TableAuctions, setTableAuctions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(userId ? userId : "");
  const [group, setGroup] = useState([]);
  const [commission, setCommission] = useState("");
  const [TableEnrolls, setTableEnrolls] = useState([]);
  const [TableEnrollsDate, setTableEnrollsDate] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [groupPaid, setGroupPaid] = useState("");
  const [groupToBePaid, setGroupToBePaid] = useState("");
  const [fromDate, setFromDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [lastPayments, setLastPayments] = useState([]);
  const [selectedDayBookGroup, setSelectedDayBookGroup] = useState(null);
  const [lastPayment, setLastPayment] = useState({ date: null, amount: 0 });
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);
  const GlobalSearchChangeHandler = (e) => {
    setSearchText(e.target.value);
  };
  const [toDate, setToDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [groupPaidDate, setGroupPaidDate] = useState("");
  const [groupToBePaidDate, setGroupToBePaidDate] = useState("");
  const [detailsLoading, setDetailLoading] = useState(false);
  const [basicLoading, setBasicLoading] = useState(false);
  const [dateLoading, setDateLoading] = useState(false);
  const [EnrollGroupId, setEnrollGroupId] = useState({
    groupId: "",
    ticket: "",
  });
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [registrationFee, setRegistrationFee] = useState({
    amount: 0,
    createdAt: null,
  });
  const [enrollmentDate, setEnrollmentDate] = useState(null);
  const [prizedStatus, setPrizedStatus] = useState("Unprized");
  const [visibleRows, setVisibleRows] = useState({
    row1: false,
    row2: false,
    row3: false,
    row4: false,
    row5: false,
    row6: false,
    row7: false,
    row8: false,
    row9: false,
  });
  const handleGroupClick = (auction) => {
    setSelectedGroupDetails(auction);
    setIsGroupModalOpen(true);
  };
  const calculateCustomerAge = (joiningDate) => {
    if (!joiningDate) return "—";
    const join = new Date(joiningDate);
    const today = new Date();
    if (join > today) {
      return "Invalid joining date";
    }
    let years = today.getFullYear() - join.getFullYear();
    let months = today.getMonth() - join.getMonth();
    let days = today.getDate() - join.getDate();
    if (days < 0) {
      months--;
      const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += prevMonthDays;
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years} years ${months} months ${days} days`;
  };
  const handleCloseModal = () => {
    setIsGroupModalOpen(false);
    setSelectedGroupDetails(null);
  };
  const formatEnrollDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const InfoBox = ({ label, value, icon }) => {
    return (
      <div className="flex flex-wrap gap-2 max-w-[calc(10*250px)]">
        <div className="flex flex-col w-[250px]">
          <span className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
            {icon && <span className="text-blue-600">{icon}</span>}
            {label}
          </span>
          <div className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-base font-medium text-gray-800 shadow-sm">
            {value || "—"}
          </div>
        </div>
      </div>
    );
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const handleUploadPhoto = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("profilephoto", selectedFile);
    try {
      const { data } = await api.put(`/user/update-user/${group._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Profile photo updated successfully!");
      if (data?.profilephoto) {
        setGroup((prev) => ({ ...prev, profilephoto: data.profilephoto }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
      message.error("Failed to upload photo");
    }
  };

  const StatBox = ({ label, value, icon, trend, isPositive }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-gray-600">
          {icon}
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
        </div>
        {trend && (
          <span className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {label === "Balance" && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${Number(value.replace(/[^\d.-]/g, '')) >= 0
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
            }`}>
            {Number(value.replace(/[^\d.-]/g, '')) >= 0 ? "Healthy" : "Overdue"}
          </span>
        )}
      </div>
    </div>
  );
  const [TotalToBepaid, setTotalToBePaid] = useState("");
  const [Totalpaid, setTotalPaid] = useState("");
  const [Totalprofit, setTotalProfit] = useState("");
  const [NetTotalprofit, setNetTotalProfit] = useState("");
  const [selectedAuctionGroupId, setSelectedAuctionGroupId] = useState(
    userId ? userId : ""
  );
  const [filteredAuction, setFilteredAuction] = useState([]);
  const [groupInfo, setGroupInfo] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState(
    userId ? userId : ""
  );
  const [payments, setPayments] = useState([]);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [screenLoading, setScreenLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [searchText, setSearchText] = useState("");
  const [groupDetails, setGroupDetails] = useState(" ");
  const [loanCustomers, setLoanCustomers] = useState([]);
  const [borrowersData, setBorrowersData] = useState([]);
  const [borrowerId, setBorrowerId] = useState("No");
  const [filteredBorrowerData, setFilteredBorrowerData] = useState([]);
  const [filteredDisbursement, setFilteredDisbursement] = useState([]);
  const [disbursementLoading, setDisbursementLoading] = useState(false);
  const [registrationAmount, setRegistrationAmount] = useState(null);
  const [registrationDate, setRegistrationDate] = useState(null);
  const [finalPaymentBalance, setFinalPaymentBalance] = useState(0);
  const onGlobalSearchChangeHandler = (e) => {
    setSearchText(e.target.value);
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const [formData, setFormData] = useState({
    group_id: "",
    user_id: "",
    ticket: "",
    receipt_no: "",
    pay_date: "",
    amount: "",
    pay_type: "cash",
    transaction_id: "",
  });
  const BasicLoanColumns = [
    { key: "id", header: "SL. NO" },
    { key: "pay_date", header: "Payment Date" },
    { key: "receipt_no", header: "Receipt No" },
    { key: "amount", header: "Amount" },
    { key: "pay_type", header: "Payment Type" },
    { key: "balance", header: "Balance" },
  ];
  const DisbursementColumns = [
    { key: "id", header: "SL. NO" },
    { key: "pay_date", header: "Disbursed Date" },
    { key: "transaction_date", header: "Transaction Date" },
    { key: "ticket", header: "Ticket" },
    { key: "amount", header: "Amount" },
    { key: "receipt_no", header: "Receipt No" },
    { key: "pay_type", header: "Payment Type" },
    { key: "disbursement_type", header: "Disbursement Type" },
    { key: "disbursed_by", header: "Disbursed By" },
    { key: "balance", header: "Balance" },
  ];
  useEffect(() => {
    const fetchAllEnrollments = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/enroll/get-by-user-id/${userId}`);
        if (response.data && response.data.length > 0) {
          const enrollmentsWithStatus = await Promise.all(
            response.data.map(async (enrollment) => {
              let prizedStatus = "Unprized";
              try {
                const auctionResponse = await api.get(
                  `/auction/get-auction-report-by-group/${enrollment.group._id}`
                );
                const isPrized = auctionResponse.data.some(
                  (auction) => auction.winner === userId
                );
                if (isPrized) {
                  prizedStatus = "Prized";
                }
              } catch (error) {
                console.error("Error fetching auction details for a group:", error);
              }
              return {
                ...enrollment,
                group_name: enrollment.group.group_name,
                enrollment_date: enrollment.createdAt,
                prizedStatus,
              };
            })
          );
          setUserEnrollments(enrollmentsWithStatus);
        } else {
          setUserEnrollments([]);
        }
      } catch (error) {
        console.error("Failed to fetch user enrollments:", error);
        setUserEnrollments([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) {
      fetchAllEnrollments();
    }
  }, [userId]);
  useEffect(() => {
    if (userId) {
      setIsLoadingPayment(true);
      api.get(`/payments`, {
        params: {
          customerId: userId,
          _sort: "date",
          _order: "desc",
          _limit: 1,
        },
      })
        .then(({ data }) => {
          setLastPayments(data);
          setIsLoadingPayment(false);
        })
        .catch(() => setIsLoadingPayment(false));
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setIsLoadingPayment(true);
      try {
        const { data } = await api.get("payment/get-last-n-transaction", {
          params: {
            user_id: userId,
            payment_group_tickets: [],
            limit: 1,
          },
        });
        if (!cancelled) {
          if (Array.isArray(data) && data.length > 0) {
            const p = data[0];
            setLastPayment({
              date: p?.pay_date ? p.pay_date.split("T")[0] : null,
              amount: Number(p?.amount || 0),
            });
          } else {
            setLastPayment({ date: null, amount: 0 });
          }
        }
      } catch (err) {
        console.error("Error fetching last payment:", err);
        if (!cancelled) setLastPayment({ date: null, amount: 0 });
      } finally {
        if (!cancelled) setIsLoadingPayment(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);
  useEffect(() => {
    const fetchRegistrationFee = async () => {
      if (
        activeTab === "daybook" &&
        selectedGroup &&
        EnrollGroupId.groupId &&
        EnrollGroupId.ticket &&
        EnrollGroupId.groupId !== "Loan"
      ) {
        try {
          setTableEnrolls([]);
          setGroupPaid("");
          setGroupToBePaid("");
          setRegistrationAmount(null);
          setRegistrationDate(null);
          setBasicLoading(true);
          setIsLoading(true);
          const response = await api.get(
            "/enroll/get-user-registration-fee-report",
            {
              params: {
                group_id: EnrollGroupId.groupId,
                ticket: EnrollGroupId.ticket,
                user_id: selectedGroup,
              },
            }
          );
          const { payments = [], registrationFees = [] } = response.data || {};
          setGroupPaid(payments[0]?.groupPaidAmount || 0);
          setGroupToBePaid(payments[0]?.totalToBePaidAmount || 0);
          let balance = 0;
          const formattedData = payments.map((payment, index) => {
            balance += Number(payment.amount || 0);
            return {
              _id: payment._id,
              id: index + 1,
              date: formatPayDate(payment?.pay_date),
              amount: payment.amount,
              receipt: payment.receipt_no,
              old_receipt: payment.old_receipt_no,
              type: payment.pay_type,
              balance,
            };
          });
          let totalRegAmount = 0;
          registrationFees.forEach((regFee, idx) => {
            formattedData.push({
              id: "-",
              date: regFee.createdAt
                ? new Date(regFee.createdAt).toLocaleDateString("en-GB")
                : "",
              amount: regFee.amount,
              receipt: regFee.receipt_no,
              old_receipt: "-",
              type: regFee.pay_for || "Reg Fee",
              balance: "-",
            });
            totalRegAmount += Number(regFee.amount || 0);
          });
          setRegistrationAmount(totalRegAmount);
          if (registrationFees.length > 0) {
            setRegistrationDate(
              registrationFees[0]?.createdAt
                ? new Date(registrationFees[0].createdAt).toLocaleDateString("en-GB")
                : null
            );
          }
          if (formattedData.length > 0) {
            formattedData.push({
              id: "",
              date: "",
              amount: "",
              receipt: "",
              old_receipt: "",
              type: "TOTAL",
              balance,
            });
            setFinalPaymentBalance(balance);
          } else {
            setFinalPaymentBalance(0);
          }
          setTableEnrolls(formattedData);
        } catch (error) {
          console.error("Error fetching registration fee and payments:", error);
          setTableEnrolls([]);
          setGroupPaid("");
          setGroupToBePaid("");
          setRegistrationAmount(null);
          setRegistrationDate(null);
        } finally {
          setBasicLoading(false);
          setIsLoading(false);
        }
      } else {
        setTableEnrolls([]);
        setGroupPaid("");
        setGroupToBePaid("");
        setRegistrationAmount(null);
        setRegistrationDate(null);
      }
    };
    fetchRegistrationFee();
  }, [activeTab, selectedGroup, EnrollGroupId.groupId, EnrollGroupId.ticket]);
  useEffect(() => {
    const fetchLastPayment = async () => {
      if (!userId) return;
      setIsLoadingPayment(true);
      try {
        const response = await api.get("/user/get-daily-payments");
        const rawData = response.data;
        let latestPayment = { date: null, amount: null };
        for (const user of rawData) {
          if (user?._id === userId && user?.data) {
            for (const item of user.data) {
              const pay = item.payments;
              if (pay?.latestPaymentDate && pay?.latestPaymentAmount) {
                latestPayment = {
                  date: pay.latestPaymentDate,
                  amount: pay.latestPaymentAmount,
                };
              }
            }
          }
        }
        setLastPayment(latestPayment);
      } catch (error) {
        console.error("Error fetching last payment details:", error);
        setLastPayment({ date: "N/A", amount: "N/A" });
      } finally {
        setIsLoadingPayment(false);
      }
    };
    fetchLastPayment();
  }, [userId]);
  useEffect(() => {
    const fetchAllLoanPaymentsbyId = async () => {
      setBorrowersData([]);
      setBasicLoading(true);
      try {
        const response = await api.get(
          `/loan-payment/get-all-loan-payments/${EnrollGroupId.ticket}`
        );
        if (response.data && response.data.length > 0) {
          let balance = 0;
          const formattedData = response.data.map((loanPayment, index) => {
            balance += Number(loanPayment.amount);
            return {
              _id: loanPayment._id,
              id: index + 1,
              pay_date: formatPayDate(loanPayment?.pay_date),
              amount: loanPayment.amount,
              receipt_no: loanPayment.receipt_no,
              pay_type: loanPayment.pay_type,
              balance,
            };
          });
          formattedData.push({
            _id: "",
            id: "",
            pay_date: "",
            receipt_no: "",
            amount: "",
            pay_type: "",
            balance,
          });
          setBorrowersData(formattedData);
        } else {
          setBorrowersData([]);
        }
      } catch (error) {
        console.error("Error fetching loan payment ", error);
        setBorrowersData([]);
      } finally {
        setBasicLoading(false);
      }
    };
    if (EnrollGroupId.groupId === "Loan") fetchAllLoanPaymentsbyId();
  }, [EnrollGroupId.ticket]);
  useEffect(() => {
    if (selectedGroup) {
      const fetchGroupDetails = async () => {
        setDetailLoading(true);
        try {
          const response = await api.get(
            `/enroll/get-by-id-enroll/${selectedGroup}`
          );
          if (response.data) {
            setEnrollmentDate(response.data.createdAt);
          }
          const groupDataResponse = await api.get(
            `/group/get-by-id-group/${selectedGroup}`
          );
          setGroupInfo(groupDataResponse.data);
        } catch (error) {
          console.error("Error fetching group details:", error);
        } finally {
          setDetailLoading(false);
        }
      };
      const fetchAuctionDetails = async () => {
        try {
          const auctionResponse = await api.get(
            `/auction/get-auction-report-by-group/${selectedGroup}`
          );
          const isPrized = auctionResponse.data.some(
            (auction) => auction.winner === userId
          );
          setPrizedStatus(isPrized ? "Prized" : "Unprized");
        } catch (error) {
          console.error("Error fetching auction details:", error);
          setPrizedStatus("Unprized");
        }
      };
      fetchGroupDetails();
      fetchAuctionDetails();
    }
  }, [selectedGroup, userId]);
  useEffect(() => {
    const fetchGroupById = async () => {
      try {
        const response = await api.get(
          `/group/get-by-id-group/${EnrollGroupId.groupId}`
        );
        if (response.status >= 400) throw new Error("API ERROR");
        setGroupDetails(response.data);
      } catch (err) {
        console.log("Failed to fetch group details by ID:", err.message);
      }
    };
    if (EnrollGroupId.groupId !== "Loan") fetchGroupById();
  }, [EnrollGroupId?.ticket]);
  useEffect(() => {
    setScreenLoading(true);
    const fetchGroups = async () => {
      setDetailLoading(true);
      try {
        const response = await api.get("/user/get-user");
        setGroups(response.data);
        setScreenLoading(false);
        setDetailLoading(false);
      } catch (error) {
        console.error("Error fetching group ", error);
      } finally {
        setDetailLoading(false);
      }
    };
    fetchGroups();
  }, []);
  useEffect(() => {
    const fetchBorrower = async () => {
      try {
        setLoanCustomers([]);
        const response = await api.get(
          `/loans/get-borrower-by-user-id/${selectedGroup}`
        );
        if (response.data) {
          const filteredBorrowerData = response.data.map((loan, index) => ({
            sl_no: index + 1,
            loan: loan.loan_id,
            loan_amount: loan.loan_amount,
            tenure: loan.tenure,
            service_charge: loan.service_charges,
          }));
          setFilteredBorrowerData(filteredBorrowerData);
        }
        setLoanCustomers(response.data);
        if (response.status >= 400) throw new Error("Failed to send message");
      } catch (err) {
        console.log("failed to fetch loan customers", err.message);
        setFilteredBorrowerData([]);
      }
    };
    setBorrowersData([]);
    setBorrowerId("No");
    fetchBorrower();
  }, [selectedGroup]);
  useEffect(() => {
    const fetchGroupById = async () => {
      try {
        const response = await api.get(`/user/get-user-by-id/${selectedGroup}`);
        setGroup(response.data);
      } catch (error) {
        console.error("Error fetching group ", error);
      }
    };
    fetchGroupById();
  }, [selectedGroup]);
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/user/get-user");
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching group ", error);
      }
    };
    fetchGroups();
  }, []);
  useEffect(() => {
    const fetchDisbursement = async () => {
      try {
        setDisbursementLoading(true);
        const response = await api.get(
          `/payment-out/get-payment-out-report-daybook`,
          {
            params: {
              userId: selectedGroup,
            },
          }
        );
        if (response.data) {
          const formattedData = response.data.map((payment, index) => {
            let balance = 0;
            balance += Number(payment.amount);
            return {
              _id: payment._id,
              id: index + 1,
              disbursement_type: payment.disbursement_type,
              pay_date: formatPayDate(payment?.pay_date),
              ticket: payment.ticket,
              transaction_date: formatPayDate(payment.createdAt),
              amount: payment.amount,
              receipt_no: payment.receipt_no,
              pay_type: payment.pay_type,
              disbursed_by: payment.admin_type?.name,
              balance,
            };
          });
          setFilteredDisbursement(formattedData);
        } else {
          setFilteredDisbursement([]);
        }
      } catch (error) {
        console.error("Error fetching disbursement data", error, error.message);
        setFilteredDisbursement([]);
      } finally {
        setDisbursementLoading(false);
      }
    };
    if (selectedGroup) fetchDisbursement();
  }, [selectedGroup]);
  const handleGroupPayment = async (groupId) => {
    setSelectedAuctionGroupId(groupId);
    setSelectedGroup(groupId);
    handleGroupAuctionChange(groupId);
  };

  const [statsLoading, setStatsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setStatsLoading(true);
      if (userId) {
        try {
          await handleGroupAuctionChange(userId);
        } catch (error) {
          console.error("Error in initial fetch:", error);
        } finally {
          setStatsLoading(false);
        }
      } else {
        setStatsLoading(false);
      }
    };
    fetchData();
  }, [userId]);
  const handleEnrollGroup = (event) => {
    const value = event.target.value;
    if (value) {
      const [groupId, ticket] = value.split("|");
      setEnrollGroupId({ groupId, ticket });
    } else {
      setEnrollGroupId({ groupId: "", ticket: "" });
    }
  };
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get(`/payment/get-report-daybook`, {
          params: {
            pay_date: selectedDate,
            groupId: selectedAuctionGroupId,
            userId: selectedCustomers,
            pay_type: selectedPaymentMode,
          },
        });
        if (response.data && response.data.length > 0) {
          setFilteredAuction(response);
          const paymentData = response.data;
          const totalAmount = paymentData.reduce(
            (sum, payment) => sum + Number(payment.amount || 0),
            0
          );
          setPayments(totalAmount);
          const formattedData = response.data.map((group, index) => ({
            id: index + 1,
            group: group.group_id.group_name,
            name: group.user_id?.full_name,
            phone_number: group.user_id.phone_number,
            ticket: group.ticket,
            amount: group.amount,
            mode: group.pay_type,
          }));
          setTableDaybook(formattedData);
        } else {
          setFilteredAuction([]);
        }
      } catch (error) {
        console.error("Error fetching payment ", error);
        setFilteredAuction([]);
        setPayments(0);
      }
    };
    fetchPayments();
  }, [
    selectedAuctionGroupId,
    selectedDate,
    selectedPaymentMode,
    selectedCustomers,
  ]);
  const loanColumns = [
    { key: "sl_no", header: "SL. No" },
    { key: "loan", header: "Loan ID" },
    { key: "loan_amount", header: "Loan Amount" },
    { key: "service_charge", header: "Service Charge" },
    { key: "tenure", header: "Tenure" },
  ];
  const columns = [
    { key: "id", header: "SL. NO" },
    { key: "group", header: "Group Name" },
    { key: "name", header: "Customer Name" },
    { key: "phone_number", header: "Customer Phone Number" },
    { key: "ticket", header: "Ticket" },
    { key: "amount", header: "Amount" },
    { key: "mode", header: "Payment Mode" },
  ];
  const handleGroupAuctionChange = async (groupId) => {
    setFilteredAuction([]);
    if (groupId) {
      try {
        const response = await api.post(
          `/enroll/get-user-refer-report/${groupId}`
        );
        if (response.data && response.data.length > 0) {
          setFilteredAuction(response.data);
          const formattedData = response.data
            .map((group, index) => {
              const groupName = group?.enrollment?.group?.group_name || "";
              const tickets = group?.enrollment?.tickets || "";
              const groupType = group?.enrollment?.group?.group_type;
              const groupInstall =
                parseInt(group?.enrollment?.group?.group_install) || 0;
              const auctionCount = parseInt(group?.auction?.auctionCount) || 0;
              const totalPaidAmount = group?.payments?.totalPaidAmount || 0;
              const totalProfit = group?.profit?.totalProfit || 0;
              const totalPayable = group?.payable?.totalPayable || 0;
              const firstDividentHead =
                group?.firstAuction?.firstDividentHead || 0;
              if (!group?.enrollment?.group) {
                return null;
              }
              return {
                id: index + 1,
                group_id: group?.enrollment?.group?._id,
                group_name: groupName,
                ticket: tickets,
                group_type: groupType,
                group_value: group?.enrollment?.group?.group_value || 0,
                date: group?.enrollment?.createdAt
                  ? new Date(group.enrollment.createdAt).toLocaleDateString(
                    "en-GB"
                  )
                  : "N/A",
                status: group?.enrollment?.status || "Active",
                totalBePaid:
                  groupType === "double"
                    ? groupInstall * auctionCount + groupInstall
                    : totalPayable + groupInstall + totalProfit,
                profit: totalProfit,
                toBePaidAmount:
                  groupType === "double"
                    ? groupInstall * auctionCount + groupInstall
                    : totalPayable + groupInstall + firstDividentHead,
                paidAmount: totalPaidAmount,
                balance:
                  groupType === "double"
                    ? groupInstall * auctionCount +
                    groupInstall -
                    totalPaidAmount
                    : totalPayable +
                    groupInstall +
                    firstDividentHead -
                    totalPaidAmount,
                referred_type: group?.enrollment?.referred_type || "N/A",
                referrer_name: group?.enrollment?.referrer_name || "N/A",
              };
            })
            .filter((item) => item !== null);
          setTableAuctions(formattedData);
          setCommission(0);
          const totalToBePaidAmount = formattedData.reduce((sum, group) => {
            return sum + (group?.totalBePaid || 0);
          }, 0);
          setTotalToBePaid(totalToBePaidAmount);
          const totalNetToBePaidAmount = formattedData.reduce((sum, group) => {
            return sum + (group?.toBePaidAmount || 0);
          }, 0);
          setNetTotalProfit(totalNetToBePaidAmount);
          const totalPaidAmount = response.data.reduce(
            (sum, group) => sum + (group?.payments?.totalPaidAmount || 0),
            0
          );
          setTotalPaid(totalPaidAmount);
          const totalProfit = response.data.reduce(
            (sum, group) => sum + (group?.profit?.totalProfit || 0),
            0
          );
          setTotalProfit(totalProfit);
        } else {
          setFilteredAuction([]);
          setCommission(0);
        }
      } catch (error) {
        console.error("Error fetching enrollment ", error);
        setFilteredAuction([]);
        setCommission(0);
      }
    } else {
      setFilteredAuction([]);
      setCommission(0);
    }
  };
  useEffect(() => {
    if (userId) {
      handleGroupAuctionChange(userId);
    }
  }, []);
  const Auctioncolumns = [
    { key: "id", header: "SL. NO" },
    { key: "group", header: "Group Name" },
    { key: "ticket", header: "Ticket" },
    { key: "referred_type", header: "Referrer Type" },
    { key: "referrer_name", header: "Referred By" },
    { key: "totalBePaid", header: "Amount to be Paid" },
    { key: "profit", header: "Profit" },
    { key: "toBePaidAmount", header: "Net To be Paid" },
    { key: "paidAmount", header: "Amount Paid" },
    { key: "balance", header: "Balance" },
  ];
  const formatPayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };
  useEffect(() => {
    const fetchEnroll = async () => {
      setTableEnrolls([]);
      setBasicLoading(true);
      try {
        setIsLoading(true);
        const response = await api.get(
          `/enroll/get-user-payment?group_id=${EnrollGroupId.groupId}&ticket=${EnrollGroupId.ticket}&user_id=${selectedGroup}`
        );
        if (response.data && response.data.length > 0) {
          setFilteredUsers(response.data);
          const Paid = response.data;
          setGroupPaid(Paid[0].groupPaidAmount);
          const toBePaid = response.data;
          setGroupToBePaid(toBePaid[0].totalToBePaidAmount);
          let balance = 0;
          const formattedData = response.data.map((group, index) => {
            balance += Number(group.amount);
            return {
              _id: group._id,
              id: index + 1,
              date: formatPayDate(group?.pay_date),
              amount: group.amount,
              receipt: group.receipt_no,
              old_receipt: group.old_receipt_no,
              type: group.pay_type,
              balance,
            };
          });
          formattedData.push({
            id: "",
            date: "",
            amount: "",
            receipt: "",
            old_receipt: "",
            type: "",
            balance,
          });
          setTableEnrolls(formattedData);
        } else {
          setFilteredUsers([]);
          setTableEnrolls([]);
        }
      } catch (error) {
        console.error("Error fetching enrollment ", error);
        setFilteredUsers([]);
        setTableEnrolls([]);
      } finally {
        setBasicLoading(false);
        setIsLoading(false);
      }
    };
    if (EnrollGroupId.groupId !== "Loan") fetchEnroll();
  }, [selectedGroup, EnrollGroupId.groupId, EnrollGroupId.ticket]);
  const Basiccolumns = [
    { key: "id", header: "SL. NO" },
    { key: "date", header: "Date" },
    { key: "amount", header: "Amount" },
    { key: "receipt", header: "Receipt No" },
    { key: "old_receipt", header: "Old Receipt No" },
    { key: "type", header: "Payment Type" },
    { key: "balance", header: "Balance" },
  ];
  const formatDate = (dateString) => {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };
  const formattedFromDate = formatDate(fromDate);
  const formattedToDate = formatDate(toDate);
  useEffect(() => {
    const fetchEnroll = async () => {
      try {
        const response = await api.get(
          `/group-report/get-group-enroll-date/${selectedGroup}?fromDate=${formattedFromDate}&toDate=${formattedToDate}`
        );
        if (response.data && response.data.length > 0) {
          setFilteredUsers(response.data);
          const Paid = response.data;
          setGroupPaidDate(Paid[0].groupPaidAmount || 0);
          const toBePaid = response.data;
          setGroupToBePaidDate(toBePaid[0].totalToBePaidAmount);
          const totalAmount = response.data.reduce(
            (sum, group) => sum + parseInt(group.amount),
            0
          );
          setTotalAmount(totalAmount);
          const formattedData = response.data.map((group, index) => ({
            id: index + 1,
            name: group?.user?.full_name,
            phone_number: group?.user?.phone_number,
            ticket: group.ticket,
            amount_to_be_paid:
              parseInt(group.group.group_install) + group.totalToBePaidAmount,
            amount_paid: group.totalPaidAmount,
            amount_balance:
              parseInt(group.group.group_install) +
              group.totalToBePaidAmount -
              group.totalPaidAmount,
          }));
          setTableEnrollsDate(formattedData);
        } else {
          setFilteredUsers([]);
          setTotalAmount(0);
        }
      } catch (error) {
        console.error("Error fetching enrollment ", error);
        setFilteredUsers([]);
        setTotalAmount(0);
      }
    };
    fetchEnroll();
  }, [selectedGroup, formattedFromDate, formattedToDate]);
  const Datecolumns = [
    { key: "id", header: "SL. NO" },
    { key: "name", header: "Customer Name" },
    { key: "phone_number", header: "Customer Phone Number" },
    { key: "ticket", header: "Ticket" },
    { key: "amount_to_be_paid", header: "Amount to be Paid" },
    { key: "amount_paid", header: "Amount Paid" },
    { key: "amount_balance", header: "Amount Balance" },
  ];
  useEffect(() => {
    if (groupInfo && formData.bid_amount) {
      const commission = (groupInfo.group_value * 5) / 100 || 0;
      const win_amount =
        (groupInfo.group_value || 0) - (formData.bid_amount || 0);
      const divident = (formData.bid_amount || 0) - commission;
      const divident_head = groupInfo.group_members
        ? divident / groupInfo.group_members
        : 0;
      const payable = (groupInfo.group_install || 0) - divident_head;
      setFormData((prevData) => ({
        ...prevData,
        group_id: groupInfo._id,
        commission,
        win_amount,
        divident,
        divident_head,
        payable,
      }));
    }
  }, [groupInfo, formData.bid_amount]);
  useEffect(() => {
    if (selectedGroup) {
      api
        .post(`/enroll/get-next-tickets/${selectedGroup}`)
        .then((response) => {
          setAvailableTickets(response.data.availableTickets || []);
        })
        .catch((error) => {
          console.error("Error fetching available tickets:", error);
        });
    } else {
      setAvailableTickets([]);
    }
  }, [selectedGroup]);

  const hasDetailsData = () =>
    group.full_name ||
    group.customer_id ||
    group.phone_number ||
    group.email ||
    group.gender ||
    group.dateofbirth ||
    group.marital_status ||
    TableAuctions.some((a) => a.referred_type !== "N/A" || a.referrer_name !== "N/A");
  const hasAddressData = () =>
    group.address ||
    group.pincode ||
    group.district ||
    group.state ||
    group.nationality;
  const hasBankData = () =>
    group.bank_name ||
    group.bank_branch_name ||
    group.bank_account_number ||
    group.bank_IFSC_code;
  const hasDocsData = () => group.adhaar_no || group.pan_no;
  const hasGroupsData = () => TableAuctions.length > 0;

  const TabTooltip = ({ children, visible }) => (
    <div
      className={`absolute left-0 -top-1 w-[calc(10*250px)] bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-300 ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      style={{ transformOrigin: 'top' }}
    >
      <div className="p-3 border-b border-gray-100 bg-gray-50">
        <span className="text-sm font-semibold text-gray-700">Preview</span>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-4 max-w-[calc(10*250px)]">
          {children}
        </div>
      </div>
      <div className="absolute top-full left-6 w-3 h-3 bg-white border-l border-b border-gray-200 rotate-45 transform -translate-x-1"></div>
    </div>
  );
  if (screenLoading)
    return (
      <div className="w-screen m-24">
        <CircularLoader color="text-green-600" />
      </div>
    );
  return (
    <>
      <div className="w-screen min-h-screen mt-20 bg-gray-50">
        <div className="flex mt-20">
          <Sidebar
            navSearchBarVisibility={true}
            onGlobalSearchChangeHandler={GlobalSearchChangeHandler}
          />
          <div className="flex-grow p-8 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
              <div className="bg-white px-6 py-4">
                <h1 className="text-2xl text-custom-violet font-bold ">Customer Profile</h1>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1 flex flex-col items-center">
                    <div className="relative w-52 h-52  rounded-3xl overflow-hidden border-4 border-violet-200 shadow-lg bg-gray-50">
                      <img
                        src={
                          selectedFile
                            ? URL.createObjectURL(selectedFile)
                            : group.profilephoto || "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-gray-800 text-center">
                      {group.full_name || "Unnamed"}
                    </h2>
                    <p className="text-sm pt-3 text-gray-600 text-center">
                      <span className="font-bold">ID:</span> {group.customer_id || "—"}
                    </p>
                    <div className="mt-3 flex justify-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiPhone size={16} /> {group.phone_number || "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMail size={16} /> {group.email || "—"}
                      </span>
                    </div>
                  </div>
                  <div className="lg:col-span-3">
                    {statsLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <CircularLoader color="text-violet-600" size="lg" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                        {[
                          {
                            label: "TOTAL GROUPS",
                            value: TableAuctions ? [...new Set(TableAuctions.map(item => item.group_id))].length || 0 : 0, // Calculate unique groups
                            icon: <FiUsers className="text-violet-600" />, // Or use a different icon if preferred, e.g., <FiFolder className="text-violet-600" />
                          },
                          {
                            label: "TOTAL TICKETS",
                            value: TableAuctions?.length || 0,
                            icon: <FiUsers className="text-violet-600" />,
                          },
                          {
                            label: "JOINED ON",
                            value: group?.createdAt
                              ? new Date(group.createdAt).toLocaleDateString("en-GB")
                              : "—",
                            icon: <SlCalender className="text-violet-600" />,
                          },
                          {
                            label: "CUSTOMER TENURE",
                            value: calculateCustomerAge(group?.createdAt),
                            icon: <FiCalendar className="text-violet-600" />,
                          },
                          {
                            label: "CUSTOMER STATUS",
                            value: (() => {
                              const lastPaymentDate = lastPayment?.date
                                ? new Date(lastPayment.date)
                                : null;
                              const threeMonthsAgo = new Date();
                              threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                              if (!lastPaymentDate || lastPaymentDate < threeMonthsAgo) {
                                return "Inactive";
                              }
                              return "Active";
                            })(),
                            icon: <FiUser className="text-violet-600" />,
                          },

                       {
                            label: "APPROVAL STATUS",
                            value: group?.approval_status === "true"
                              ? "Approved"
                              : group?.approval_status === "false"
                              ? "Pending"
                              : "Approved", 
                            icon: <FiCheckCircle className="text-violet-600" />,
                          },

                          {
                            label: "TOTAL  TO BE PAID",
                            value: ` ${(NetTotalprofit || 0).toLocaleString("en-IN")}`,
                            icon: <BsCurrencyRupee className="text-violet-600" />,
                          },
                          {
                            label: "TOTAL PAID",
                            value: ` ${(Totalpaid || 0).toLocaleString("en-IN")}`,
                            icon: <BsCurrencyRupee className="text-violet-600" />,
                          },
                          {
                            label: " TOTAL BALANCE",
                            value: ` ${(NetTotalprofit && Totalpaid) ? Number(NetTotalprofit - Totalpaid).toLocaleString("en-IN") : 0}`,
                            icon: <BsCurrencyRupee className="text-violet-600" />,
                          },
                          {
                            label: "TOTAL PROFIT",
                            value: ` ${(Totalprofit || 0).toLocaleString("en-IN")}`,
                            icon: <BsCurrencyRupee className="text-violet-600" />,
                          },

                          // {
                          //   label: "LATEST PAYMENT",
                          //   value: isLoadingPayment
                          //     ? <CircularLoader color="text-violet-600" size="sm" />
                          //     : lastPayment?.amount
                          //       ? `${(lastPayment.amount || 0).toLocaleString("en-IN")} `
                          //       : 0,  
                          //        icon: <BsCurrencyRupee className="text-violet-600" />,
                          // },

                          // {
                          //   label: "LATEST PAYMENT DATE",
                          //   value: isLoadingPayment
                          //     ? <CircularLoader color="text-violet-600" size="sm" />
                          //     : lastPayment?.date
                          //       ? ` ${new Date(lastPayment.date).toLocaleDateString("en-GB")}`
                          //       : 0,
                          //   icon: <SlCalender className="text-violet-600" />,
                          // },
                          {
                            label: "LATEST PAYMENT",
                            value: isLoadingPayment ? (
                              <CircularLoader color="text-violet-600" size="sm" />
                            ) : lastPayment?.amount || lastPayment?.date ? (
                              <div className="flex flex-col items-start gap-0.5">
                                <span className="font-bold text-gray-900 text-lg">
                                  ₹{(lastPayment.amount || 0).toLocaleString("en-IN")}
                                </span>
                                <span className="font-bold text-gray-900 text-lg mt-1">
                                  {lastPayment.date
                                    ? new Date(lastPayment.date).toLocaleDateString("en-GB")
                                    : "—"}
                                </span>
                              </div>
                            ) : (
                              "—"
                            ),
                            icon: <BsCurrencyRupee className="text-violet-600" />,
                          },
                          {
                            label: "LATEST DISBURSEMENT",
                            value: detailsLoading
                              ? <CircularLoader color="text-violet-600" size="sm" />
                              : ` ${Number(groupPaid || 0).toLocaleString("en-IN")}`,
                            icon: <BsCurrencyRupee className="text-violet-600" />,
                          },
                        ].map((stat, idx) => (
                          <div
                            key={idx}
                            className="bg-gradient-to-br from-violet-50 to-white rounded-xl shadow-md p-5 flex flex-col gap-3 border border-violet-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-violet-700 tracking-wide uppercase">
                                {stat.label}
                              </span>
                              <div className="bg-violet-100 p-2 rounded-lg shadow-sm">
                                {stat.icon}
                              </div>
                            </div>
                            <div
                              className="text-lg font-bold text-gray-900 break-words whitespace-pre-wrap w-full"
                              style={{ wordBreak: "break-word" }}
                            >
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 relative">
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <button
                      className={`px-5 py-2.5  rounded-lg font-medium transition-all duration-200 ${activeTab === "groupDetails"
                        ? "bg-custom-violet text-white shadow"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      onClick={() => setActiveTab("groupDetails")}
                    >
                      Details
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      className={`px-5 py-2.5  rounded-lg font-medium transition-all duration-200  ${activeTab === "address"
                        ? "bg-custom-violet text-white shadow"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      onClick={() => setActiveTab("address")}
                    >
                      Address
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === "docs"
                        ? "bg-custom-violet text-white shadow"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      onClick={() => setActiveTab("docs")}
                    >
                      Documents
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === "bank"
                        ? "bg-custom-violet text-white shadow"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      onClick={() => setActiveTab("bank")}
                    >
                      Bank Info
                    </button>
                  </div>
                  <button
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === "groups"
                      ? "bg-custom-violet text-white shadow"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    onClick={() => setActiveTab("groups")}
                  >
                    Groups
                  </button>
                  <button
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === "daybook"
                      ? "bg-custom-violet text-white shadow"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    onClick={() => setActiveTab("daybook")}
                  >
                    Ledger
                  </button>
                </div>
              </div>
              <div className="p-6 pt-8">
                {activeTab === "groupDetails" && (
                  <div className="flex flex-wrap  gap-2">
                    <InfoBox
                      label="Full Name"
                      value={group.full_name}
                      icon={<FiUser />}
                    />
                    <InfoBox
                      label="Customer ID"
                      value={group.customer_id}
                      icon={<FiCreditCard />}
                    />
                    <InfoBox
                      label="Phone Number"
                      value={group.phone_number}
                      icon={<FiPhone />}
                    />
                    <InfoBox
                      label="Email"
                      value={group.email}
                      icon={<FiMail />}
                    />
                    <InfoBox
                      label="Gender"
                      value={group.gender}
                      icon={<FiUsers />}
                    />
                    <InfoBox
                      label="Date of Birth"
                      value={group.dateofbirth}
                      icon={<FiCalendar />}
                    />

                    <InfoBox
                      label="Referred Types"
                      value={[...new Set(TableAuctions.map((item) => item.referred_type || "N/A"))].join(", ")}
                      icon={<FiUsers />}
                    />
                    <InfoBox
                      label="Referred By"
                      value={[...new Set(TableAuctions.map((item) => item.referrer_name || "N/A"))].join(", ")}
                      icon={<FiUsers />}
                    />

                    <InfoBox
                      label="Collection Area"
                      value={group?.collection_area?.route_name || "—"}
                      icon={<FiMapPin />}
                    />

                    <InfoBox
                      label="Collection Executive"
                      value={
                        group?.collection_executive
                          ? `${group?.collection_executive?.name} | ${group?.collection_executive?.phone_number}`
                          : "—"
                      }
                      icon={<FiUsers />}
                    />

                  </div>
                )}
                {activeTab === "address" && (
                  <div className="flex flex-wrap gap-2">
                    <InfoBox
                      label="Address line 1"
                      value={group.address}
                      icon={<FiMapPin />}
                    />
                    <InfoBox
                      label="Address line 2"
                      value={""}
                      icon={<FiMapPin />}
                    />
                    <InfoBox
                      label="Pincode"
                      value={group.pincode}
                      icon={<FiMapPin />}
                    />
                    <InfoBox
                      label="District"
                      value={group.district}
                      icon={<FiMapPin />}
                    />
                    <InfoBox
                      label="State"
                      value={group.state}
                      icon={<FiMapPin />}
                    />
                    <InfoBox
                      label="Nationality"
                      value={group.nationality}
                      icon={<FiMapPin />}
                    />
                  </div>
                )}
                {activeTab === "bank" && (
                  <div className="flex flex-wrap gap-2">
                    <InfoBox
                      label="Bank Name"
                      value={group.bank_name}
                      icon={<FiCreditCard />}
                    />
                    <InfoBox
                      label="Branch Name"
                      value={group.bank_branch_name}
                      icon={<FiCreditCard />}
                    />
                    <InfoBox
                      label="Account Number"
                      value={group.bank_account_number}
                      icon={<FiCreditCard />}
                    />
                    <InfoBox
                      label="IFSC Code"
                      value={group.bank_IFSC_code}
                      icon={<FiCreditCard />}
                    />
                  </div>
                )}

                {activeTab === "docs" && (
                  <div className="space-y-6">
                    {/* Aadhaar & PAN Numbers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoBox
                        label="Aadhaar Number"
                        value={group.adhaar_no}
                        icon={<FiFileText />}
                      />
                      <InfoBox
                        label="PAN Number"
                        value={group.pan_no}
                        icon={<FiFileText />}
                      />
                    </div>

                    {/* Progress + Documents Side by Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Document Completion */}
                      {(() => {
                        const docs = [
                          group.aadhar_frontphoto,
                          group.aadhar_backphoto,
                          group.pan_frontphoto,
                          group.pan_backphoto,
                        ];
                        const uploaded = docs.filter((doc) => doc && doc !== "null").length;
                        const total = docs.length;
                        const percent = Math.round((uploaded / total) * 100);

                        return (
                          <div className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-sm font-semibold text-gray-800">
                                Document Completion
                              </h3>
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${percent === 100
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                                  }`}
                              >
                                {percent}%
                              </span>
                            </div>
                            <Progress percent={percent} showInfo={false} />
                            <p className="text-xs text-gray-500 mt-1">
                              {uploaded} of {total} documents uploaded
                            </p>
                          </div>
                        );
                      })()}

                      {/* Collapsible Aadhaar & PAN */}
                      <Collapse
                        accordion
                        bordered={false}
                        className="bg-white border rounded-lg shadow-sm"
                      >
                        {/* Aadhaar Section */}
                        <Collapse.Panel
                          header={<span className="font-medium text-gray-800">Aadhaar Documents</span>}
                          key="1"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Aadhaar Front */}
                            <div>
                              <p className="text-xs font-medium text-gray-600">Front</p>
                              {group.aadhar_frontphoto ? (
                                <a
                                  href={group.aadhar_frontphoto}
                                  download={`${group.customer_name || "Customer"}_Aadhaar_Front${group.aadhar_frontphoto.split(".").pop()
                                    ? "." + group.aadhar_frontphoto.split(".").pop()
                                    : ""
                                    }`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  Aadhaar Front Document
                                </a>
                              ) : (
                                <p className="text-gray-400 italic text-xs">Not uploaded</p>
                              )}
                            </div>

                            {/* Aadhaar Back */}
                            <div>
                              <p className="text-xs font-medium text-gray-600">Back</p>
                              {group.aadhar_backphoto ? (
                                <a
                                  href={group.aadhar_backphoto}
                                  download={`${group.customer_name || "Customer"}_Aadhaar_Back${group.aadhar_backphoto.split(".").pop()
                                    ? "." + group.aadhar_backphoto.split(".").pop()
                                    : ""
                                    }`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  Aadhaar Back Document
                                </a>
                              ) : (
                                <p className="text-gray-400 italic text-xs">Not uploaded</p>
                              )}
                            </div>
                          </div>
                        </Collapse.Panel>

                        {/* PAN Section */}
                        <Collapse.Panel
                          header={<span className="font-medium text-gray-800">PAN Documents</span>}
                          key="2"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* PAN Front */}
                            <div>
                              <p className="text-xs font-medium text-gray-600">Front</p>
                              {group.pan_frontphoto ? (
                                <a
                                  href={group.pan_frontphoto}
                                  download={`${group.customer_name || "Customer"}_PAN_Front${group.pan_frontphoto.split(".").pop()
                                    ? "." + group.pan_frontphoto.split(".").pop()
                                    : ""
                                    }`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  PAN Front Document
                                </a>
                              ) : (
                                <p className="text-gray-400 italic text-xs">Not uploaded</p>
                              )}
                            </div>

                            {/* PAN Back */}
                            <div>
                              <p className="text-xs font-medium text-gray-600">Back</p>
                              {group.pan_backphoto ? (
                                <a
                                  href={group.pan_backphoto}
                                  download={`${group.customer_name || "Customer"}_PAN_Back${group.pan_backphoto.split(".").pop()
                                    ? "." + group.pan_backphoto.split(".").pop()
                                    : ""
                                    }`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  PAN Back Document
                                </a>
                              ) : (
                                <p className="text-gray-400 italic text-xs">Not uploaded</p>
                              )}
                            </div>
                          </div>
                        </Collapse.Panel>
                      </Collapse>
                    </div>
                  </div>
                )}

                {activeTab === "groups" && (
                  <div className="flex flex-wrap gap-2">
                    {TableAuctions?.length > 0 ? (
                      TableAuctions.map((auction, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleGroupClick(auction)}
                          className="cursor-pointer border border-gray-200 rounded-lg p-4 w-[400px] shadow-sm hover:shadow-md transition-all duration-200 bg-white hover:bg-violet-50"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-gray-800 truncate">
                              {auction.group_name}
                            </h3>
                            <Tag
                              color={
                                auction.prized_status === "Prized" || auction.isPrized
                                  ? "green"
                                  : "red"
                              }
                              className="text-xs font-medium"
                            >
                              {auction.prized_status === "Prized" || auction.isPrized
                                ? "Prized"
                                : "Unprized"}
                            </Tag>
                          </div>
                          <p className="text-sm text-gray-600">
                            Ticket: <span className="font-medium">{auction.ticket}</span>
                          </p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm text-gray-600">Balance:</span>
                            <span className="text-lg font-bold text-gray-800">
                              ₹{Number(auction.balance || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div
                              style={{
                                width: `${Math.min(
                                  100,
                                  (auction.paidAmount / auction.toBePaidAmount) * 100
                                )}%`,
                              }}
                              className={`h-2 rounded-full ${auction.prized_status === "Prized" || auction.isPrized
                                ? "bg-green-500"
                                : "bg-violet-500"
                                }`}
                            ></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 w-full">No groups found.</p>
                    )}
                  </div>
                )}
                {activeTab === "daybook" && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <label className="mb-1 text-sm font-medium text-gray-700 flex items-center gap-2">
                          <FiUsers className="text-violet-600" />
                          Group & Ticket
                        </label>
                        <select
                          value={EnrollGroupId.groupId ? `${EnrollGroupId.groupId}|${EnrollGroupId.ticket}` : ""}
                          onChange={handleEnrollGroup}
                          className="w-1/5 border border-gray-300 rounded-lg px-7 py-2.5 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select Group | Ticket</option>
                          {filteredAuction.map((group) =>
                            group?.enrollment?.group ? (
                              <option
                                key={group.enrollment.group._id}
                                value={`${group.enrollment.group._id}|${group.enrollment.tickets}`}
                              >
                                {group.enrollment.group.group_name} | {group.enrollment.tickets}
                              </option>
                            ) : null
                          )}
                          {loanCustomers.map((loan) => (
                            <option key={loan._id} value={`Loan|${loan._id}`}>
                              {`${loan.loan_id} | ₹${loan.loan_amount}`}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center items-center">
                        <div className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 text-lg font-medium flex items-center gap-2">
                          Reg Fee: ₹{registrationAmount || 0}
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-green-50 text-green-800 text-lg font-medium flex items-center gap-2">
                          Payment Balance: ₹{finalPaymentBalance}
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-lg font-medium flex items-center gap-2">
                          Total: ₹{Number(finalPaymentBalance) + Number(registrationAmount || 0)}
                        </div>
                      </div>
                    </div>
                    {(TableEnrolls?.length > 0 || (borrowersData.length > 0 && !basicLoading)) ? (
                      <DataTable
                        printHeaderKeys={["Customer Name", "Customer Id", "Phone Number", "Ticket Number", "Group Name", "Start Date", "End Date"]}
                        printHeaderValues={[
                          group?.full_name,
                          group?.customer_id,
                          group?.phone_number,
                          EnrollGroupId.ticket,
                          groupDetails?.group_name,
                          groupDetails?.start_date ? new Date(groupDetails.start_date).toLocaleDateString("en-GB") : "",
                          groupDetails?.end_date ? new Date(groupDetails.end_date).toLocaleDateString("en-GB") : "",
                        ]}
                        data={EnrollGroupId.groupId === "Loan" ? borrowersData : TableEnrolls}
                        columns={EnrollGroupId.groupId === "Loan" ? BasicLoanColumns : Basiccolumns}
                      />
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 text-violet-600 mb-4">
                          <BsCurrencyRupee size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No transactions found</h3>
                        <p className="text-gray-500 mt-1">select a group to view transactions</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {isGroupModalOpen && selectedGroupDetails && (
          <Modal
            title={
              <div className="flex items-center gap-2">
                <FiUsers className="text-violet-600" />
                <span className="text-violet-900 font-bold">Group Details</span>
              </div>
            }
            open={isGroupModalOpen}
            onCancel={handleCloseModal}
            footer={null}
            width={600}
            className="blue-modal"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Group Name</p>
                  <p className="font-medium text-lg text-gray-800">{selectedGroupDetails.group_name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Ticket Number</p>
                  <p className="font-medium text-lg text-gray-800">{selectedGroupDetails.ticket}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    {selectedGroupDetails.prized_status === "Prized" || selectedGroupDetails.isPrized ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <FiCheckCircle className="mr-1.5 h-4 w-4" />
                        Prized
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <FiXCircle className="mr-1.5 h-4 w-4" />
                        Unprized
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiDollarSign className="text-violet-600" />
                  Financial Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-gray-600">Total Amount to Pay</span>
                    <span className="font-semibold text-gray-800">₹{Number(selectedGroupDetails.totalBePaid || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-semibold text-gray-800">₹{Number(selectedGroupDetails.paidAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-t border-gray-200 pt-2.5 mt-1.5">
                    <span className="font-medium"> Total Balance</span>
                    <span className={`font-bold ${Number(selectedGroupDetails.balance || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{Number(selectedGroupDetails.balance || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div
                    style={{ width: `${Math.min(100, (selectedGroupDetails.paidAmount / selectedGroupDetails.totalBePaid) * 100)}%` }}
                    className="h-2 rounded-full bg-violet-600"
                  ></div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};
export default CustomerView;