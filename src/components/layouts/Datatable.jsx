import React, { useState, useMemo, useEffect } from "react";
import { Printer, ChevronLeft, ChevronRight } from "lucide-react";
import CircularLoader from "../loaders/CircularLoader";
import { RiFileExcel2Line } from "react-icons/ri";
import { Select } from "antd";
import imageInput from "../../assets/images/Agent.png";

const DataTable = ({
  printHeaderKeys = [],
  printHeaderValues = [],
  updateHandler = () => {},
  onClickHandler = () => {},
  catcher = "_id",
  isExportEnabled = true,
  data = [],
  columns = [],
  exportedFileName = "export.csv",
  exportedPdfName = "export.pdf",
  iconName = "",
  clickableIconName = "",
  Icon = "",
  ClickableIcon = "",
}) => {
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];

  const [currentPage, setCurrentPage] = useState(1);
  const [currentUserName, setCurrentUserName] = useState("System User");
  const [active, setActive] = useState({});
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const tempData = {};
    data.forEach((ele) => {
      tempData[ele._id] = false;
    });
    setActive(tempData);
  }, [data]);

  const onSelectRow = (_id) => {
    const tempActive = {};
    Object.keys(active).forEach((key) => {
      tempActive[key] = false;
    });
    setActive({ ...tempActive, [_id]: true });
  };

  const filterData = (data) =>
    data.filter((item) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(item[key]).toLowerCase() === value.toLowerCase();
      })
    );

  const sortData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const processedData = useMemo(() => {
    let processed = [...safeData];
    processed = filterData(processed);
    processed = sortData(processed);
    return processed;
  }, [safeData, filters, sortConfig]);

  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const exportToExcel = () => {
    const headers = safeColumns.map((col) => col.header).join(",");
    const rows = processedData
      .map((item) => safeColumns.map((col) => item[col.key]).join(","))
      .join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportedFileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userObj = JSON.parse(user);
        const name =
          userObj?.full_name ||
          userObj?.name ||
          userObj?.user?.full_name ||
          userObj?.user?.name ||
          "System User";
        setCurrentUserName(name);
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
      }
    }
  }, []);

  const printToPDF = () => {
    let showSummaryCards = true;
    let showCountCards = true;
    const date = new Date().toISOString().split("T")[0];
    const reportType = String(exportedPdfName || "").trim();
    const fileName = `${reportType}_${date}`;

    switch (reportType) {
      case "Groups":
      case "Customers":
      case "UnApproved Customer":
      case "Enrollments":
      case "Staff":
      case "Agents":
      case "Employees":
      case "Leads":
      case "Loans":
      case "Pigme":
      case "Auction":
      case "Chit Payments":
      case "Mobile App Enrollments":
      case "Guarantor":
      case "Tasks":
      case "All Customer Report":
      case "Group Report":
      case "Basic Group Report":
      case "Enrollment Report":
      case "Customer Report":
      case "Customer Ledger Report":
      case "Customer Payout Report":
      case "Employee Report":
      case "Commission Report":
      case "Auction Report":
      case "Lead Report":
      case "Pigme Report":
      case "Loan Report":
      case "Sales Report":
      case "Date-wise Group Report":
      case "Payment Summary Report":
      case "Collection Area":
      case "Dream Asset":
      case "Agent Approval":
        showSummaryCards = false;
        showCountCards = false;
        break;
      case "Daybook Report":
      case "Receipt Report":
        showSummaryCards = true;
        showCountCards = true;
        break;
      default:
        showSummaryCards = false;
        showCountCards = false;
        break;
    }

    const printContent = document.createElement("div");
    const now = new Date();
    const dateTimeString = now.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const totalAmount = processedData.reduce((sum, row) => {
      const amount = parseFloat(row.amount || row.Amount || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const totalCash = processedData
      .filter((row) => row.mode?.toLowerCase() === "cash")
      .reduce((sum, row) => sum + Number(row.amount || 0), 0);

    const totalOnline = processedData
      .filter((row) => row.mode?.toLowerCase() === "online")
      .reduce((sum, row) => sum + Number(row.amount || 0), 0);

    const totalCustomers = new Set(
      processedData.map((row) => row.name || row.user_id?.full_name)
    ).size;

    const totalOnlineCount = processedData.filter(
      (row) => row.mode?.toLowerCase() === "online"
    ).length;

    const totalCashCount = processedData.filter(
      (row) => row.mode?.toLowerCase() === "cash"
    ).length;

    printContent.innerHTML = `
      <style>
        @media print {
          body * { visibility: hidden; }
          .printable, .printable * { visibility: visible; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 13px; color: #333; margin: 0; }
          .printable { position: absolute; top: 0; left: 0; width: 100%; padding: 30px 40px; background: #fff; box-sizing: border-box; }
          .a4-border { border: 1px solid #d2d6dc; border-radius: 10px; padding: 20px; height: 100%; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
          .header-wrapper { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
          .logo-image { width: 260px; height: 130px; object-fit: contain; border-radius: 6px; }
          .title-block { display: flex; flex-direction: column; align-items: flex-end; }
          .title { font-weight: 700; font-size: 40px; color: #1e3a8a; margin: 0; line-height: 1.3; }
          .sub-title { font-size: 22px; color: #4b5563; margin: 4px 0 0 0; }
          .report-heading { text-align: center; font-size: 22px; font-weight: 600; color: #111827; margin: 20px 0 6px; padding: 10px 0; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; letter-spacing: 0.8px; }
          .report-date { text-align: center; font-size: 12px; color: #6b7280; margin-bottom: 20px; }
          .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 20px; }
          .info-grid h3 { font-size: 13px; margin: 4px 0; color: #374151; font-weight: 500; }
          .summary-cards { display: flex; gap: 14px; margin: 10px 0 24px; }
          .card { flex: 1; border-radius: 8px; text-align: center; padding: 14px 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          .card-title { font-size: 14px; color: #4b5563; margin: 0; font-weight: 600; }
          .card-value { font-size: 18px; font-weight: bold; color: #0f172a; margin-top: 4px; }
          .count-summary-cards { display: flex; gap: 14px; margin: 16px 0 20px; }
          .count-card { flex: 1; padding: 14px 12px; border-radius: 8px; text-align: center; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0; }
          .count-card.customer { background-color: #fef3c7; color: #92400e; }
          .count-card.cash { background-color: #bbf7d0; color: #047857; }
          .count-card.online { background-color: #dbeafe; color: #1e40af; }
          .count-card span { font-size: 18px; font-weight: bold; display: block; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12.5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 6px; overflow: hidden; }
          th { background-color: #eff6ff; color: #1e40af; font-weight: 600; padding: 10px 8px; border-bottom: 2px solid #bfdbfe; }
          td { padding: 8px; border-bottom: 1px solid #e2e8f0; color: #334155; }
          tr:nth-child(even) { background-color: #f9fafb; }
          tr:hover { background-color: #f1f5f9; }
          .signatures { margin-top: 36px; display: flex; justify-content: space-between; font-size: 13px; color: #1f2937; }
          .footer { font-size: 11px; color: #6b7280; text-align: center; margin-top: 30px; font-style: italic; }
        }
      </style>

      <div class="printable">
        <div class="a4-border">
          <div class="header-wrapper">
            ${imageInput ? `<img src="${imageInput}" class="logo-image" alt="Logo" />` : ""}
            <div class="title-block">
              <div class="title">MyChits Pvt Ltd</div>
              <div class="sub-title">#123, Main Road, Bengaluru, Karnataka – 560001</div>
            </div>
          </div>

          <div class="report-heading">${reportType || "Transaction Summary Report"}</div>
          <div class="report-date">${dateTimeString}</div>

          <div class="info-grid">
            ${printHeaderKeys.map((key, i) => `
              <div class="card">
                <div class="card-title">${key}</div>
                <div class="card-value">${printHeaderValues[i]}</div>
              </div>
            `).join("")}
          </div>

          ${showSummaryCards ? `
          <div class="summary-cards">
            <div class="card"><div class="card-title">Total Cash</div><div class="card-value">₹ ${totalCash.toLocaleString("en-IN")}</div></div>
            <div class="card"><div class="card-title">Total Online</div><div class="card-value">₹ ${totalOnline.toLocaleString("en-IN")}</div></div>
            <div class="card"><div class="card-title">Total Amount</div><div class="card-value">₹ ${totalAmount.toLocaleString("en-IN")}</div></div>
          </div>` : ""}

          ${showCountCards ? `
          <div class="count-summary-cards">
            <div class="count-card customer">Total Customers<br /><span>${totalCustomers}</span></div>
            <div class="count-card cash">Cash Payments<br /><span>${totalCashCount}</span></div>
            <div class="count-card online">Online Payments<br /><span>${totalOnlineCount}</span></div>
          </div>` : ""}

          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                ${safeColumns
                  .filter(col => col.key.toLowerCase() !== "action")
                  .map(col => `<th style="border: 1px solid #e2e8f0; padding: 6px; text-align: left;">${col.header}</th>`)
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${processedData
                .map(row => `
                  <tr>
                    ${safeColumns
                      .filter(col => col.key.toLowerCase() !== "action")
                      .map(col => `<td style="border: 1px solid #e2e8f0; padding: 6px;">${row[col.key] || "-"}</td>`)
                      .join("")}
                  </tr>`)
                .join("")}
            </tbody>
          </table>

          <div class="signatures">
            <div><strong>Issued By: </strong>${currentUserName}</div>
          </div>

          <div class="footer">
            <span class="auto-note">*** This is a computer generated document, no signature is required ***</span>
          </div>
        </div>
      </div>
    `;

    if (imageInput) {
      const img = new Image();
      img.src = imageInput;
      img.onload = () => {
        document.body.appendChild(printContent);
        document.title = fileName || "MyChits";
        window.print();
        document.body.removeChild(printContent);
        document.title = "MyChits";
      };
    } else {
      document.body.appendChild(printContent);
      document.title = fileName || "MyChits";
      window.print();
      document.body.removeChild(printContent);
      document.title = "MyChits";
    }
  };

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (!safeData.length || !safeColumns.length) {
    return <CircularLoader />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        {iconName && clickableIconName && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium shadow-sm border border-gray-200">
              {Icon}
              {iconName}
            </div>
            <button
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium shadow transition-colors duration-200"
              onClick={onClickHandler}
            >
              {ClickableIcon}
              {clickableIconName}
            </button>
          </div>
        )}

        {isExportEnabled && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-violet-200 hover:border-violet-300 transition-colors duration-200 text-md font-medium"
            >
              <RiFileExcel2Line className="text-xl" />
              Export to Excel
            </button>
            <button
              onClick={printToPDF}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-violet-200 hover:border-violet-300 transition-colors duration-200 text-md font-medium"
            >
              <Printer className="text-xl" />
              Print Report
            </button>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-md">
            <thead className="bg-violet-200 border-b border-violet-200">
              <tr>
                {safeColumns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-4 text-left font-semibold text-gray-800 uppercase tracking-wider cursor-pointer hover:bg-violet-100 transition-colors duration-150"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {sortConfig.key === column.key && (
                        <span className="text-violet-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Filter Row */}
            <tbody className="bg-gray-50">
              <tr>
                {safeColumns.map((column) => (
                  <td key={`filter-${column.key}`} className="px-6 py-3">
                    {column.key.toLowerCase() !== "action" && (
                      <Select
                        className="w-full"
                        popupMatchSelectWidth={false}
                        showSearch
                        value={filters[column.key] || ""}
                        onChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            [column.key]: value,
                          }))
                        }
                        filterOption={(input, option) =>
                          option.children
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        placeholder="Filter..."
                        size="small"
                      >
                        <Select.Option value="">All</Select.Option>
                        {[...new Set(safeData.map((item) => item[column.key]))]
                          .filter(Boolean)
                          .map((value) => (
                            <Select.Option key={String(value)} value={String(value)}>
                              {String(value)}
                            </Select.Option>
                          ))}
                      </Select>
                    )}
                  </td>
                ))}
              </tr>

              {/* Data Rows */}
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => onSelectRow(row._id)}
                  onDoubleClick={() => updateHandler(row[catcher])}
                  className={`cursor-pointer transition-colors duration-150 ${
                    active[row._id]
                      ? "bg-blue-50 border-l-4 border-violet-600"
                      : index % 2 === 0
                      ? "bg-white hover:bg-violet-200"
                      : "bg-gray-100 hover:bg-violet-200"
                  }`}
                >
                  {safeColumns.map((column) => (
                    <td
                      key={`${index}-${column.key}`}
                      className="px-6 py-4 border-t border-gray-100"
                    >
                      {row[column.key] !== undefined && row[column.key] !== null
                        ? row[column.key]
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap justify-between items-center p-5 bg-gray-50 border-t border-gray-200">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm"
          >
            {[5, 10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              aria-label="Next Page"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;