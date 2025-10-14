import React, { useEffect, useState, useMemo } from "react";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CircularLoader from "../components/loaders/CircularLoader";
import { Select } from "antd";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";
import { FaWhatsapp } from "react-icons/fa";
import { notification } from "antd";
import { Ticket } from "lucide-react";

const AuctionInformation = () => {
  const [searchText, setSearchText] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [groupFilter, setGroupFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeUserData, setActiveUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [notifier, contextHolder] = notification.useNotification();
  const [selectAll, setSelectAll] = useState(false);
  const [auctionData, setAuctionData] = useState([]);

  //const groupOptions = [...new Set(usersData.map((u) => u.groupName))];
  const groupOptions = [
    ...new Set(
      usersData
        .filter(
          (u) =>
            u.groupName !== undefined &&
            u.groupName !== "" &&
            u.groupName !== "   "
        ) // Filter out undefined, empty, and whitespace-only values
        .map((u) => u.groupName)
    ),
  ];
  const filteredUsers = useMemo(() => {
    const filtered = filterOption(
      usersData.filter((u) => {
        const matchGroup = groupFilter ? u.groupName === groupFilter : true;
        const enrollmentDate = new Date(u.enrollmentDate);
        const matchFromDate = fromDate
          ? enrollmentDate >= new Date(fromDate)
          : true;
        const matchToDate = toDate ? enrollmentDate <= new Date(toDate) : true;
        return matchGroup && matchFromDate && matchToDate;
      }),
      searchText
    );

    return filtered.map((user, index) => {
      const isSelected = !!activeUserData[user._id]?.info?.status;

      return {
        ...user,
        sl_no: index + 1,
        checkBoxs: (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              setActiveUserData((prev) => ({
                ...prev,
                [user._id]: {
                  info: {
                    status: e.target.checked,
                    userPhone: user.userPhone,
                    groupName: user.groupName,
                    groupMembers: user.groupMembers,
                    userName: user.userName,
                    //  ticket: user.ticket,
                    winAmount: user.winAmount,
                    bidPercent: user.bidPercent,
                    bidAmount: user.bidAmount,
                    groupId: user.groupId?._id,
                    // userId: user.userId,
                  },
                },
              }));
            }}
          />
        ),
        isSelected,
      };
    });
  }, [usersData, groupFilter, fromDate, toDate, searchText, activeUserData]);

  const visibleSelectedCount = useMemo(() => {
    return filteredUsers.filter((user) => user.isSelected).length;
  }, [filteredUsers]);

  const sendWhatsapp = async () => {
    const key = "updatable";
    try {
      notifier.open({
        key,
        message: "Sending Messages Via Whatsapp..",
        description: "Processing...",
        className: "bg-green-300 rounded-lg font-bold",
        duration: 2,
      });

      const visibleActiveUsers = {};
      filteredUsers.forEach((user) => {
        if (user.isSelected && activeUserData[user._id]) {
          visibleActiveUsers[user._id] = activeUserData[user._id];
        }
      });

      await api.post("/whatsapp/auction-winner-document-list", {
        receivers: visibleActiveUsers,
      });

      const newActiveUserData = { ...activeUserData };
      filteredUsers.forEach((user) => {
        if (user.isSelected) {
          delete newActiveUserData[user._id];
        }
      });
      setActiveUserData(newActiveUserData);

      notifier.open({
        key,
        message: "Whatsapp Messages Has Been Sent Successfully",
        description: "Success",
        className: "bg-green-300 rounded-lg font-bold",
        duration: 2,
      });
    } catch (err) {
      notifier.open({
        key,
        message: "Failed to Send Whatsapp",
        description: err.message || "Something went wrong",
        className: "bg-red-300 rounded-lg font-bold",
        duration: 2,
      });
    }
  };
  useEffect(() => {
    // Automatically update selectAll based on filteredUsers
    const allChecked =
      filteredUsers.length > 0 &&
      filteredUsers.every((user) => activeUserData[user._id]?.info?.status);
    setSelectAll(allChecked);
  }, [filteredUsers, activeUserData]);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const reportResponse = await api.get("/auction/get-auction");
      console.info(reportResponse.data, "ghsjgsjg");
      const usersList = [];
      const tempActive = {};

      const auctionData = reportResponse.data?.auction?.map(
        (auction, index) => {
          const id = auction._id;
          const userName = auction.user_id?.full_name;
          const groupId = auction.group_id;
          const userPhone = auction.user_id?.phone_number;
          const groupName = auction.group_id?.group_name;
          const groupMembers = auction.group_id?.group_members;
          const winAmount = auction?.win_amount;
          const bidAmount =
            Number(auction?.group_id?.group_value) -
            Number(auction?.win_amount);
          const bidPercentage =
            (Number(bidAmount) * 100) / Number(auction?.group_id?.group_value);
          const ticket = auction.ticket;
          //  const installmentNumber = index + 1;

          tempActive[id] = {
            info: { status: false },
          };
          const tempUser = {
            _id: id,
            userName,
            userPhone,
            groupName,
            ticket,
            winAmount,
            groupMembers,
            enrollmentDate: auction.group_id?.createdAt,
            bidAmount,
            groupId,
            bidPercentage,
            //  installmentNumber,
          };
          usersList.push(tempUser);

          return {
            slNo: index + 1,
            groupName,
            userPhone,
            userName,
            ticket,
            winAmount,
            bidAmount,
            bidPercentage,
            groupMembers,
            groupId,
            // installmentNumber: index + 1,
          };
        }
      );
      setAuctionData(auctionData);
      console.log(usersList, "userslist");
      setUsersData(usersList);
      setTotalUsers(usersList.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Auctioncolumns = [
    { key: "sl_no", header: "SL. NO" },
    { key: "checkBoxs", header: "Select User" },
    { key: "userName", header: "Customer Name" },
    { key: "userPhone", header: "Phone Number" },
    // { key: "customerId", header: "Customer Id" },
    { key: "groupName", header: "Group Name" },
    { key: "ticket", header: "Ticket" },
    { key: "winAmount", header: "win Amount" },
    { key: "bidAmount", header: "Bid Amount" },
    { key: "bidPercentage", header: "Bid Percentage" },
    //  {key: "installmentNumber", header: "installment Number"}
    //  {key: "paymentsTicket", header: "Ticket"},
  ];

  return (
    <div className="w-screen">
      <div className="flex mt-30">
        <Navbar
          onGlobalSearchChangeHandler={(e) => setSearchText(e.target.value)}
          visibility={true}
        />
        {isLoading ? (
          <div className="w-full">
            <CircularLoader color="text-green-600" />
          </div>
        ) : (
          <div className="flex-grow p-7">
            <h1 className="text-2xl font-bold text-center">
              Auction Information
            </h1>
            {contextHolder}
            <div className="mt-6 mb-8">
              <div className="flex justify-start border-b border-gray-300 mb-4"></div>
              <div className="mt-10">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Group
                    </label>
                    <Select
                      style={{ width: 200 }}
                      allowClear
                      placeholder="--All groups--"
                      onChange={(value) => setGroupFilter(value)}
                      value={groupFilter || undefined}
                      className="w-full max-w-xs h-11 "
                    >
                      {groupOptions.map((group) => (
                        <Select.Option key={group} value={group}>
                          {group}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-5">
                      Select All
                    </label>
                    <input
                      type="checkbox"
                      className="ml-4 w-4 h-4 mb-3"
                      checked={selectAll}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectAll(checked); // Set global checkbox state

                        const updatedData = { ...activeUserData };

                        // Loop through all filtered users and apply the selection
                        filteredUsers.forEach((user) => {
                          updatedData[user._id] = {
                            info: {
                              status: checked,
                              userPhone: user.userPhone,
                              groupName: user.groupName,
                              groupMembers: user.groupMembers,
                              userName: user.userName,
                              //  ticket: user.ticket,
                              winAmount: user.winAmount,
                              bidPercent: user.bidPercent,
                              bidAmount: user.bidAmount,
                              groupId: user.groupId?._id,
                              // userId: user.userId,
                            },
                          };
                        });

                        setActiveUserData(updatedData);
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={sendWhatsapp}
                    className="relative bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition duration-200 flex items-center"
                  >
                    {visibleSelectedCount > 0 && (
                      <div
                        className="min-w-6 h-6 absolute -right-3 -top-2 shadow-lg hover:bg-red-600 bg-red-400 rounded-full text-white flex items-center justify-center text-xs"
                        title={`Message will be sent to total ${visibleSelectedCount} customers`}
                      >
                        <span>{visibleSelectedCount}</span>
                      </div>
                    )}
                    <FaWhatsapp className="mr-2" size={20} />
                    WhatsApp
                  </button>
                </div>
                <DataTable
                  data={filteredUsers}
                  columns={Auctioncolumns}
                  catcher="_id"
                  exportedPdfName="Auction Information"
                  printHeaderKeys={["Group Name"]}
                  printHeaderValues={[groupFilter]}
                  exportedFileName={`Auction Information.csv`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionInformation;
