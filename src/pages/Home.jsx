import Sidebar from "../components/layouts/Sidebar";
import { MdGroups } from "react-icons/md";
import { FaUserLock } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { MdGroupWork } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { useEffect, useState } from "react";
import api from "../instance/TokenInstance";

import CustomCard from "../components/cards/CustomCard";
const Home = () => {
	const [groups, setGroups] = useState([]);
	const [users, setUsers] = useState([]);
	const [agents, setAgents] = useState([]);
	const [payments, setPayments] = useState([]);
	const [paymentsValue, setPaymentsValue] = useState("...");
	const [paymentsPerMonth, setPaymentsPerMonth] = useState([]);
	const [paymentsPerMonthValue, setPaymentsPerMonthValue] = useState("...");
	const [searchValue, setSearchValue] = useState("");

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

	useEffect(() => {
		const fetchAgents = async () => {
			try {
				const response = await api.get("/agent/get-agent");
				setAgents(response.data);
			} catch (error) {
				console.error("Error fetching agent data:", error);
			}
		};
		fetchAgents();
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
		const fetchPayments = async () => {
			try {
				const response = await api.get("/payment/get-payment");
				const paymentData = response.data;
				const totalAmount = paymentData.reduce(
					(sum, payment) => sum + Number(payment.amount || 0),
					0
				);

				setPaymentsValue(totalAmount);
			} catch (error) {
				console.error("Error fetching payment data:", error);
			}
		};
		fetchPayments();
	}, []);

	useEffect(() => {
		const fetchMonthlyPayments = async () => {
			try {
				const today = new Date();
				const currentMonth = today.getMonth();
				const currentYear = today.getFullYear();
				const firstDay = `${currentYear}-${String(currentMonth + 1).padStart(
					2,
					"0"
				)}-01`;

				const lastDay = new Date(currentYear, currentMonth + 1, 0);
				const lastDayFormatted = lastDay.toISOString().split("T")[0];

				const response = await api.get("/payment/get-report-receipt", {
					params: {
						from_date: firstDay,
						to_date: lastDayFormatted,
					},
				});

				setPaymentsPerMonth(response.data);

				const totalAmount = response.data.reduce((sum, payment) => {
					return sum + Number(payment.amount || 0);
				}, 0);
				setPaymentsPerMonthValue(totalAmount);
			} catch (err) {
				console.error("Error fetching monthly payment data:", err.message);
			}
		};
		fetchMonthlyPayments();
	}, []);

	const cardData = [
		{
			icon: MdGroupWork,
			title: "Groups",
			value: groups.length,
			titleColor: "text-custom-blue",
			color: "bg-custom-blue",
			redirect: "/group",
			key: "*1",
		},
		{
			icon: MdGroups,
			title: "Customers",
			value: users.length,
			color: "bg-custom-yellow",
			titleColor: "text-custom-yellow",
			redirect: "/user",
			key: "*2",
		},
		{
			icon: FaUserLock,
			title: "Agents",
			value: agents.length,
			color: "bg-custom-violet",
			titleColor: "text-custom-violet",
			redirect: "/agent",
			key: "*3",
		},
		{
			icon: MdOutlinePayments,
			title: "Payments",
			value: `Rs. ${paymentsValue}`,
			color: "bg-custom-green",
			titleColor: "text-custom-green",
			redirect: "/payment",
			key: "*4",
		},
		{
			icon: SlCalender,
			title: "Current Month Payments",
			value: `Rs. ${paymentsPerMonthValue}`,
			color: "bg-custom-dark-blue",
			titleColor: "text-custom-dark-blue",
			redirect: "/payment",
			key: "*5",
		},
	].filter((ele) =>
		ele.title.toLowerCase().includes(searchValue.toLocaleLowerCase())
	);
	const onGlobalSearchChangeHandler = (e) => {
		const { value } = e.target;
		console.log("first", value);
		setSearchValue(value);
	};

	return (
		<>
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
		</>
	);
};

export default Home;
