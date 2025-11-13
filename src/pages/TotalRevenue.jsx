import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CircularLoader from "../components/loaders/CircularLoader";
import { Select, DatePicker, Button, Card, Row, Col, Space, Tag, Tooltip } from "antd";
import { SyncOutlined, DownloadOutlined, PrinterOutlined, FilterOutlined, CloseCircleOutlined } from "@ant-design/icons";

const TotalRevenue = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(true); // Toggle filters

  // Filters
  const [groupList, setGroupList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [paidDate, setPaidDate] = useState(null);
  const [txnDate, setTxnDate] = useState(null);
  const [paymentType, setPaymentType] = useState(null);

  const formatPayDate = (dateString) => {
    return dateString?.split("T")[0];
  };

  const fetchPayments = async (filters = {}) => {
    try {
      setLoading(true);

      const resPayments = await api.get("/payment/get-payment", {
       
      });

      let data = resPayments.data || [];

      if (filters.group) {
        data = data.filter((p) => p.group_id?._id === filters.group);
      }
      if (filters.paidDate) {
        data = data.filter((p) => formatPayDate(p.pay_date) === filters.paidDate);
      }
      if (filters.txnDate) {
        data = data.filter((p) => formatPayDate(p.createdAt) === filters.txnDate);
      }
      if (filters.paymentType) {
        data = data.filter((p) => p.pay_type === filters.paymentType);
      }

      const formattedData = data.map((p, index) => ({
        _id: p._id,
        id: index + 1,
        name: p?.user_id?.full_name,
        phone_number: p?.user_id?.phone_number,
        group_name: p?.group_id?.group_name,
        ticket: p.ticket,
        receipt: p.receipt_no,
        old_receipt: p.old_receipt_no,
        amount: p.amount,
        pay_type: p.pay_type,
        date: formatPayDate(p?.pay_date),
        transaction_date: formatPayDate(p?.createdAt),
        collected_by: p?.collected_by?.name || p?.admin_type?.admin_name || "Super Admin",
      }));

      setPayments(formattedData);
    } catch (err) {
      console.error("Error fetching total revenue ", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);

        const [resTotal, resGroups] = await Promise.all([
          api.get("/payment/get-total-payment-amount"),
          api.get("/group/get-group-admin"),
        ]);

        setTotalRevenue(resTotal.data?.totalAmount || 0);
        setGroupList(resGroups.data || []);
        fetchPayments({});
      } catch (err) {
        console.error("Error fetching initial revenue ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleFilterChange = () => {
    fetchPayments({
      group: selectedGroup,
      paidDate: paidDate ? paidDate.format("YYYY-MM-DD") : null,
      txnDate: txnDate ? txnDate.format("YYYY-MM-DD") : null,
      paymentType,
    });
  };

  const handleClearFilters = () => {
    setSelectedGroup(null);
    setPaidDate(null);
    setTxnDate(null);
    setPaymentType(null);
    fetchPayments({});
  };

  const columns = [
    { key: "id", header: "SL. NO", width: 60 },
    { key: "date", header: "Paid Date" },
    { key: "transaction_date", header: "Transaction Date" },
    { key: "name", header: "Customer Name" },
    { key: "phone_number", header: "Phone" },
    { key: "group_name", header: "Group" },
    { key: "ticket", header: "Ticket #" },
    { key: "old_receipt", header: "Old Receipt" },
    { key: "receipt", header: "Receipt #" },
    { key: "amount", header: "Amount", align: "right" },
    { key: "pay_type", header: "Payment Type" },
    { key: "collected_by", header: "Collected By" },
  ];

  return (
    <div className="flex min-h-screen mt-20 bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Navbar visibility={true} />

        <main className="flex-grow p-4 md:p-6">
          {/* Sticky Header Section */}
          <div className="mb-6 bg-white shadow-sm rounded-lg p-4 border-b border-gray-200">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Title + Metric */}
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Total Revenue</h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-sm font-medium">
                  
                  <span className="font-bold text-2xl">{totalRevenue.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Tooltip title="Refresh Data">
                  <Button
                    icon={<SyncOutlined />}
                    onClick={() => fetchPayments({})}
                    size="large"
                    type="text"
                    className="text-gray-600  hover:text-violet-600"
                  />
                </Tooltip>

               

                <Tooltip title={isFilterVisible ? "Hide Filters" : "Show Filters"}>
                  <Button
                    icon={isFilterVisible ? <CloseCircleOutlined /> : <FilterOutlined />}
                    size="large"
                    type="text"
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className={`${
                      isFilterVisible ? "text-violet-600" : "text-gray-600"
                    } hover:text-violet-700`}
                  />
                </Tooltip>
              </div>
            </div>

            {/* Collapsible Filters */}
            {isFilterVisible && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Row gutter={[8, 8]} className="flex-wrap">
                  <Col xs={24} sm={12} md={6} lg={4}>
                    <Select
                      allowClear
                      placeholder="Group"
                      className="w-full"
                      value={selectedGroup}
                      onChange={setSelectedGroup}
                      options={groupList.map((g) => ({
                        label: g.group_name,
                        value: g._id,
                      }))}
                      size="small"
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={4}>
                    <DatePicker
                      placeholder="Paid Date"
                      value={paidDate}
                      onChange={setPaidDate}
                      className="w-full"
                      size="small"
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={4}>
                    <DatePicker
                      placeholder="Txn Date"
                      value={txnDate}
                      onChange={setTxnDate}
                      className="w-full"
                      size="small"
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={4}>
                    <Select
                      allowClear
                      placeholder="Payment Type"
                      className="w-full"
                      value={paymentType}
                      onChange={setPaymentType}
                      options={[
                        { label: "Cash", value: "cash" },
                        { label: "Online", value: "online" },
                        { label: "Online/UPI", value: "online/upi" },
                        { label: "Cheque", value: "cheque" },
                      ]}
                      size="small"
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={4}>
                    <Space>
                      <Button
                        size="small"
                        type="text"
                        onClick={handleClearFilters}
                        className="text-gray-500 hover:text-red-500"
                      >
                        Clear All
                      </Button>
                      <Button
                        size="small"
                        type="primary"
                        onClick={handleFilterChange}
                        loading={loading}
                        className="bg-violet-600 hover:bg-violet-700"
                      >
                        Apply
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </div>
            )}
          </div>

          {/* Data Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <CircularLoader isLoading={true} data="Revenue Data" />
            </div>
          ) : payments.length > 0 ? (
            <DataTable
              data={payments}
              columns={columns}
              exportedPdfName="Total Revenue"
              exportedFileName="TotalRevenue.csv"
            />
          ) : (
            <Card className="text-center py-12 bg-white shadow-sm rounded-lg">
              <div className="text-gray-500 text-lg">
                No payments found. Try adjusting your filters.
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default TotalRevenue;