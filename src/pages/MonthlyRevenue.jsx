import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CircularLoader from "../components/loaders/CircularLoader";
import { Select, DatePicker, Button, Card, Row, Col, Space, Tooltip } from "antd";
import {
  SyncOutlined,
  FilterOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const MonthlyRevenue = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false); // Optional: start hidden

  // Filters
  const [groupList, setGroupList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  const formatPayDate = (dateString) => {
    return dateString?.split("T")[0];
  };

  const fetchPayments = async (filters = {}) => {
    try {
      setLoading(true);

      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      let from_date, to_date;

      if (filters.dateRange && filters.dateRange.length === 2) {
        from_date = filters.dateRange[0].format("YYYY-MM-DD");
        to_date = filters.dateRange[1].format("YYYY-MM-DD");
      } else {
        from_date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;
        to_date = new Date(currentYear, currentMonth + 1, 0).toISOString().split("T")[0];
      }

      const resMonthly = await api.get("/payment/get-current-month-payment", {
        params: { from_date, to_date },
      });
      setMonthlyRevenue(resMonthly.data?.monthlyPayment || 0);


      const resPayments = await api.get("/payment/get-payments-by-dates", {
        params: { from_date, to_date },
      });

      let data = resPayments.data || [];


      if (filters.group) {
        data = data.filter((p) => p.group_id?._id === filters.group);
      }

      const formattedData = data.map((p, i) => ({
        id: i + 1,
        customer: p?.user_id?.full_name,
        phone: p?.user_id?.phone_number,
        group: p?.group_id?.group_name,
        ticket: p.ticket,
        receipt: p.receipt_no,
        amount: p.amount,
        pay_type: p.pay_type,
        date: formatPayDate(p?.pay_date),
        collected_by:
          p?.collected_by?.name || p?.admin_type?.admin_name || "Super Admin",
      }));

      setPayments(formattedData);
    } catch (err) {
      console.error("Error fetching monthly revenue data:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
       
        const resGroups = await api.get("/group/get-group-admin");
        setGroupList(resGroups.data || []);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
      fetchPayments({});
    };
    init();
  }, []);

  const handleFilterChange = () => {
    fetchPayments({
      group: selectedGroup,
      dateRange,
    });
  };

  const handleClearFilters = () => {
    setSelectedGroup(null);
    setDateRange(null);
    fetchPayments({});
  };

  const columns = [
    { key: "id", header: "SL. NO", width: 60 },
    { key: "date", header: "Paid Date" },
    { key: "customer", header: "Customer Name" },
    { key: "phone", header: "Phone" },
    { key: "group", header: "Group" },
    { key: "ticket", header: "Ticket #" },
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
          
          <div className="mb-6 bg-white shadow-sm rounded-lg p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Monthly Revenue</h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-sm font-medium">
                  <span className="font-bold text-2xl">{monthlyRevenue.toLocaleString()}</span>
                </div>
              </div>

             
              <div className="flex items-center gap-2">
                <Tooltip title="Refresh Data">
                  <Button
                    icon={<SyncOutlined />}
                    onClick={() => fetchPayments({})}
                    size="large"
                    type="text"
                    className="text-gray-600 hover:text-violet-600"
                  />
                </Tooltip>

                <Tooltip title={isFilterVisible ? "Hide Filters" : "Show Filters"}>
                  <Button
                    icon={isFilterVisible ? <CloseCircleOutlined /> : <FilterOutlined />}
                    size="large"
                    type="text"
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className={`${isFilterVisible ? "text-violet-600" : "text-gray-600"} hover:text-violet-700`}
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
              exportedPdfName="Monthly Revenue"
              exportedFileName="MonthlyRevenue.csv"
            />
          ) : (
            <Card className="text-center py-12 bg-white shadow-sm rounded-lg">
              <div className="text-gray-500 text-lg">
                No payments found for this period. Try adjusting your filters.
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default MonthlyRevenue;