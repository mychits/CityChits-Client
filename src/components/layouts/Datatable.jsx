import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  User,
} from "lucide-react";
import imageInput from "../../assets/images/Agent.png";
import { Modal, Select, Tooltip } from "antd";

const DataTable = ({
  updateHandler = () => {},
  printHeaderValues = [],
  printHeaderKeys = [],
  catcher = "_id",
  isExportEnabled = true,
  data = [],
  columns = [],
  exportCols = [],
  exportedFileName = "export.csv",
  exportedPdfName = "export.pdf",
}) => {
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];
  const exportColumns =
    exportCols?.length <= 0
      ? Array.isArray(columns)
        ? columns
        : []
      : Array.isArray(exportCols)
      ? exportCols
      : [];

  // View State
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'

  const [currentPage, setCurrentPage] = useState(1);
  const [currentUserName, setCurrentUserName] = useState("System User");
  const [active, setActive] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [pageSize, setPageSize] = useState(10);

  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedExportColumns, setSelectedExportColumns] = useState(
    exportColumns.map((col) => col.key)
  );

  useEffect(() => {
    const tempData = {};
    data.forEach((ele) => {
      tempData[ele._id] = false;
    });
    setActive(tempData);
  }, [data]);

  useEffect(() => {
    if (showExportModal) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [showExportModal]);

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

  const onSelectRow = (_id) => {
    const tempActive = {};
    Object.keys(active).forEach((key) => {
      tempActive[key] = false;
    });
    setActive({ ...tempActive, [_id]: true });
  };

  const searchData = (data) => {
    if (!searchQuery) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const filterData = (data) => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(item[key]).toLowerCase() === value.toLowerCase();
      });
    });
  };

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
    processed = searchData(processed);
    processed = filterData(processed);
    processed = sortData(processed);
    return processed;
  }, [safeData, searchQuery, filters, sortConfig]);

  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const exportToExcel = () => {
    const date = new Date().toISOString().split("T")[0];
    const selectedCols = exportColumns.filter(
      (col) =>
        selectedExportColumns.includes(col.key) &&
        col.header.toLowerCase() !== "action"
    );
    const headers = selectedCols.map((col) => col.header).join(",");
    const rows = processedData
      .map((item) => selectedCols.map((col) => item[col.key]).join(","))
      .join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const fileBaseName = exportedFileName.replace(/\.csv$/i, "").trim();
    a.download = `${fileBaseName}_${date}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleColumnSelection = (columnKey, isChecked) => {
    if (isChecked) {
      setSelectedExportColumns([...selectedExportColumns, columnKey]);
    } else {
      setSelectedExportColumns(
        selectedExportColumns.filter((key) => key !== columnKey)
      );
    }
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedExportColumns(exportColumns.map((col) => col.key));
    } else {
      setSelectedExportColumns([]);
    }
  };

  const printToPDF = () => {
    let showSummaryCards = false;
    let showCountCards = false;
    const date = new Date().toISOString().split("T")[0];
    const reportType = String(exportedPdfName || "").trim();
    const fileName = `${reportType}_${date}`;

    if (["Daybook Report", "Receipt Report"].includes(reportType)) {
      showSummaryCards = true;
      showCountCards = true;
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
          .a4-border { border: 1px solid #d2d6dc; border-radius: 10px; padding: 20px; height: 100%; background-color: #ffffff; }
          .header-wrapper { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
          .logo-image { width: 200px; height: 100px; object-fit: contain; }
          .title-block { text-align: right; }
          .title { font-weight: 700; font-size: 28px; color: #6b21a8; margin: 0; }
          .report-heading { text-align: center; font-size: 20px; font-weight: 600; margin: 20px 0; background: #f9fafb; padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background-color: #ede9fe; color: #6b21a8; padding: 10px; border: 1px solid #e2e8f0; text-align: left; }
          td { padding: 8px; border: 1px solid #e2e8f0; }
          .signatures { margin-top: 40px; display: flex; justify-content: space-between; }
        }
      </style>
      <div class="printable">
        <div class="a4-border">
          <div class="header-wrapper">
            ${imageInput ? `<img src="${imageInput}" class="logo-image" alt="Logo" />` : ""}
            <div class="title-block">
              <div class="title">MyChits Pvt Ltd</div>
              <div>#123, Main Road, Bengaluru, Karnataka</div>
            </div>
          </div>
          <div class="report-heading">${reportType || "Report"}</div>
          <div style="text-align:center; margin-bottom: 20px;">${dateTimeString}</div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                ${safeColumns
                  .filter((col) => col.key.toLowerCase() !== "action")
                  .map((col) => `<th>${col.header}</th>`)
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${processedData
                .map(
                  (row) => `
                <tr>
                  ${safeColumns
                    .filter((col) => col.key.toLowerCase() !== "action")
                    .map((col) => `<td>${row[col.key] || "-"}</td>`)
                    .join("")}
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <div class="signatures">
            <div><strong>Issued By:</strong> ${currentUserName}</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(printContent);
    window.print();
    document.body.removeChild(printContent);
  };

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (!safeData.length || !safeColumns.length) return <></>;

  return (
    <div className="w-full space-y-4 p-2">
      {/* Upper Toolbar */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* View Switcher */}
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === "list"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Grid
            </button>
          </div>
        </div>

        {isExportEnabled && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 transition-colors shadow-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={printToPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors shadow-md shadow-violet-200 font-medium"
            >
              <Printer className="w-4 h-4" />
              Print PDF
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {viewMode === "list" ? (
        /* LIST VIEW */
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-violet-50">
                <tr>
                  {safeColumns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-4 text-left text-xs font-semibold text-violet-800 uppercase tracking-wider cursor-pointer hover:bg-violet-100 transition-colors"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center gap-2">
                        {column.header}
                        {sortConfig.key === column.key && (
                          <span className="text-violet-500">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {/* Inline Filters */}
                <tr className="bg-gray-50/50">
                  {safeColumns.map((column) => (
                    <td key={`filter-${column.key}`} className="px-4 py-2">
                      {column.key.toLowerCase() !== "action" && (
                        <Select
                          className="w-full"
                          size="small"
                          placeholder={`Filter...`}
                          popupMatchSelectWidth={false}
                          showSearch
                          allowClear
                          value={filters[column.key] || undefined}
                          onChange={(value) =>
                            setFilters((prev) => ({
                              ...prev,
                              [column.key]: value || "",
                            }))
                          }
                        >
                          {[...new Set(safeData.map((item) => item[column.key]))].map(
                            (value) => (
                              <Select.Option key={String(value)} value={String(value)}>
                                {value}
                              </Select.Option>
                            )
                          )}
                        </Select>
                      )}
                    </td>
                  ))}
                </tr>

                {paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    onClick={() => onSelectRow(row._id)}
                    onDoubleClick={() => updateHandler(row[catcher])}
                    className={`${
                      active[row._id] ? "bg-violet-50" : "hover:bg-gray-50"
                    } cursor-pointer transition-colors`}
                  >
                    {safeColumns.map((column) => (
                      <td key={`${index}-${column.key}`} className="px-6 py-4 text-sm text-gray-600">
                        {row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedData.map((row, index) => (
            <div
              key={index}
              onClick={() => onSelectRow(row._id)}
              onDoubleClick={() => updateHandler(row[catcher])}
              className={`relative bg-white border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                active[row._id] ? "border-violet-500 ring-4 ring-violet-50" : "border-gray-100 shadow-sm"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <User className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-gray-900 truncate">
                    {row.name || row.full_name || "ID: " + row._id?.slice(-6)}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">{row.email || "Details below"}</p>
                </div>
              </div>

              {/* Card Content */}
              <div className="space-y-3">
                {safeColumns
                  .filter((col) => !["action", "name", "full_name"].includes(col.key.toLowerCase()))
                  .slice(0, 5) // Limit fields shown in card for cleanliness
                  .map((col) => (
                    <div key={col.key} className="flex justify-between items-start gap-2">
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider pt-0.5">
                        {col.header}
                      </span>
                      <span className="text-sm font-medium text-gray-700 text-right break-words">
                        {row[col.key] || "-"}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Bottom Action Hint */}
              <div className="mt-5 pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400 font-medium">
                <span>DOUBLE CLICK TO EDIT</span>
                {active[row._id] && (
                    <span className="bg-violet-500 text-white px-2 py-0.5 rounded-full text-[9px]">SELECTED</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 cursor-pointer"
          >
            {[8, 12, 24, 48, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700 bg-violet-50 px-3 py-1.5 rounded-full">
            Page {currentPage} <span className="text-violet-300 mx-1">/</span> {Math.max(1, totalPages)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-violet-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 border border-gray-200 rounded-lg hover:bg-violet-50 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <Modal
        title={
          <div className="pb-3 border-b text-violet-700 font-bold text-lg">
            Configure Export
          </div>
        }
        open={showExportModal}
        onCancel={() => setShowExportModal(false)}
        footer={[
          <button
            key="cancel"
            onClick={() => setShowExportModal(false)}
            className="px-5 py-2 mr-3 text-sm font-semibold text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>,
          <button
            key="export"
            onClick={exportToExcel}
            disabled={selectedExportColumns.length === 0}
            className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 shadow-md transition-all disabled:opacity-50"
          >
            Download CSV
          </button>,
        ]}
        width={500}
      >
        <div className="py-4">
          <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg">
            <span className="font-semibold text-gray-700">Select All Columns</span>
            <input
              type="checkbox"
              className="w-5 h-5 accent-violet-600"
              checked={selectedExportColumns.length === exportColumns.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto px-1">
            {exportColumns.map((column) => (
              <label
                key={column.key}
                className="flex items-center gap-3 p-2 border border-gray-100 rounded-md hover:bg-violet-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-violet-600"
                  checked={selectedExportColumns.includes(column.key)}
                  onChange={(e) => handleColumnSelection(column.key, e.target.checked)}
                />
                <span className="text-sm text-gray-600 truncate">{column.header}</span>
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DataTable;