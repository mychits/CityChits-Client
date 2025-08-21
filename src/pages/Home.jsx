import Sidebar from "../components/layouts/Sidebar";
import { MdGroups, MdOutlinePayments, MdGroupWork } from "react-icons/md";
import { FaUserLock } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { useEffect, useState } from "react";
import api from "../instance/TokenInstance";
import CustomCard from "../components/cards/CustomCard";

const Home = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [paymentsValue, setPaymentsValue] = useState("0");
  const [paymentsPerMonthValue, setPaymentsPerMonthValue] = useState("0");
  const [searchValue, setSearchValue] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [hidePayment, setHidePayment] = useState(false);


  useEffect(() => {
    const user = localStorage.getItem("user");
    const userObj = JSON.parse(user);
    if (
      userObj &&
      userObj.admin_access_right_id?.access_permissions?.edit_payment
    ) {
      const isModify =
        userObj.admin_access_right_id?.access_permissions?.edit_payment ===
        "true";
      setHidePayment(isModify);
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
  }, [reloadTrigger]);

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
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get("/agent/get");
        setAgents(response.data?.agent || []);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await api.get("/agent/get-agent");
        setStaffs(response.data || []);
      } catch (error) {
        console.error("Error fetching staffs:", error);
      }
    };
    fetchStaffs();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/agent/get-employee");
        setEmployees(response.data?.employee || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchTotalPayments = async () => {
      try {
        const response = await api.get("/payment/get-total-payment-amount");
        setPaymentsValue(response?.data?.totalAmount || 0);
      } catch (error) {
        console.error("Error fetching total payment amount:", error);
      }
    };
    fetchTotalPayments();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchMonthlyPayments = async () => {
      try {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const lastDayFormatted = lastDay.toISOString().split("T")[0];

        const response = await api.get("/payment/get-current-month-payment", {
          params: {
            from_date: firstDay,
            to_date: lastDayFormatted,
          },
        });

        setPaymentsPerMonthValue(response?.data?.monthlyPayment || 0);
      } catch (error) {
        console.error("Error fetching monthly payment data:", error);
      }
    };
    fetchMonthlyPayments();
  }, [reloadTrigger]);

  const cardData = [
    {
      icon: MdGroupWork,
      title: "Groups",
      value: groups.length,
      titleColor: "text-custom-blue",
      color: "bg-custom-blue",
      redirect: "/group",
      key: "1",
    },
    {
      icon: MdGroups,
      title: "Customers",
      value: users.length,
      titleColor: "text-custom-yellow",
      color: "bg-custom-yellow",
      redirect: "/user",
      key: "2",
    },
		{
		icon: FaUserLock,
		title: "Staff",
		value: staffs.length,
		titleColor: "text-custom-pink",
		color: "bg-custom-pink",
		redirect: "/staff",
		key: "4",
		},
    {
      icon: FaUserLock,
      title: "Agents",
      value: agents.length,
      titleColor: "text-custom-violet",
      color: "bg-custom-violet",
      redirect: "/agent",
      key: "3",
    },
    {
      icon: FaUserLock,
      title: "Employees",
      value: employees.length,
      titleColor: "text-custom-orange",
      color: "bg-custom-orange",
      redirect: "/employee",
      key: "5",
    },
    
            {
              icon: MdOutlinePayments,
              title: "Payments",
              value: ` ${paymentsValue}`,
              titleColor: "text-custom-green",
              color: "bg-custom-green",
              redirect: "/payment",
              key: "6",
            },
            {
              icon: SlCalender,
              title: "Current Month Payments",
              value: ` ${paymentsPerMonthValue}`,
              titleColor: "text-custom-dark-blue",
              color: "bg-custom-dark-blue",
              redirect: "/payment",
              key: "7",
            }
          
    
  ].filter((card) =>
    card.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const onGlobalSearchChangeHandler = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      <div className="flex mt-20">
        <Sidebar
          navSearchBarVisibility={true}
          onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
        />
        <div className="flex-grow p-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 w-full">
            {cardData.map((card) => (
              <CustomCard cardData={card} key={card.key} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
