import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Printer, ChevronLeft, ChevronRight, ArrowUpDown, Download, Filter, Search, Grid3x3, List, MoreVertical, X, Check } from "lucide-react";
import CircularLoader from "../loaders/CircularLoader";
import { RiFileExcel2Line } from "react-icons/ri";
import { Select, Tooltip, Dropdown, Menu } from "antd";
import imageInput from "../../assets/images/Agent.png";

// Helper functions
const generateFileName = (baseName, extension) => {
  const date = new Date().toISOString().split("T")[0];
  return `${baseName}_${date}.${extension}`;
};

const calculateTotals = (data) => {
  const totalAmount = data.reduce((sum, row) => {
    const amount = parseFloat(row.amount || row.Amount || 0);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalCash = data
    .filter((row) => row.mode?.toLowerCase() === "cash")
    .reduce((sum, row) => sum + Number(row.amount || 0), 0);

  const totalOnline = data
    .filter((row) => row.mode?.toLowerCase() === "online")
    .reduce((sum, row) => sum + Number(row.amount || 0), 0);

  return { totalAmount, totalCash, totalOnline };
};

const calculateCounts = (data) => {
  const totalCustomers = new Set(
    data.map((row) => row.name || row.user_id?.full_name)
  ).size;

  const totalOnlineCount = data.filter(
    (row) => row.mode?.toLowerCase() === "online"
  ).length;

  const totalCashCount = data.filter(
    (row) => row.mode?.toLowerCase() === "cash"
  ).length;

  return { totalCustomers, totalOnlineCount, totalCashCount };
};

const shouldShowCards = (reportType) => {
  const summaryCardsReports = [
    "Daybook Report",
    "Receipt Report"
  ];
  
  return summaryCardsReports.includes(reportType);
};

// Main component
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
  const [viewMode, setViewMode] = useState("table"); // table or grid
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Initialize active state
  useEffect(() => {
    const tempData = {};
    data.forEach((ele) => {
      tempData[ele._id] = false;
    });
    setActive(tempData);
  }, [data]);

  // Get current user from localStorage
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

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let processed = [...safeData];
    
    // Apply search
    if (searchTerm) {
      processed = processed.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply filters
    processed = processed.filter((item) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(item[key]).toLowerCase() === value.toLowerCase();
      })
    );
    
    // Apply sorting
    if (sortConfig.key) {
      processed.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    return processed;
  }, [safeData, filters, sortConfig, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Event handlers
  const onSelectRow = useCallback((_id) => {
    const tempActive = {};
    Object.keys(active).forEach((key) => {
      tempActive[key] = false;
    });
    setActive({ ...tempActive, [_id]: true });
  }, [active]);

  const handleSort = useCallback((key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  const toggleRowSelection = useCallback((id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  }, [selectedRows]);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  // Export functionality
  const exportToExcel = useCallback(() => {
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
  }, [safeColumns, processedData, exportedFileName]);

  // Print functionality
  const printToPDF = useCallback(() => {
    const reportType = String(exportedPdfName || "").trim();
    const fileName = generateFileName(reportType, "pdf");
    const now = new Date();
    const dateTimeString = now.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const { totalAmount, totalCash, totalOnline } = calculateTotals(processedData);
    const { totalCustomers, totalOnlineCount, totalCashCount } = calculateCounts(processedData);
    const showCards = shouldShowCards(reportType);

    const printContent = document.createElement("div");
    printContent.innerHTML = `
      <style>
        @media print {
          body * { visibility: hidden; }
          .printable, .printable * { visibility: visible; }
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #1e293b; margin: 0; }
          .printable { position: absolute; top: 0; left: 0; width: 100%; padding: 40px; background: #fff; box-sizing: border-box; }
          .a4-border { border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; height: 100%; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
          .header-wrapper { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #e2e8f0; }
          .logo-image { width: 280px; height: 140px; object-fit: contain; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .title-block { display: flex; flex-direction: column; align-items: flex-end; }
          .title { font-weight: 800; font-size: 42px; color: #0f172a; margin: 0; line-height: 1.2; letter-spacing: -0.5px; }
          .sub-title { font-size: 18px; color: #64748b; margin: 8px 0 0 0; font-weight: 500; }
          .report-heading { text-align: center; font-size: 28px; font-weight: 700; color: #0f172a; margin: 32px 0 16px; padding: 16px; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 12px; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
          .report-date { text-align: center; font-size: 14px; color: #64748b; margin-bottom: 32px; font-weight: 500; }
          .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
          .info-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; }
          .info-card-title { font-size: 14px; color: #64748b; margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          .info-card-value { font-size: 24px; font-weight: 700; color: #0f172a; }
          .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 24px 0 32px; }
          .summary-card { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 24px; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; position: relative; overflow: hidden; }
          .summary-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #3b82f6, #8b5cf6); }
          .summary-card-title { font-size: 14px; color: #64748b; margin-bottom: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          .summary-card-value { font-size: 32px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
          .summary-card-change { font-size: 12px; color: #10b981; font-weight: 600; }
          .count-summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 24px 0 32px; }
          .count-card { border-radius: 16px; padding: 24px; text-align: center; font-weight: 700; position: relative; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
          .count-card.customer { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #92400e; }
          .count-card.cash { background: linear-gradient(135deg, #bbf7d0 0%, #86efac 100%); color: #047857; }
          .count-card.online { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #1e40af; }
          .count-card-label { font-size: 14px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9; }
          .count-card-value { font-size: 36px; font-weight: 800; }
          table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 24px; font-size: 13px; box-shadow: 0 2px 16px rgba(0,0,0,0.06); border-radius: 12px; overflow: hidden; }
          th { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); color: #0f172a; font-weight: 700; padding: 16px; border-bottom: 2px solid #e2e8f0; text-transform: uppercase; letter-spacing: 0.5px; font-size: 12px; }
          td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #475569; }
          tr:nth-child(even) { background: #fafbfc; }
          tr:hover { background: #f8fafc; }
          .signatures { margin-top: 48px; display: flex; justify-content: space-between; font-size: 14px; color: #475569; }
          .signature-box { padding: 16px; border-top: 2px solid #e2e8f0; width: 200px; }
          .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 40px; font-style: italic; }
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
          <div class="report-date">Generated on ${dateTimeString}</div>

          <div class="info-grid">
            ${printHeaderKeys.map((key, i) => `
              <div class="info-card">
                <div class="info-card-title">${key}</div>
                <div class="info-card-value">${printHeaderValues[i]}</div>
              </div>
            `).join("")}
          </div>

          ${showCards ? `
          <div class="summary-cards">
            <div class="summary-card">
              <div class="summary-card-title">Total Cash</div>
              <div class="summary-card-value">₹ ${totalCash.toLocaleString("en-IN")}</div>
              <div class="summary-card-change">▲ 12.5% from last month</div>
            </div>
            <div class="summary-card">
              <div class="summary-card-title">Total Online</div>
              <div class="summary-card-value">₹ ${totalOnline.toLocaleString("en-IN")}</div>
              <div class="summary-card-change">▲ 8.3% from last month</div>
            </div>
            <div class="summary-card">
              <div class="summary-card-title">Total Amount</div>
              <div class="summary-card-value">₹ ${totalAmount.toLocaleString("en-IN")}</div>
              <div class="summary-card-change">▲ 10.2% from last month</div>
            </div>
          </div>
          <div class="count-summary-cards">
            <div class="count-card customer">
              <div class="count-card-label">Total Customers</div>
              <div class="count-card-value">${totalCustomers}</div>
            </div>
            <div class="count-card cash">
              <div class="count-card-label">Cash Payments</div>
              <div class="count-card-value">${totalCashCount}</div>
            </div>
            <div class="count-card online">
              <div class="count-card-label">Online Payments</div>
              <div class="count-card-value">${totalOnlineCount}</div>
            </div>
          </div>` : ""}

          <table>
            <thead>
              <tr>
                ${safeColumns
                  .filter(col => col.key.toLowerCase() !== "action")
                  .map(col => `<th>${col.header}</th>`)
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${processedData
                .map(row => `
                  <tr>
                    ${safeColumns
                      .filter(col => col.key.toLowerCase() !== "action")
                      .map(col => `<td>${row[col.key] || "-"}</td>`)
                      .join("")}
                  </tr>`)
                .join("")}
            </tbody>
          </table>

          <div class="signatures">
            <div class="signature-box">
              <div>Authorized Signatory</div>
            </div>
            <div class="signature-box">
              <div>Verified By</div>
            </div>
          </div>

          <div class="footer">
            *** This is a computer generated document, no signature is required ***
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
  }, [processedData, printHeaderKeys, printHeaderValues, exportedPdfName, currentUserName]);

  // Get unique values for filter dropdowns
  const getFilterOptions = useCallback((key) => {
    return [...new Set(safeData.map((item) => item[key]))]
      .filter(Boolean)
      .map((value) => ({
        value: String(value),
        label: String(value),
      }));
  }, [safeData]);

  // Action menu for rows
  const getRowMenu = (record) => (
    <Menu>
      <Menu.Item key="1" onClick={() => updateHandler(record[catcher])}>
        Edit
      </Menu.Item>
      <Menu.Item key="2">
        View Details
      </Menu.Item>
      <Menu.Item key="3" danger>
        Delete
      </Menu.Item>
    </Menu>
  );

  if (!safeData.length || !safeColumns.length) {
    return <CircularLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                {iconName && (
                  <div className="flex items-center gap-3 px-5 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl text-sm font-semibold border border-white/30">
                    {Icon}
                    {iconName}
                  </div>
                )}
                {clickableIconName && (
                  <button
                    className="flex items-center gap-2 px-6 py-3 bg-white text-violet-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    onClick={onClickHandler}
                  >
                    {ClickableIcon}
                    {clickableIconName}
                  </button>
                )}
              </div>

              {isExportEnabled && (
                <div className="flex items-center gap-3">
                  <Tooltip title="Export to Excel">
                    <button
                      onClick={exportToExcel}
                      className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
                    >
                      <RiFileExcel2Line className="text-xl" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Print Report">
                    <button
                      onClick={printToPDF}
                      className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
                    >
                      <Printer className="text-xl" />
                    </button>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="px-8 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{processedData.length}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Total Records</div>
                </div>
               
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{totalPages}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Pages</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-64"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    showFilters 
                      ? 'bg-violet-600 text-white' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <div className="flex bg-white border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === "table" 
                        ? 'bg-violet-600 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === "grid" 
                        ? 'bg-violet-600 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Active Filters</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {safeColumns.map((column) => (
                  column.key.toLowerCase() !== "action" && (
                    <div key={column.key} className="space-y-2">
                      <label className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                        {column.header}
                      </label>
                      <Select
                        className="w-full"
                        value={filters[column.key] || ""}
                        onChange={(value) => handleFilterChange(column.key, value)}
                        placeholder={`Filter by ${column.header}`}
                        size="large"
                        allowClear
                      >
                        {getFilterOptions(column.key).map((option) => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="overflow-x-auto">
            {viewMode === "table" ? (
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                  
                    {safeColumns.map((column) => (
                      <th
                        key={column.key}
                        className="px-6 py-4 text-left font-semibold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 transition-colors duration-150"
                        onClick={() => handleSort(column.key)}
                      >
                        <div className="flex items-center gap-2">
                          {column.header}
                          {sortConfig.key === column.key ? (
                            <ArrowUpDown className={`w-4 h-4 text-violet-600 ${
                              sortConfig.direction === "desc" ? "rotate-180" : ""
                            }`} />
                          ) : (
                            <ArrowUpDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="w-12 px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, index) => (
                    <tr
                      key={index}
                      className={`border-b border-slate-100 transition-all duration-150 ${
                        active[row._id]
                          ? "bg-violet-50 border-l-4 border-violet-600"
                          : index % 2 === 0
                          ? "bg-white hover:bg-slate-50"
                          : "bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      
                      {safeColumns.map((column) => (
                        <td
                          key={`${index}-${column.key}`}
                          className="px-6 py-4 text-sm text-slate-700"
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
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedData.map((row, index) => (
                    <div
                      key={index}
                      className={`bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                        active[row._id]
                          ? "border-violet-600 shadow-lg"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => onSelectRow(row._id)}
                      onDoubleClick={() => updateHandler(row[catcher])}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            {safeColumns.slice(0, 2).map((column) => (
                              <div key={column.key} className="mb-2">
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                                  {column.header}
                                </div>
                                <div className="text-sm font-semibold text-slate-800">
                                  {row[column.key] || "-"}
                                </div>
                              </div>
                            ))}
                          </div>
                         
                        </div>
                        <div className="space-y-2">
                          {safeColumns.slice(2).map((column) => (
                            <div key={column.key} className="flex justify-between items-center">
                              <span className="text-xs text-slate-500">{column.header}:</span>
                              <span className="text-xs font-medium text-slate-700">
                                {row[column.key] || "-"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                     
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} entries
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  {[5, 10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size} per page
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-150 ${
                          currentPage === pageNum
                            ? 'bg-violet-600 text-white shadow-lg'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;