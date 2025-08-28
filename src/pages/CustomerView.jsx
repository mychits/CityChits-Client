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

import { Tabs } from "antd";
const { TabPane } = Tabs;
import { Button, message } from "antd";

import {
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiXCircle, } from "react-icons/fi";

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

  const [lastPayment, setLastPayment] = useState({ date: null, amount: 0 });
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

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

  const Input = ({ label, value }) => (
    <div className="flex flex-col flex-1">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        placeholder={label}
        value={value || ""}
        readOnly
        className="border border-gray-300 rounded px-4 py-2 shadow-sm outline-none w-full"
      />
    </div>
  );

  const formatEnrollDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const InfoBox = ({ label, value }) => {
    return (
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-gray-400  mb-2">
          {label}
        </span>

        <div className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-base font-medium text-gray-900 shadow-sm">
          {value || "—"}
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
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/user/update-user/${group._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      message.success("Profile photo updated successfully!");
      // refresh the profile photo
      if (data?.profilephoto) {
        group.profilephoto = data.profilephoto;
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to upload photo");
    }
  };
  useEffect(() => {
    const fetchLastTransactions = async (event) => {
      event.preventDefault();
      setOpenAntDDrawer(true);
      if (formData.user_id && formData.payment_group_tickets) {
        try {
          setShowLoader(true);
          const response = await api.get("payment/get-last-n-transaction", {
            params: {
              user_id: formData.user_id,
              payment_group_tickets: paymentGroupTickets,
              limit: 1,
            },
          });
          if (response?.data) {
            setLastPayments(response.data);
          } else {
            setLastPayments([]);
          }
        } catch (error) {
          setLastPayments([]);
        } finally {
          setShowLoader(false);
        }
      }
    };
    fetchLastTransactions();
  }, []);

  const StatBox = ({ label, value }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <h3 className="text-lg font-semibold text-gray-900">{value}</h3>
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
  const [activeTab, setActiveTab] = useState("groupDetails");
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
        // Fetch all enrollments for the current user
        const response = await api.get(`/enroll/get-by-user-id/${userId}`);
        if (response.data && response.data.length > 0) {
          // Map through each enrollment to fetch its prized status
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
                console.error(
                  "Error fetching auction details for a group:",
                  error
                );
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

      fetch(
        `/api/payments?customerId=${userId}&_sort=date&_order=desc&_limit=1`
      )
        .then((res) => res.json())
        .then((data) => {
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
        activeTab === "basicReport" &&
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
                ? new Date(registrationFees[0].createdAt).toLocaleDateString(
                    "en-GB"
                  )
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
        // Fetch daily payments for all users
        const response = await api.get("/user/get-daily-payments");
        const rawData = response.data;
        let latestPayment = { date: null, amount: null };

        // Find the specific user's data and their latest payment
        for (const user of rawData) {
          if (user?._id === userId && user?.data) {
            for (const item of user.data) {
              const pay = item.payments;
              if (pay?.latestPaymentDate && pay?.latestPaymentAmount) {
                // Assuming this is the only payment entry for this user.
                // If a user can have multiple entries in a day,
                // you'll need to sort them to find the latest.
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
        console.error("Error fetching loan payment data:", error);
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
          // Fetch enrollment details to get the enrollment date
          const response = await api.get(
            `/enroll/get-by-id-enroll/${selectedGroup}`
          );
          if (response.data) {
            setEnrollmentDate(response.data.createdAt); // Use createdAt for enrollment date
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
          // Check if there's a winner to set prized status
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
        console.error("Error fetching group data:", error);
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
    const fetchGroups = async () => {
      try {
        const response = await api.get(`/user/get-user-by-id/${selectedGroup}`);
        setGroup(response.data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroups();
  }, [selectedGroup]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/user/get-user");
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroups();
  }, []);
  // disbursement report

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
  useEffect(() => {
    if (userId) {
      handleGroupPayment(userId);
    }
  }, []);
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
        console.error("Error fetching payment data:", error);
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
        console.error("Error fetching enrollment data:", error);
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
        console.error("Error fetching enrollment data:", error);
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
        console.error("Error fetching enrollment data:", error);
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

  if (screenLoading)
    return (
      <div className="w-screen m-24">
        <CircularLoader color="text-green-600" />
      </div>
    );

  return (
    <>
      <div className="w-screen min-h-screen mt-20 bg-gray-100">
        <div className="flex mt-20">
          <Sidebar
            navSearchBarVisibility={true}
            onGlobalSearchChangeHandler={GlobalSearchChangeHandler}
          />

          <div className="flex-grow p-8 space-y-6">
<Card className="shadow-xl border border-gray-200 rounded-2xl p-8 bg-white">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    
    
    <div className="col-span-1 flex flex-col items-center md:items-start space-y-6">
      
     
      <div className="flex flex-col items-center w-full">
        <div className="relative w-36 h-36   rounded-full overflow-hidden border-4 border-gray-200 shadow bg-gray-50 flex items-center justify-center">
          <img
            src={
              selectedFile
                ? URL.createObjectURL(selectedFile)
                : group.profilephoto ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
          {selectedFile && (
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 shadow hover:bg-red-600 transition"
            >
              ✕
            </button>
          )}
        </div>

    
        <h2 className="mt-3 text-xl font-bold text-gray-800 text-center md:text-left">
          {group.full_name || "Unnamed"}
        </h2>
      </div>

 
      <div className="w-full space-y-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="text-sm"
        />
        <div className="flex gap-3">
          <Button
            type="primary"
            size="small"
            disabled={!selectedFile}
            onClick={handleUploadPhoto}
          >
            Upload
          </Button>
          {selectedFile && (
            <Button danger size="small" onClick={() => setSelectedFile(null)}>
              Cancel
            </Button>
          )}
        </div>
      </div>


      {/* <div className="bg-gray-50 rounded-lg shadow-sm p-5 w-full space-y-4">
        <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
          Customer Info
        </h3>
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-gray-700 text-sm">
            <FiUser className="text-gray-500" /> 
            <span className="font-medium">Customer ID:</span> 
            <span className="ml-auto text-gray-900">{group.customer_id || "—"}</span>
          </p>
          <p className="flex items-center gap-2 text-gray-700 text-sm">
            <FiPhone className="text-gray-500" /> 
            <span className="font-medium">Phone:</span> 
            <span className="ml-auto text-gray-900">{group.phone_number || "—"}</span>
          </p>
          <p className="flex items-center gap-2 text-gray-700 text-sm">
            <FiMail className="text-gray-500" /> 
            <span className="font-medium">Email:</span> 
            <span className="ml-auto text-gray-900">{group.email || "—"}</span>
          </p>
        </div>
      </div> */}
    </div>

  
  {/* Right: Stats Section (Compact) */}
<div className="col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="bg-violet-50 rounded-lg shadow-sm p-3 h-24 flex flex-col justify-center">
    <p className="text-xs text-gray-600">Total Groups</p>
    <h3 className="text-lg font-bold text-violet-700">
      {TableAuctions?.length || 0}
    </h3>
  </div>

  <div className="bg-green-50 rounded-lg shadow-sm p-3 h-24 flex flex-col justify-center">
    <p className="text-xs text-gray-600">Total Balance</p>
    <h3 className="text-lg font-bold text-green-700">
      {NetTotalprofit && Totalpaid ? NetTotalprofit - Totalpaid : 0}
    </h3>
  </div>

  <div className="bg-blue-50 rounded-lg shadow-sm p-3 h-24 flex flex-col justify-center">
    <p className="text-xs text-gray-600">Total Profit</p>
    <h3 className="text-lg font-bold text-blue-700">
      {Totalprofit || 0}
    </h3>
  </div>

  <div className="bg-orange-50 rounded-lg shadow-sm p-3 h-24 flex flex-col justify-center">
    <p className="text-xs text-gray-600">Total Paid</p>
    <h3 className="text-lg font-bold text-orange-700">
      {Totalpaid || 0}
    </h3>
  </div>

  <div className="bg-teal-50 rounded-lg shadow-sm p-3 h-24 flex flex-col justify-center">
    <p className="text-xs text-gray-600">Latest Payment</p>
    {isLoadingPayment ? (
      <CircularLoader color="text-green-600" />
    ) : (
      <h3 className="text-base font-semibold text-green-700">
        ₹ {Number(lastPayment?.amount || 0).toLocaleString("en-IN")}
      </h3>
    )}
  </div>

  <div className="bg-indigo-50 rounded-lg shadow-sm p-3 h-24 flex flex-col justify-center">
    <p className="text-xs text-gray-600">Latest Disbursement</p>
    {detailsLoading ? (
      <CircularLoader color="text-blue-600" />
    ) : (
      <h3 className="text-base font-semibold text-indigo-700">
        ₹ {Number(groupPaid || 0).toLocaleString("en-IN")}
      </h3>
    )}
  </div>
</div>

  </div>
</Card>



            <Card className="shadow-lg border border-gray-200 text-2xl rounded-xl p-6 bg-white mt-6">
              <Tabs defaultActiveKey="1" type="card" className="custom-tabs">
                {/* Summary Tab */}
                <TabPane tab="Summary" key="1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InfoBox
                      label="Total Groups"
                      value={TableAuctions?.length || 0}
                    />
                    <InfoBox
                      label="Referred Types"
                      value={[
                        ...new Set(
                          TableAuctions.map(
                            (item) => item.referred_type || "N/A"
                          )
                        ),
                      ].join(", ")}
                    />
                    <InfoBox
                      label="Referred By"
                      value={[
                        ...new Set(
                          TableAuctions.map(
                            (item) => item.referrer_name || "N/A"
                          )
                        ),
                      ].join(", ")}
                    />

                    <InfoBox label="Total Profit" value={Totalprofit} />
                    <InfoBox label="Total Paid" value={Totalpaid} />
                    <InfoBox label="Net To Be Paid" value={NetTotalprofit} />
                  </div>
                </TabPane>

                {/* Details Tab */}
                <TabPane tab="Details" key="2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InfoBox label="Full Name" value={group.full_name} />
                    <InfoBox label="Customer ID" value={group.customer_id} />
                    <InfoBox label="Phone Number" value={group.phone_number} />
                    <InfoBox label="Email" value={group.email} />
                    <InfoBox label="Gender" value={group.gender} />
                    <InfoBox label="Date of Birth" value={group.dateofbirth} />
                    <InfoBox
                      label="Marital Status"
                      value={group.marital_status}
                    />
                  </div>
                </TabPane>

                {/* Address Tab */}
                <TabPane tab="Address" key="3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InfoBox label="Address" value={group.address} />
                    <InfoBox label="Pincode" value={group.pincode} />
                    <InfoBox label="District" value={group.district} />
                    <InfoBox label="State" value={group.state} />
                    <InfoBox label="Nationality" value={group.nationality} />
                  </div>
                </TabPane>

                {/* Bank Info Tab */}
                <TabPane tab="Bank Info" key="4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InfoBox label="Bank Name" value={group.bank_name} />
                    <InfoBox
                      label="Branch Name"
                      value={group.bank_branch_name}
                    />
                    <InfoBox
                      label="Account Number"
                      value={group.bank_account_number}
                    />
                    <InfoBox label="IFSC Code" value={group.bank_IFSC_code} />
                  </div>
                </TabPane>

                {/* Documents Tab */}
                <TabPane tab="Documents" key="5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InfoBox label="Aadhaar Number" value={group.adhaar_no} />
                    <InfoBox label="PAN Number" value={group.pan_no} />
                  </div>
                </TabPane>
              </Tabs>
            </Card>

            {/* ================== GROUPS SECTION ================== */}
            <Card className="shadow-lg border border-gray-200 rounded-xl p-6 bg-white mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Groups
              </h3>

              {TableAuctions && TableAuctions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {TableAuctions?.map((auction, idx) => (
                    <Card
                      key={idx}
                      className="shadow-md border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {auction.group_name}
                          </h3>
                        </div>

                        {/* Prize Status */}
                        <Tag
                          color={
                            auction.prized_status === "Prized" ||
                            auction.isPrized
                              ? "green"
                              : "red"
                          }
                          className="text-base font-semibold"
                        >
                          {auction.prized_status === "Prized" ||
                          auction.isPrized
                            ? "Prized"
                            : "Unprized"}
                        </Tag>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No groups found for this customer.
                </p>
              )}
            </Card>

            <Card className="shadow-sm border border-gray-200 rounded-xl p-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Search Bar */}
                <div className="relative w-full lg:w-1/3">
                  <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Search details..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full rounded-full border border-gray-300 pl-12 pr-4 py-3 text-sm shadow-sm 
                   focus:border-violet-700 focus:ring-2 focus:ring-violet-700 outline-none transition"
                  />
                </div>

                {/* Tabs */}
                <div className="flex gap-3 flex-wrap justify-center">
                  {[
                    { label: "Customer Details", key: "groupDetails" },
                    { label: "Customer Ledger", key: "basicReport" },
                    { label: "PayOut | Disbursement", key: "disbursement" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => handleTabChange(tab.key)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${
              activeTab === tab.key
                ? "bg-violet-700 text-white shadow-md"
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {activeTab === "groupDetails" && (
              <Card className="shadow-sm border border-gray-200 rounded-lg p-6">
                <>
                  {detailsLoading ? (
                    <p>loading...</p>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <div className="relative w-full max-w-lg  ">
                          {/* <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 ">
                                                        <FiSearch className="text-xl" />
                                                    </span> */}
                          {/* <input
                                                        type="text"
                                                        placeholder="Search customer details..."
                                                        className="w-full pl-12 pr-5 py-3.5 text-gray-800 bg-white border border-gray-200 rounded-full shadow-3xl 
                                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 
                                  transition-all duration-300 ease-in-out text-sm md:text-base"
                                                        value={searchText}
                                                        onChange={(e) =>
                                                            setSearchText(e.target.value)
                                                        }
                                                    /> */}
                        </div>

                        {/* {searchText &&
                                                    (() => {
                                                        const detailsArray = [
                                                            { key: "Name", value: group.full_name },
                                                            { key: "Email", value: group.email },
                                                            { key: "Phone", value: group.phone_number },
                                                            {
                                                                key: "Alternate Number",
                                                                value: group.alternate_number,
                                                            },
                                                            { key: "Address", value: group.address },
                                                            { key: "Aadhaar", value: group.adhaar_no },
                                                            { key: "PAN", value: group.pan_no },
                                                            { key: "Pincode", value: group.pincode },
                                                            {
                                                                key: "Father Name",
                                                                value: group.father_name,
                                                            },
                                                            {
                                                                key: "Nominee Name",
                                                                value: group.nominee_name,
                                                            },
                                                            {
                                                                key: "Bank Name",
                                                                value: group.bank_name,
                                                            },
                                                            {
                                                                key: "Bank Account",
                                                                value: group.bank_account_number,
                                                            },
                                                        ];

                                                        const fuse = new Fuse(detailsArray, {
                                                            keys: ["key", "value"],
                                                            threshold: 0.3,
                                                        });

                                                        const results = fuse.search(searchText);

                                                        return (
                                                            <div className="mt-2 bg-white border rounded shadow p-3 w-1/2">
                                                                {results.length > 0 ? (
                                                                    results.map(({ item }) => (
                                                                        <div
                                                                            key={item.key}
                                                                            className="p-1 border-b"
                                                                        >
                                                                            <strong>{item.key}</strong> →{" "}
                                                                            {item.value || "-"}
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p>No matching details</p>
                                                                )}
                                                            </div>
                                                        );
                                                    })()} */}
                      </div>

                      {/* <div className="mt-5"> */}
                      {/* Toggle Buttons */}
                      {/* <div className="flex flex-wrap gap-4 mb-6">
                                                    <button
                                                        onClick={() => setVisibleRows((prev) => ({ ...prev, row1: !prev.row1 }))}
                                                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out
                       ${visibleRows.row1
                                                                ? "bg-gradient-to-r from-custom-violet to-custom-violet text-white shadow-lg"
                                                                : "bg-gradient-to-r from-violet-100 to-gray-100 shadow-md hover:shadow-lg hover:scale-105"}
                     `}
                                                    >
                                                        {visibleRows.row1 ? "✓ Hide Basic Info" : "Show Basic Info"}
                                                    </button>

                                                    <button
                                                        onClick={() => setVisibleRows((prev) => ({ ...prev, row2: !prev.row2 }))}
                                                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out
                       ${visibleRows.row2
                                                                ? "bg-gradient-to-r from-custom-violet to-custom-violet text-white shadow-lg"
                                                                : "bg-gradient-to-r from-violet-100 to-violet-100  shadow-md hover:shadow-lg hover:scale-105"}
                     `}
                                                    >
                                                        {visibleRows.row2 ? "✓ Hide Address Info" : "Show Address Info"}
                                                    </button>

                                                    <button
                                                        onClick={() => setVisibleRows((prev) => ({ ...prev, row3: !prev.row3 }))}
                                                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out
                       ${visibleRows.row3
                                                                ? "bg-gradient-to-r from-custom-violet to-custom-violet text-white shadow-lg"
                                                                : "bg-gradient-to-r from-violet-100 to-violet-100  shadow-md hover:shadow-lg hover:scale-105"}
                     `}
                                                    >
                                                        {visibleRows.row3 ? "✓ Hide Regional Info" : "Show Regional Info"}
                                                    </button>

                                                    <button
                                                        onClick={() => setVisibleRows((prev) => ({ ...prev, row4: !prev.row4 }))}
                                                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out
                       ${visibleRows.row4
                                                                ? "bg-gradient-to-r from-custom-violet to-custom-violet text-white shadow-lg"
                                                                : "bg-gradient-to-r from-violet-100 to-violet-100  shadow-md hover:shadow-lg hover:scale-105"}
                     `}
                                                    >
                                                        {visibleRows.row4
                                                            ? "✓ Hide Referral, Nominee & Bank Details"
                                                            : "Show Referral, Nominee & Bank Details"}
                                                    </button>
                                                </div> */}

                      {/* Row 1: Basic Info */}
                      {/* {visibleRows.row1 && (
                                                    <div className="flex gap-8 mb-6">
                                                        <div className="flex flex-col w-full gap-4">
                                                            <Input label="Name" value={group.full_name} />
                                                            <Input label="Email" value={group.email} />
                                                        </div>
                                                        <div className="flex flex-col gap-4 w-full">
                                                            <Input label="Phone Number" value={group.phone_number} />
                                                            <Input label="Adhaar Number" value={group.adhaar_no} />
                                                        </div>
                                                        <div className="flex flex-col gap-4 w-full">
                                                            <Input label="PAN Number" value={group.pan_no} />
                                                            <Input label="Pincode" value={group.pincode} />
                                                        </div>
                                                    </div>
                                                )} */}

                      {/* Row 2: Address Info */}
                      {/* {visibleRows.row2 && (
                                                    <div className="flex gap-8 mb-6">
                                                        <div className="flex flex-col gap-4 w-full">
                                                            <Input label="Address" value={group.address} />
                                                            <Input label="Gender" value={group.gender} />
                                                        </div>
                                                        <div className="flex flex-col gap-4 w-full">
                                                            <Input
                                                                label="Date of Birth"
                                                                value={
                                                                    group.dateofbirth
                                                                        ? new Date(group.dateofbirth).toISOString().split("T")[0]
                                                                        : ""
                                                                }
                                                            />
                                                            <Input
                                                                label="Collection Area"
                                                                value={group?.collection_area?.route_name}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-4 w-full">
                                                            <Input label="Marital Status" value={group.marital_status} />
                                                            <Input label="Father Name" value={group.father_name} />
                                                        </div>
                                                    </div>
                                                )} */}

                      {/* Row 3: Regional Info */}
                      {/* {visibleRows.row3 && (
                                                    <div className="flex gap-8 mb-6">
                                                        <div className="flex flex-col gap-4 w-full">
                                                            <Input label="Nationality" value={group.nationality} />
                                                            <Input label="Village" value={group.village} />
                                                        </div>
                                                        <div className="flex flex-col gap-4 w-full">
                                                            <Input label="Taluk" value={group.taluk} />
                                                            <Input label="District" value={group.district} />
                                                        </div>
                                                        <div className="flex flex-col gap-4 w-full">
                                                            <Input label="State" value={group.state} />
                                                            <Input label="Alternate Number" value={group.alternate_number} />
                                                        </div>
                                                    </div>
                                                )} */}

                      {/* Row 4: Referral, Nominee & Bank Info */}
                      {/* {visibleRows.row4 && (
                                                    <div className="flex gap-8 mb-6">
                                                        <div className="flex flex-col gap-4 w-full">
                                                            <Input label="Referral Name" value={group.referral_name} />
                                                            <Input label="Nominee Name" value={group.nominee_name} />
                                                            <Input
                                                                label="Nominee DOB"
                                                                value={
                                                                    group.nominee_dateofbirth
                                                                        ? new Date(group.nominee_dateofbirth).toISOString().split("T")[0]
                                                                        : ""
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-4 w-full">
                                                            <Input
                                                                label="Nominee Phone Number"
                                                                value={group.nominee_phone_number}
                                                            />
                                                            <Input
                                                                label="Nominee Relationship"
                                                                value={group.nominee_relationship}
                                                            />
                                                            <Input label="Bank Name" value={group.bank_name} />
                                                        </div>
                                                        <div className="flex flex-col gap-4 w-full">
                                                            <Input label="Bank Branch Name" value={group.bank_branch_name} />
                                                            <Input label="Bank Account Number" value={group.bank_account_number} />
                                                            <Input label="Bank IFSC Code" value={group.bank_IFSC_code} />
                                                        </div>
                                                    </div>
                                                )} */}
                      {/* </div> */}

                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          Enrolled Groups
                        </h3>
                        {/* Changed conditional to check TableAuctions directly, as it's the formatted data */}
                        {TableAuctions &&
                        TableAuctions.length > 0 &&
                        !isLoading ? (
                          <div className="mt-5">
                            <DataTable
                              data={filterOption(
                                TableAuctions, // Use TableAuctions for display
                                searchText
                              )}
                              columns={Auctioncolumns}
                              exportedFileName={`CustomerReport-${
                                TableAuctions.length > 0
                                  ? TableAuctions[0].date +
                                    " to " +
                                    TableAuctions[TableAuctions.length - 1].date
                                  : "empty"
                              }.csv`}
                            />
                            {/* yes you can */}
                            {filteredBorrowerData.length > 0 && (
                              <div className="mt-10">
                                <h3 className="text-lg font-medium mb-4">
                                  Loan Details
                                </h3>
                                <DataTable
                                  data={filteredBorrowerData}
                                  columns={loanColumns}
                                  exportedFileName={`CustomerReport.csv`}
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <CircularLoader isLoading={isLoading} />
                        )}

                        {!isLoading && TableAuctions.length === 0 && (
                          <div className="p-40 w-full flex justify-center items-center">
                            No Enrolled Group Data Found
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 mt-5">
                        <div className="flex flex-col flex-1">
                          <label className="mb-1 text-sm font-medium text-gray-700">
                            Total Amount to be Paid
                          </label>
                          <input
                            type="text"
                            placeholder="-"
                            value={TotalToBepaid || ""}
                            readOnly
                            className="border border-gray-300 rounded px-4 py-2 shadow-sm outline-none w-full"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="mb-1 text-sm font-medium text-gray-700">
                            Total Profit
                          </label>
                          <input
                            type="text"
                            placeholder="-"
                            value={Totalprofit || ""}
                            readOnly
                            className="border border-gray-300 rounded px-4 py-2 shadow-sm outline-none w-full"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="mb-1 text-sm font-medium text-gray-700">
                            Total Net To be Paid
                          </label>
                          <input
                            type="text"
                            placeholder="-"
                            value={NetTotalprofit || ""}
                            readOnly
                            className="border border-gray-300 rounded px-4 py-2 shadow-sm outline-none w-full"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="mb-1 text-sm font-medium text-gray-700">
                            Total Amount Paid
                          </label>
                          <input
                            type="text"
                            placeholder="-"
                            value={Totalpaid || ""}
                            readOnly
                            className="border border-gray-300 rounded px-4 py-2 shadow-sm outline-none w-full"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="mb-1 text-sm font-medium text-gray-700">
                            Total Balance
                          </label>
                          <input
                            type="text"
                            placeholder="-"
                            value={
                              NetTotalprofit && Totalpaid
                                ? NetTotalprofit - Totalpaid
                                : ""
                            }
                            readOnly
                            className="border border-gray-300 rounded px-4 py-2 shadow-sm outline-none w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              </Card>
            )}

            {activeTab === "basicReport" && (
              <Card className="shadow-sm border border-gray-200 rounded-lg p-6">
                <>
                  <div>
                    <div className="flex gap-4">
                      <div className="flex flex-col flex-1">
                        <label className="mb-1 text-sm font-medium text-gray-700">
                          Groups and Tickets
                        </label>
                        <select
                          value={
                            EnrollGroupId.groupId
                              ? `${EnrollGroupId.groupId}|${EnrollGroupId.ticket}`
                              : ""
                          }
                          onChange={handleEnrollGroup}
                          className="border border-gray-300 rounded px-6 py-2 shadow-sm outline-none w-full max-w-md"
                        >
                          <option value="">Select Group | Ticket</option>
                          {filteredAuction.map((group) => {
                            if (group?.enrollment?.group) {
                              return (
                                <option
                                  key={group.enrollment.group._id}
                                  value={`${group.enrollment.group._id}|${group.enrollment.tickets}`}
                                >
                                  {group.enrollment.group.group_name} |{" "}
                                  {group.enrollment.tickets}
                                </option>
                              );
                            }
                            return null;
                          })}
                          {loanCustomers.map((loan) => (
                            <option key={loan._id} value={`Loan|${loan._id}`}>
                              {`${loan.loan_id} | ₹${loan.loan_amount}`}
                            </option>
                          ))}
                          {registrationFee.amount > 0 && (
                            <div className="mt-6 p-4 border rounded bg-gray-100 w-fit text-gray-800 shadow">
                              <p className="text-sm font-semibold">
                                Registration Fee Info
                              </p>
                              <p>
                                <strong>Amount:</strong> ₹
                                {registrationFee.amount}
                              </p>
                              <p>
                                <strong>Date:</strong>{" "}
                                {registrationFee.createdAt
                                  ? new Date(
                                      registrationFee.createdAt
                                    ).toLocaleDateString("en-GB")
                                  : "N/A"}
                              </p>
                            </div>
                          )}
                        </select>
                      </div>
                      <div className="mt-6 flex justify-center gap-8 flex-wrap">
                        <input
                          type="text"
                          value={`Registration Fee: ₹${
                            registrationAmount || 0
                          }`}
                          readOnly
                          className="px-4 py-2 border rounded font-semibold w-60 text-center bg-green-100 text-green-800 border-green-400"
                        />

                        <input
                          type="text"
                          value={`Payment Balance: ₹${finalPaymentBalance}`}
                          readOnly
                          className="px-4 py-2 border rounded font-semibold w-60 text-center bg-blue-100 text-blue-800 border-blue-400"
                        />

                        <input
                          type="text"
                          value={`Total: ₹${
                            Number(finalPaymentBalance) +
                            Number(registrationAmount || 0)
                          }`}
                          readOnly
                          className="px-4 py-2 border rounded font-semibold w-60 text-center bg-purple-100 text-purple-800 border-purple-400"
                        />
                      </div>
                    </div>

                    {(TableEnrolls && TableEnrolls.length > 0) ||
                    (borrowersData.length > 0 && !basicLoading) ? (
                      <div className="mt-10">
                        <DataTable
                          printHeaderKeys={[
                            "Customer Name",
                            "Customer Id",
                            "Phone Number",
                            "Ticket Number",
                            "Group Name",
                            "Start Date",
                            "End Date",
                          ]}
                          printHeaderValues={[
                            group.full_name,
                            group.customer_id,
                            group.phone_number,
                            EnrollGroupId.ticket,
                            groupDetails.group_name,
                            new Date(
                              groupDetails.start_date
                            ).toLocaleDateString("en-GB"),
                            new Date(groupDetails.end_date).toLocaleDateString(
                              "en-GB"
                            ),
                          ]}
                          data={
                            EnrollGroupId.groupId === "Loan"
                              ? borrowersData
                              : TableEnrolls
                          }
                          columns={
                            EnrollGroupId.groupId === "Loan"
                              ? BasicLoanColumns
                              : Basiccolumns
                          }
                        />
                      </div>
                    ) : (
                      <CircularLoader isLoading={basicLoading} />
                    )}
                  </div>
                </>
              </Card>
            )}

            {activeTab === "disbursement" && (
              <Card className="shadow-sm border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col flex-1">
                  <label className="mb-1 text-sm  text-gray-700 font-bold">
                    Disbursement
                  </label>

                  {disbursementLoading ? (
                    <CircularLoader />
                  ) : filteredDisbursement?.length > 0 ? (
                    <div className="mt-10">
                      <DataTable
                        data={filteredDisbursement}
                        columns={DisbursementColumns}
                      />
                    </div>
                  ) : (
                    <div className="p-40  w-full flex justify-center items-center ">
                      No Disbursement Data Found
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* {activeTab === "groupDetails" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                                <Card className="bg-green-50 border border-green-200 text-center">
                                    <p className="text-sm text-gray-600">Total To be Paid</p>
                                    <h3 className="text-lg font-bold text-green-700">₹{TotalToBepaid || 0}</h3>
                                </Card>

                                <Card className="bg-blue-50 border border-blue-200 text-center">
                                    <p className="text-sm text-gray-600">Total Profit</p>
                                    <h3 className="text-lg font-bold text-blue-700">₹{Totalprofit || 0}</h3>
                                </Card>

                                <Card className="bg-purple-50 border border-purple-200 text-center">
                                    <p className="text-sm text-gray-600">Net To be Paid</p>
                                    <h3 className="text-lg font-bold text-purple-700">₹{NetTotalprofit || 0}</h3>
                                </Card>

                                <Card className="bg-indigo-50 border border-indigo-200 text-center">
                                    <p className="text-sm text-gray-600">Amount Paid</p>
                                    <h3 className="text-lg font-bold text-indigo-700">₹{Totalpaid || 0}</h3>
                                </Card>

                                <Card className="bg-red-50 border border-red-200 text-center">
                                    <p className="text-sm text-gray-600">Balance</p>
                                    <h3 className="text-lg font-bold text-red-700">₹{NetTotalprofit && Totalpaid ? NetTotalprofit - Totalpaid : 0}</h3>
                                </Card>
                            </div>
                        )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerView;
