/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import api from "../instance/TokenInstance";
import { fieldSize } from "../data/fieldSize";
import Modal from "../components/modals/Modal";
import DataTable from "../components/layouts/Datatable";
import CustomAlert from "../components/alerts/CustomAlert";
import { FaWhatsappSquare } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import { Select, Dropdown, notification } from "antd";
import { IoMdMore } from "react-icons/io";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";
import CircularLoader from "../components/loaders/CircularLoader";
import { FiMail } from "react-icons/fi";
import { TrendingUp, AlertCircle, CheckCircle, ArrowRight, Users, Calendar, Search } from "lucide-react";

const Enroll = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [TableEnrolls, setTableEnrolls] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [currentUpdateGroup, setCurrentUpdateGroup] = useState(null);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [availableTicketsAdd, setAvailableTicketsAdd] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDataTableLoading, setIsDataTableLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [allEnrollUrl, setAllEnrollUrl] = useState(true);
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [removalReason, setRemovalReason] = useState("");
  const date = new Date().toISOString().split("T")[0];
  const [employees, setEmployees] = useState([]);
  const [thirdPartyEnable, setThirdPartyEnable] = useState({
    email: true,
    whatsapp: true,
    paymentLink: true,
  });
  const [email, setEmail] = useState([]);
  const [enrollmentStep, setEnrollmentStep] = useState("verify");
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });
  const [isExistingEnrollment, setIsExistingEnrollment] = useState(false);
  const [admin, setAdmin] = useState("");
  const [formData, setFormData] = useState({
    group_id: "",
    user_id: "",
    no_of_tickets: "",
    referred_type: "",
    payment_type: "",
    referred_customer: "",
    agent: "",
    referred_lead: "",
    email_id: "",
    chit_asking_month: "",
    created_by: "",
  });
  const [isVerified, setIsVerified] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    group_id: "",
    user_id: "",
    tickets: "",
    payment_type: "",
    referred_type: "",
    referred_customer: "",
    agent: "",
    referred_lead: "",
    chit_asking_month: "",
    blocked_referral: false,
    blocked_referral_type: "",
    blocked_referred_customer: "",
    blocked_referred_lead: "",
    blocked_referred_agent: "",
  });

  const [searchText, setSearchText] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState([]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
  const currentYearMonth = `${currentYear}-${currentMonth}`;

  function formatDate(date) {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  }

  const [selectedDate, setSelectedDate] = useState("");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [monthValues, setMonthValues] = useState({
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  });

  const onGlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const userObj = JSON.parse(user);
    const adminId = userObj?._id;
    if (adminId) {
      setAdmin(userObj?._id);
      setFormData((prev) => ({ ...prev, created_by: adminId }));
    } else {
      setAdmin("");
    }
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/group/get-group-admin");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroups();
  }, []);

  const parseDate = (dateString) => {
    const [year, month] = dateString.split("-");
    return {
      year,
      month: String(parseInt(month)).padStart(2, "0"),
      monthName: monthNames[parseInt(month) - 1],
    };
  };

  const formatToYearMonth = (year, month) => {
    return `${year}-${String(month).padStart(2, "0")}`;
  };

  const getMonthDateRange = (dateString) => {
    const { year, month } = parseDate(dateString);
    const startDate = new Date(year, parseInt(month) - 1, 1);
    const endDate = new Date(year, parseInt(month), 0);

    return {
      from_date: formatDate(startDate),
      to_date: formatDate(endDate),
    };
  };

  useEffect(() => {
    async function fetchAllEnrollmentData() {
      setAllEnrollUrl(true);
      let url = `/enroll-report/get-enroll-report?from_date=${date}&to_date=${date}`;
      try {
        setTableEnrolls([]);
        setIsDataTableLoading(true);
        const response = await api.get(url);
        if (response.data && response.data.length > 0) {
          setFilteredUsers(response.data);
          const formattedData = response.data.map((group, index) => {
            if (!group?.group_id || !group?.user_id) return {};
            return {
              _id: group?._id,
              id: index + 1,
              name: group?.user_id?.full_name,
              phone_number: group?.user_id?.phone_number,
              group_name: group?.group_id?.group_name,
              payment_type: group?.payment_type,
              enrollment_date: group?.createdAt
                ? group?.createdAt?.split("T")[0]
                : "",
              chit_asking_month: group?.chit_asking_month,
              referred_type: group?.referred_type,
              referred_by:
                group?.agent?.name && group?.agent?.phone_number
                  ? `${group.agent.name} | ${group.agent.phone_number}`
                  : group?.referred_customer?.full_name &&
                    group?.referred_customer?.phone_number
                  ? `${group.referred_customer.full_name} | ${group?.referred_customer?.phone_number}`
                  : group?.referred_lead?.lead_name &&
                    group?.referred_lead?.agent_number
                  ? `${group.referred_lead.lead_name} | ${group.referred_lead.agent_number}`
                  : "N/A",
              ticket: group.tickets,
              action: (
                <div className="flex justify-center items-center gap-2">
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "1",
                          label: (
                            <div
                              className="text-green-600"
                              onClick={() => handleUpdateModalOpen(group._id)}
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
                              onClick={() => handleRemoveModalOpen(group._id)}
                            >
                              Remove
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
            };
          });
          setTableEnrolls(formattedData);
        } else {
          setFilteredUsers([]);
        }
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
        setFilteredUsers([]);
        setTableEnrolls([]);
      } finally {
        setIsDataTableLoading(false);
      }
    }
    fetchAllEnrollmentData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user/get-user");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get("/agent/get");
        setAgents(response.data?.agent);
      } catch (err) {
        console.error("Failed to fetch Leads", err);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/employee");
        setEmployees(response?.data?.employee);
      } catch (error) {
        console.error("failed to fetch employees", error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await api.get("/lead/get-lead");
        setLeads(response.data);
      } catch (err) {
        console.error("Failed to fetch Leads", err);
      }
    };
    fetchLeads();
  }, []);

  const handleAntDSelect = async (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
    if (field === "group_id") {
      try {
        const response = await api.post(`/enroll/get-next-tickets/${value}`);
        setAvailableTicketsAdd(response.data.availableTickets || []);
        console.log("Next tickets:", response.data.availableTickets);
      } catch (error) {
        console.error("Error fetching next tickets:", error);
      }
    }
  };

  function setRefferedType(referralArray) {
    const found = referralArray.find((referee) => referee.data);
    return found ? found.value : null;
  }

  const handleAntInputDSelect = (field, value) => {
    if (field === "referred_type") {
      setUpdateFormData((prevData) => ({
        ...prevData,
        referred_type: value,
        blocked_referral: true,
        referred_customer: "",
        referred_lead: "",
        agent: "",
        blocked_referral_type: setRefferedType([
          { data: prevData?.referred_customer, value: "Customer" },
          { data: prevData?.referred_lead, value: "Lead" },
          { data: prevData?.agent, value: "Agent" },
        ]),
        blocked_referred_customer: prevData?.referred_customer?._id,
        blocked_referred_lead: prevData?.referred_lead?._id,
        blocked_referred_agent: prevData?.agent?._id,
      }));
      return;
    }

    // other fields
    setUpdateFormData((prevData) => ({
      ...prevData,
      blocked_referral_type: false,
      blocked_referred_customer: "",
      blocked_referred_lead: "",
      blocked_referred_agent: "",
      [field]: value,
    }));

    setErrors({ ...errors, [field]: "" });
  };

  const handleGroupChange = async (groupId) => {
    setSelectedGroup(groupId);

    if (groupId) {
      let url;
      if (groupId === "today") {
        url = `/enroll-report/get-enroll-report?from_date=${date}&to_date=${date}`;
        setAllEnrollUrl(true);
      } else {
        url = `/enroll/get-group-enroll/${groupId}`;
        setAllEnrollUrl(false);
      }
      try {
        setTableEnrolls([]);
        setIsDataTableLoading(true);
        const response = await api.get(url);
        console.info(response, "response data this is data");
        if (response.data && response.data.length > 0) {
          setFilteredUsers(response.data);
          const formattedData = response.data.map((group, index) => {
            if (!group?.group_id || !group?.user_id) return {};
            return {
              _id: group?._id,
              id: index + 1,
              name: group?.user_id?.full_name,
              phone_number: group?.user_id?.phone_number,
              group_name: group?.group_id?.group_name,
              payment_type: group?.payment_type,
              enrollment_date: group?.createdAt.split("T")[0],
              chit_asking_month: group?.chit_asking_month,
              referred_type: group?.referred_type,
              referred_by:
                group?.agent?.name && group?.agent?.phone_number
                  ? `${group.agent.name} | ${group.agent.phone_number}`
                  : group?.referred_customer?.full_name &&
                    group?.referred_customer?.phone_number
                  ? `${group.referred_customer.full_name} | ${group?.referred_customer?.phone_number}`
                  : group?.referred_lead?.lead_name &&
                    group?.referred_lead?.agent_number
                  ? `${group.referred_lead.lead_name} | ${group.referred_lead.agent_number}`
                  : "N/A",
              ticket: group.tickets,
              action: (
                <div className="flex justify-center items-center gap-2">
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "1",
                          label: (
                            <div
                              className="text-green-600"
                              onClick={() => handleUpdateModalOpen(group._id)}
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
                              onClick={() => handleRemoveModalOpen(group._id)}
                            >
                              Remove
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
            };
          });
          setTableEnrolls(formattedData);
        } else {
          setFilteredUsers([]);
        }
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
        setFilteredUsers([]);
        setTableEnrolls([]);
      } finally {
        setIsDataTableLoading(false);
      }
    } else {
      setFilteredUsers([]);
    }
  };

  const columns = [
    { key: "id", header: "SL. NO" },
    { key: "name", header: "Customer Name" },
    { key: "phone_number", header: "Customer Phone Number" },
  ];
  if (allEnrollUrl) {
    columns.push({ key: "group_name", header: "Enrolled Group" });
  }
  columns.push(
    { key: "ticket", header: "Ticket Number" },
    { key: "referred_type", header: "Referred Type" },
    { key: "payment_type", header: "Payment Type" },
    { key: "enrollment_date", header: "Enrollment Date" },
    { key: "chit_asking_month", header: "Chit Asking Month" },
    { key: "referred_by", header: "Referred By" },
    { key: "action", header: "Action" }
  );

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    if (name === "group_id") {
      try {
        const response = await api.post(`/enroll/get-next-tickets/${value}`);
        setAvailableTicketsAdd(response.data.availableTickets || []);
        console.log("Next tickets:", response.data.availableTickets);
      } catch (error) {
        console.error("Error fetching next tickets:", error);
      }
    }
  };

  const validate = (type) => {
    const newErrors = {};
    const data = type === "addEnrollment" ? formData : updateFormData;
    const noOfTickets = type === "addEnrollment" ? "no_of_tickets" : "tickets";
    const regex = { email_id: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ };
    if (!data.group_id.trim()) {
      newErrors.group_id = "Please select a group";
    }
    if (!data.user_id) {
      newErrors.user_id = "Please select a customer";
    }
    if (data.email_id && !regex.email_id.test(data.email_id)) {
      newErrors.email_id = "Invalid email format";
    }

    if (availableTicketsAdd.length > 0) {
      if (
        !data[noOfTickets] ||
        data[noOfTickets] <= 0 ||
        isNaN(data[noOfTickets])
      ) {
        newErrors[noOfTickets] = "Please enter number of tickets";
      } else if (data[noOfTickets] > availableTicketsAdd.length) {
        newErrors[
          noOfTickets
        ] = `Maximum ${availableTicketsAdd.length} tickets allowed`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isvalid = validate("addEnrollment");
    if (isvalid) {
      setLoading(true);
      const {
        no_of_tickets,
        group_id,
        user_id,
        payment_type,
        referred_customer,
        referred_type,
        agent,
        referred_lead,
        chit_asking_month,
        email_id,
        created_by,
      } = formData;
      const ticketsCount = parseInt(no_of_tickets, 10);
      const ticketEntries = availableTicketsAdd
        .slice(0, ticketsCount)
        .map((ticketNumber) => ({
          group_id,
          user_id,
          no_of_tickets,
          payment_type,
          referred_customer,
          agent,
          referred_lead,
          referred_type,
          chit_asking_month: formData.chit_asking_month,
          tickets: ticketNumber,
          email_id,
          created_by,
        }));

      try {
        for (const ticketEntry of ticketEntries) {
          console.log("ticket");
          await api.post(
            "/enroll/add-enroll",
            {
              ...ticketEntry,
              ...thirdPartyEnable,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        setShowModal(false);
        setFormData({
          group_id: "",
          user_id: "",
          no_of_tickets: "",
          referred_type: "",
          payment_type: "",
          referred_customer: "",
          agent: "",
          referred_lead: "",
          email_id,
        });
        setAlertConfig({
          visibility: true,
          message: "User Enrolled Successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Error enrolling user:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateModalOpen = async (enrollId) => {
    try {
      const response = await api.get(`/enroll/get-enroll-by-id/${enrollId}`);
      setCurrentUpdateGroup(response.data);
      setUpdateFormData({
        group_id: response.data?.group_id?._id,
        user_id: response.data?.user_id?._id,
        tickets: response.data?.tickets,
        payment_type: response.data?.payment_type,
        referred_customer: response.data?.referred_customer?._id || "",
        agent: response.data?.agent?._id || "",
        referred_lead: response.data?.referred_lead?._id || "",
        referred_type: response.data?.referred_type,
        chit_asking_month: response.data?.chit_asking_month || "",
        blocked_referral: response.data?.blocked_referral || false,
        blocked_referral_type: response.data?.blocked_referral_type || "",
        blocked_referral_customer:
          response.data?.blocked_referral_customer || "",
        blocked_referral_lead: response.data?.blocked_referral_lead || "",
        blocked_referral_agent: response.data?.blocked_referral_agent || "",
      });
      setShowModalUpdate(true);
    } catch (error) {
      console.error("Error fetching enrollment:", error);
    }
  };

  const handleRemoveModalOpen = async (groupId) => {
    try {
      const response = await api.get(`/enroll/get-enroll-by-id/${groupId}`);
      setCurrentGroup(response.data);
      setShowModalRemove(true);
    } catch (error) {
      console.error("Error fetching enroll:", error);
    }
  };

  const handleRemoveGroup = async (e) => {
    e.preventDefault();

    if (currentGroup) {
      const user_id = currentGroup.user_id?._id;
      if (user_id) {
        try {
          await api.put(`/enroll/remove/${currentGroup?._id}`, {
            user_id,
            deleted_by: admin,
            deleted_at: new Date(),
            removalReason,
          });
          setRemovalReason("");
          setShowModalRemove(false);
          setCurrentGroup(null);
          setAlertConfig({
            visibility: true,
            message: "Enroll deleted successfully",
            type: "success",
          });
        } catch (error) {
          setRemovalReason("");
          console.error("Error deleting group:", error);
        }
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/enroll/update-enroll/${currentUpdateGroup._id}`,
        updateFormData
      );
      setShowModalUpdate(false);

      setAlertConfig({
        visibility: true,
        message: "Enrollment Updated Successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating enroll:", error);
    }
  };

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

  const handleVerify = async () => {
    const {
      user_id,
      group_id,
      agent,
      referred_customer,
      referred_lead,
      referred_type,
    } = formData;

    if (!user_id || !group_id) {
      notification.warning({
        message: "Please select both Group and Customer before verifying.",
      });
      return;
    }

    try {
      const response = await api.get(`/enroll/get-enroll-check`, {
        params: { user_id, group_id },
      });

      const selectedUser = users.find((u) => u._id === user_id);
      const selectedGroup = groups.find((g) => g._id === group_id);
      const selectedAgent = agents.find((a) => a._id === agent);
      const selectedReferredCustomer = users.find(
        (u) => u._id === referred_customer
      );
      const selectedReferredLead = leads?.find?.(
        (l) => l._id === referred_lead
      );

      if (response?.data) {
        const agentName =
          typeof response.data.agent === "object"
            ? response.data.agent?.name
            : null;
        const referredCustomerName =
          typeof response.data.referred_customer === "object"
            ? response.data.referred_customer?.full_name
            : null;
        const referredLeadName =
          typeof response.data.referred_lead === "object"
            ? response.data.referred_lead?.lead_name
            : null;

        const referredInfoParts = [];

        if (agentName)
          referredInfoParts.push(
            ` Already referred by Agent Name: ${agentName}`
          );
        if (referredCustomerName)
          referredInfoParts.push(
            ` Already referred by Customer Name: ${referredCustomerName}`
          );
        if (referredLeadName)
          referredInfoParts.push(
            ` Already referred by Lead Name: ${referredLeadName}`
          );
        if (referredInfoParts.length === 0)
          referredInfoParts.push("Enrollment exists with no referral info.");

        setFormData((prev) => ({
          ...prev,
          no_of_tickets: response?.data?.no_of_tickets ?? prev.no_of_tickets,
          payment_type: response?.data?.payment_type ?? prev.payment_type,
          referred_customer:
            response?.data?.referred_customer ?? prev.referred_customer,
          referred_lead: response?.data?.referred_lead ?? prev.referred_lead,
          referred_type:
            prev.referred_type ||
            response?.data?.referred_type ||
            (response.data?.agent
              ? "Agent"
              : response.data?.referred_customer
              ? "Customer"
              : response.data?.referred_lead
              ? "Leads"
              : ""),
        }));

        let selectedBy = "Unknown";
        if (referred_type === "Agent")
          selectedBy = selectedAgent?.name || "Unknown Agent";
        else if (referred_type === "Customer")
          selectedBy =
            selectedReferredCustomer?.full_name || "Unknown Customer";
        else if (referred_type === "Leads")
          selectedBy = selectedReferredLead?.lead_name || "Unknown Lead";

        setIsExistingEnrollment(true);
        setEnrollmentStep("continue");

        notification.warning({
          message: (
            <span
              style={{
                fontWeight: "bold",
                fontSize: "1.25rem",
                marginBottom: "10px",
              }}
            >
              Customer Name: "{selectedUser?.full_name}"
              <br />
              <hr style={{ margin: "10px 0", borderTop: "1px solid #ccc" }} />
              Group Name: "{selectedGroup?.group_name}"
              <br />
              <hr style={{ margin: "10px 0", borderTop: "1px solid #ccc" }} />
            </span>
          ),
          description: (
            <div style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
              {referredInfoParts.map((part, index) => (
                <span key={index}>
                  {part}
                  <br />
                  <hr
                    style={{ margin: "10px 0", borderTop: "1px solid #ccc" }}
                  />
                </span>
              ))}
            </div>
          ),
          duration: 30,
        });
        setIsExistingEnrollment(true);
        setIsVerified(true);
        setEnrollmentStep("continue");
      } else {
        setIsExistingEnrollment(false);
        setIsVerified(true);
        setEnrollmentStep("continue");

        notification.success({
          message: `Eligible for Enrollment`,
          description: `User "${selectedUser?.full_name}" can be enrolled in "${selectedGroup?.group_name}".`,
          duration: 6,
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      notification.error({
        message: "Error checking enrollment",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleMultiStep = async (e) => {
    e.preventDefault();

    if (enrollmentStep === "verify") {
      await handleVerify();
    } else if (enrollmentStep === "continue") {
      setEnrollmentStep("submit");
    } else if (enrollmentStep === "submit") {
      handleSubmit(e);
    }
  };

  return (
    <>
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
        />
        <div className="flex-1 bg-gradient-to-b from-white/90 to-purple-50/90">
          <div className="p-8">
            {/* Page Header with Gradient */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Enrollment Management
              </h1>
              <p className="text-gray-600">
                Manage and track customer enrollments
              </p>
            </div>

            {/* Stats Overview with Purple/Pink Theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-purple-100/50 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Enrollment Overview</p>
                    <p className="text-2xl font-bold text-gray-900">Enrollment Records</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">Growing Network</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-purple-100/50 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Management</p>
                    <p className="text-2xl font-bold text-gray-900">Enrollment Directory</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-purple-600 font-medium">Organized and accessible</p>
                </div>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-purple-100/50 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search or Select Group
                  </label>
                  <Select
                    showSearch
                    popupMatchSelectWidth={false}
                    value={selectedGroup || "today"}
                    filterOption={(input, option) =>
                      option.children
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    placeholder="Search or Select Group"
                    onChange={handleGroupChange}
                    className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  >
                    <Select.Option key={"$1"} value={"today"}>
                      Today's Enrollment
                    </Select.Option>
                    {groups.map((group) => (
                      <Select.Option key={group._id} value={group._id}>
                        {group.group_name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-6 md:mt-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2"
                >
                  <span>+ Add Enrollment</span>
                </button>
              </div>
            </div>

            {/* Data Table */}
            {TableEnrolls?.length > 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-purple-100/50 p-6">
                <DataTable
                  updateHandler={handleUpdateModalOpen}
                  data={filterOption(TableEnrolls, searchText)}
                  columns={columns}
                  exportedFileName={`Enrollments-${
                    TableEnrolls.length > 0
                      ? TableEnrolls[0].name +
                        " to " +
                        TableEnrolls[TableEnrolls.length - 1].name
                      : "empty"
                  }.csv`}
                />
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-purple-100/50 p-8">
                <CircularLoader
                  isLoading={isDataTableLoading}
                  failure={TableEnrolls?.length <= 0 && selectedGroup}
                  data={"Enrollment Data"}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Enrollment Modal */}
      <Modal
        isVisible={showModal}
        onClose={() => {
          setShowModal(false);
          setErrors({});
        }}
      >
        <div className="py-6 px-5 lg:px-8 text-left bg-white rounded-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Add Enrollment
            </h3>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Group <span className="text-red-500">*</span>
                </label>
                <Select
                  className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Select or Search Group"
                  popupMatchSelectWidth={false}
                  showSearch
                  name="group_id"
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  value={formData?.group_id || undefined}
                  onChange={(value) => handleAntDSelect("group_id", value)}
                >
                  {groups.map((group) => (
                    <Select.Option key={group._id} value={group._id}>
                      {group.group_name}
                    </Select.Option>
                  ))}
                </Select>
                {errors.group_id && (
                  <p className="mt-1 text-xs text-red-600">{errors.group_id}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Customer <span className="text-red-500">*</span>
                </label>
                <Select
                  className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Select or Search Customer"
                  popupMatchSelectWidth={false}
                  showSearch
                  name="user_id"
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  value={formData?.user_id || undefined}
                  onChange={(value) => {
                    handleAntDSelect("user_id", value);

                    // find selected user
                    const selectedUser = users.find((u) => u._id === value);
                    if (selectedUser) {
                      setEmail(selectedUser.email || "");
                      setFormData((prev) => ({
                        ...prev,
                        email_id: selectedUser.email,
                      }));
                    }
                  }}
                >
                  {users.map((user) => (
                    <Select.Option key={user._id} value={user._id}>
                      {user.full_name} | {user.phone_number || "No Number"}
                    </Select.Option>
                  ))}
                </Select>
                {errors.user_id && (
                  <p className="mt-1 text-xs text-red-600">{errors.user_id}</p>
                )}
              </div>
            </div>

            {formData?.user_id && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full h-12 p-3 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  value={email || ""}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      email_id: e.target.value,
                    }));
                  }}
                />
                {errors.email_id && (
                  <p className="mt-1 text-xs text-red-600">{errors.email_id}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Payment Type <span className="text-red-500">*</span>
                </label>
                <Select
                  className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Select Payment Type"
                  popupMatchSelectWidth={false}
                  showSearch
                  name="payment_type"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  value={formData?.payment_type || undefined}
                  onChange={(value) => handleAntDSelect("payment_type", value)}
                >
                  {["Daily", "Weekly", "Monthly"].map((pType) => (
                    <Select.Option key={pType} value={pType}>
                      {pType}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Chit Asking Month
                </label>
                <input
                  type="month"
                  className="w-full h-12 p-3 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      chit_asking_month: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Referred Type <span className="text-red-500">*</span>
              </label>
              <Select
                className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                placeholder="Select Referred Type"
                popupMatchSelectWidth={false}
                showSearch
                name="referred_type"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                value={formData?.referred_type || undefined}
                onChange={(value) => handleAntDSelect("referred_type", value)}
              >
                {[
                  "Self Joining",
                  "Customer",
                  "Employee",
                  "Agent",
                  "Leads",
                  "Others",
                ].map((refType) => (
                  <Select.Option key={refType} value={refType}>
                    {refType}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {formData.referred_type === "Customer" && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select Referred Customer <span className="text-red-500">*</span>
                </label>
                <Select
                  className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Select Or Search Referred Customer"
                  popupMatchSelectWidth={false}
                  showSearch
                  name="referred_customer"
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  value={formData?.referred_customer || undefined}
                  onChange={(value) =>
                    handleAntDSelect("referred_customer", value)
                  }
                >
                  {users.map((user) => (
                    <Select.Option key={user._id} value={user._id}>
                      {user.full_name} | {user.phone_number || "No Number"}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}

            {formData.referred_type === "Leads" && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select Referred Leads <span className="text-red-500">*</span>
                </label>
                <Select
                  className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Select Or Search Referred Leads"
                  popupMatchSelectWidth={false}
                  showSearch
                  name="referred_lead"
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  value={formData?.referred_lead || undefined}
                  onChange={(value) =>
                    handleAntDSelect("referred_lead", value)
                  }
                >
                  {leads.map((lead) => (
                    <Select.Option key={lead._id} value={lead._id}>
                      {lead.lead_name} | {lead.lead_phone}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}

            {formData.referred_type === "Agent" && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select Referred Agent <span className="text-red-500">*</span>
                </label>
                <Select
                  className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Select or Search Referred Agent"
                  popupMatchSelectWidth={false}
                  showSearch
                  name="agent"
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  value={formData.agent || undefined}
                  onChange={(value) => handleAntDSelect("agent", value)}
                >
                  {agents.map((agent) => (
                    <Select.Option key={agent._id} value={agent._id}>
                      {agent.name} | {agent.phone_number}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}

            {formData.referred_type === "Employee" && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select Referred Employee <span className="text-red-500">*</span>
                </label>
                <Select
                  className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Select Or Search Referred Employee"
                  popupMatchSelectWidth={false}
                  showSearch
                  name="agent"
                  filterOption={(input, option) => {
                    if (!option || !option.children) return false;
                    return option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  value={formData?.agent || undefined}
                  onChange={(value) => handleAntDSelect("agent", value)}
                >
                  {employees.map((employee) => (
                    <Select.Option key={employee._id} value={employee._id}>
                      {employee.name} | {employee.phone_number}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}

            {formData.group_id && availableTicketsAdd.length === 0 ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-center text-red-600 font-medium">
                  Group is Full
                </p>
              </div>
            ) : formData.group_id && availableTicketsAdd.length !== 0 ? (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Number of Tickets <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="no_of_tickets"
                  value={formData?.no_of_tickets}
                  onChange={handleChange}
                  placeholder="Enter the Number of Tickets"
                  required
                  max={availableTicketsAdd.length}
                  className="w-full h-12 p-3 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                />
                {errors.no_of_tickets && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.no_of_tickets}
                  </p>
                )}
                <p className="mt-1 text-xs text-purple-600 text-center">
                  Only {availableTicketsAdd.length} tickets left
                </p>
              </div>
            ) : null}

            <div className="border-t pt-4">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Actions
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaWhatsapp className="text-green-600 w-5 h-5" />
                    <span className="text-gray-800">
                      Enable WhatsApp Sending
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={thirdPartyEnable.whatsapp}
                    onChange={() =>
                      setThirdPartyEnable((prev) => ({
                        ...prev,
                        whatsapp: !prev.whatsapp,
                      }))
                    }
                    className="w-5 h-5 accent-green-600 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FiLink className="text-green-600 w-5 h-5" />
                    <span className="text-gray-800">
                      Enable Registration Payment Link
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={thirdPartyEnable.paymentLink}
                    onChange={() =>
                      setThirdPartyEnable((prev) => ({
                        ...prev,
                        paymentLink: !prev.paymentLink,
                      }))
                    }
                    className="w-5 h-5 accent-green-600 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FiMail className="w-5 h-5" />
                    <span className="text-gray-800">Enable Email</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={thirdPartyEnable.email}
                    onChange={() =>
                      setThirdPartyEnable((prev) => ({
                        ...prev,
                        email: !prev.email,
                      }))
                    }
                    className="w-5 h-5 accent-green-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                disabled={
                  loading ||
                  (enrollmentStep === "submit" &&
                    (!isVerified || availableTicketsAdd.length === 0))
                }
                onClick={handleMultiStep}
                className={`px-6 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : enrollmentStep === "verify"
                    ? "bg-gray-600 hover:bg-gray-700"
                    : enrollmentStep === "continue"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                }`}
              >
                {loading
                  ? "Processing..."
                  : enrollmentStep === "verify"
                  ? "Verify"
                  : enrollmentStep === "continue"
                  ? "Continue"
                  : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Update Enrollment Modal */}
      <Modal
        isVisible={showModalUpdate}
        onClose={() => {
          setShowModalUpdate(false);
          setErrors({});
        }}
      >
        <div className="py-6 px-5 lg:px-8 text-left bg-white rounded-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Update Enrollment
            </h3>
          </div>
          <form className="space-y-4" onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Group <span className="text-red-500">*</span>
                </label>
                <select
                  name="group_id"
                  value={updateFormData.group_id}
                  onChange={handleInputChange}
                  disabled
                  className="w-full h-12 p-3 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl"
                >
                  <option value="">Select Group</option>
                  {groups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.group_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  name="user_id"
                  value={updateFormData.user_id}
                  onChange={handleInputChange}
                  disabled
                  className="w-full h-12 p-3 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl"
                >
                  <option value="">Select Customer</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.full_name} | {user.phone_number}
                    </option>
                  ))}
                </select>
                {errors.user_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Payment Type <span className="text-red-500">*</span>
                </label>
                <Select
                  className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Select Payment Type"
                  popupMatchSelectWidth={false}
                  showSearch
                  name="payment_type"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  value={updateFormData?.payment_type || undefined}
                  onChange={(value) =>
                    handleAntInputDSelect("payment_type", value)
                  }
                >
                  {["Daily", "Weekly", "Monthly"].map((pType) => (
                    <Select.Option key={pType.toLowerCase()} value={pType}>
                      {pType}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Chit Asking Month
                </label>
                <input
                  type="month"
                  className="w-full h-12 p-3 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  value={updateFormData.chit_asking_month}
                  onChange={(e) =>
                    setUpdateFormData((prev) => ({
                      ...prev,
                      chit_asking_month: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Referred Type <span className="text-red-500">*</span>
              </label>
              <Select
                className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                placeholder="Select Referred Type"
                popupMatchSelectWidth={false}
                showSearch
                name="referred_type"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                value={updateFormData?.referred_type || undefined}
                onChange={(value) =>
                  handleAntInputDSelect("referred_type", value)
                }
              >
                {[
                  "Self Joining",
                  "Customer",
                  "Employee",
                  "Agent",
                  "Leads",
                  "Blocked Referral",
                  "Others",
                ].map((refType) => (
                  <Select.Option key={refType} value={refType}>
                    {refType}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {updateFormData.referred_type === "Customer" && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select Referred Customer <span className="text-red-500">*</span>
                </label>
                <Select
                  className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Select Or Search Referred Customer"
                  popupMatchSelectWidth={false}
                  showSearch
                  name="referred_customer"
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  value={updateFormData?.referred_customer || undefined}
                  onChange={(value) =>
                    handleAntInputDSelect("referred_customer", value)
                  }
                >
                  {users.map((user) => (
                    <Select.Option key={user._id} value={user._id}>
                      {user.full_name} | {user.phone_number}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}

            {updateFormData.referred_type === "Agent" && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select Referred Agent <span className="text-red-500">*</span>
                </label>
                <Select
                  className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Select or Search Referred Agent"
                  popupMatchSelectWidth={false}
                  showSearch
                  name="agent"
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  value={updateFormData.agent || undefined}
                  onChange={(value) => handleAntInputDSelect("agent", value)}
                >
                  {agents.map((agent) => (
                    <Select.Option key={agent._id} value={agent._id}>
                      {agent.name} | {agent.phone_number}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}

            {updateFormData.referred_type === "Leads" && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select Referred Leads <span className="text-red-500">*</span>
                </label>
                <Select
                  className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Select Or Search Referred Lead"
                  popupMatchSelectWidth={false}
                  showSearch
                  name="referred_lead"
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  value={updateFormData?.referred_lead || undefined}
                  onChange={(value) =>
                    handleAntInputDSelect("referred_lead", value)
                  }
                >
                  {leads.map((lead) => (
                    <Select.Option key={lead._id} value={lead._id}>
                      {lead.lead_name} | {lead.lead_phone}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}

            {updateFormData.referred_type === "Employee" && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select Referred Employee <span className="text-red-500">*</span>
                </label>
                <Select
                  className="w-full h-12 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Select Or Search Referred Employee"
                  popupMatchSelectWidth={false}
                  showSearch
                  name="agent"
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  value={updateFormData?.agent || undefined}
                  onChange={(value) => handleAntInputDSelect("agent", value)}
                >
                  {employees.map((employee) => (
                    <Select.Option key={employee._id} value={employee._id}>
                      {employee.name} | {employee.phone_number}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Ticket <span className="text-red-500">*</span>
              </label>
              <select
                name="tickets"
                value={updateFormData.tickets}
                onChange={handleInputChange}
                disabled
                className="w-full h-12 p-3 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl"
              >
                <option value="">Select Ticket</option>
                {availableTickets
                  .concat([updateFormData.tickets])
                  .map((ticket, index) => (
                    <option key={index} value={ticket}>
                      {ticket}
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              Update
            </button>
          </form>
        </div>
      </Modal>

      {/* Remove Enrollment Modal */}
      <Modal
        isVisible={showModalRemove}
        onClose={() => {
          setShowModalRemove(false);
          setCurrentGroup(null);
        }}
      >
        <div className="py-6 px-5 lg:px-8 text-left bg-white rounded-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Please Select a Reason for Removal
            </h3>
          </div>

          {currentGroup && (
            <form onSubmit={handleRemoveGroup} className="space-y-4">
              <div>
                <label
                  htmlFor="removalReason"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Removal Reason <span className="text-red-500">*</span>
                </label>
                <select
                  id="removalReason"
                  name="removalReason"
                  value={removalReason}
                  onChange={(e) => setRemovalReason(e.target.value)}
                  required
                  className="w-full h-12 p-3 bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-xl focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">-- Select Reason --</option>
                  <option value="Group Closed">Group Closed</option>
                  <option value="Chit Cancellation">Chit Cancellation</option>
                  <option value="On Hold">On Hold</option>
                  <option value="In Active Customer">InActive Customer</option>
                  <option value="Legal">Legal</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200"
              >
                Remove
              </button>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Enroll;