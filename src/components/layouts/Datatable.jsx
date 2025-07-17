import React, { useState, useMemo, useEffect } from "react";
import { Printer, ChevronLeft, ChevronRight } from "lucide-react";
import CircularLoader from "../loaders/CircularLoader";
import { RiFileExcel2Line } from "react-icons/ri";

import { Select } from "antd";
const DataTable = ({
  printHeaderKeys=[],
  printHeaderValues=[],
  updateHandler = () => {},
  onClickHandler = () => {},
  selectionColor = "primary",
  catcher = "_id",
  isExportEnabled = true,
  data = [],
  columns = [],
  exportedFileName = "export.csv",
  iconName = "",
  clickableIconName = "",
  Icon ="" ,
  ClickableIcon ="" ,
}) => {
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];

  const [currentPage, setCurrentPage] = useState(1);
  const [active, setActive] = useState({});

  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [pageSize, setPageSize] = useState(100);
  useEffect(() => {
    const tempData = {};
    data.forEach((ele, index) => {
      tempData[ele._id] = false;
    });
    setActive(tempData);
  }, [data]);
  const onSelectRow = (_id) => {
    const tempActive = active;
    if (Object.keys(active).length > 1) {
      Object.keys(active).forEach((key) => {
        tempActive[key] = false;
      });
      setActive({ ...tempActive, [_id]: true });
    }
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
  const changeColor = (index) => {
    return index % 2 === 0;
  };
  const printToPDF = () => {
    const printContent = document.createElement("div");

    printContent.innerHTML = `
  <style>
    @media print {
      body * {
        visibility: hidden;
      }
      .printable, .printable * {
        visibility: visible;
      }
      .printable {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  </style>

  <div class="printable">
  
    <header class="print:flex">
    <div class="grid grid-cols-12 w-full gap-6 my-9">
    ${printHeaderKeys
      .map(
        (headerKeys, index) =>
          `<h1 class="col-span-5 text-xl"><span class="font-semibold">${headerKeys} :</span> ${printHeaderValues[index]} </h1>`
      )
      .join("")}
      </div>
      
      </header>
    <table class="print:w-full print:h-full">
      <thead>
        <tr class="print:border-[1px] print:border-gray-700 print:bg-gray-100">
          ${safeColumns
            .map((column) =>
              column.header.toLowerCase() === "action"
                ? ""
                : `
                <th class="p-[8px] border-[1px] border-gray-700">${column.header}</th>
              `
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${processedData
          .map(
            (row) => `
              <tr class="border-[1px] border-gray-700">
                ${safeColumns
                  .map((column) =>
                    column.key.toLowerCase() === "action"
                      ? ""
                      : `
                      <td class="p-[8px] border-[1px] border-gray-700">${
                        row[column.key] || " - "
                      }</td>
                    `
                  )
                  .join("")}
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
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

  if (!safeData.length || !safeColumns.length) {
    return <CircularLoader />;
  }

  return (
    <div className={`w-full space-y-4`}>
      <div
        className={`flex justify-between items-center gap-4 border-[2px]  border-${selectionColor} p-2 rounded-md`}
      >
        
          <div className={`flex w-full justify-between items-center gap-2 `}>
            { iconName && clickableIconName && 
             ( <div className="flex gap-2">
                <div
                  className={`flex justify-center items-center gap-2 px-4 py-2 bg-${selectionColor} text-primary-variant rounded-md cursor-not-allowed py-2 px-12 shadow-lg`}
                >
                  
                   {Icon}
                  
                  <p className="sm:text-lg sm:font-semibold">{iconName}</p>
                </div>
                <button
                  className={`bg-${selectionColor} bg-opacity-30 text-${selectionColor} hover:bg-opacity-50 font-semibold text-lg flex justify-center items-center gap-2 active:scale-90 rounded-md py-2 px-10 shadow-lg`}
                  onClick={onClickHandler}
                >
                  {ClickableIcon}
                  {clickableIconName}
                </button>
              </div>)
            }
            
           {isExportEnabled && <div className="flex gap-2">
              <button
                onClick={exportToExcel}
                className={`flex items-center gap-2 px-4 py-2 
     border-2 border-${selectionColor} text-${selectionColor} 
    transition-colors duration-200 
    shadow-sm font-medium rounded-lg hover:bg-${selectionColor} hover:bg-opacity-40 active:bg-${selectionColor} active:bg-opacity-60 active:scale-90`}
              >
                <RiFileExcel2Line className="sm:text-4xl" />
                Export Excel
              </button>
              <button
                onClick={printToPDF}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-${selectionColor} text-${selectionColor} 
    transition-colors duration-200 
    shadow-sm font-medium hover:bg-${selectionColor} hover:bg-opacity-40 active:bg-${selectionColor} active:bg-opacity-60 active:scale-90 `}
              >
                <Printer className="sm:text-4xl" />
                Print PDF
              </button>
            </div>}
          </div>
        
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 `}>
          <thead className={`bg-gray-50`}>
            <tr className={`bg-${selectionColor} bg-opacity-10`}>
              {safeColumns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-md font-bold  text-${selectionColor} uppercase tracking-wider cursor-pointer hover:bg-${selectionColor} hover:bg-opacity-10`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {sortConfig.key === column.key && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className={`bg-${selectionColor} bg-opacity-10`}>
              {safeColumns.map((column) => (
                <td key={`filter-${column.key}`} className="px-6 py-2">
                  {column.key.toLowerCase() !== "action" && (
                    <Select
                      className={`w-full max-w-xs border-2 rounded-lg  border-${selectionColor}`}
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
                    >
                      <Select.Option value="">All</Select.Option>
                      {[
                        ...new Set(safeData.map((item) => item[column.key])),
                      ].map((value) => {
                        return (
                          <Select.Option
                            key={String(value)}
                            value={String(value)}
                          >
                            {value}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </td>
              ))}
            </tr>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                onClick={() => onSelectRow(row._id)}
                className={`${
                  active[row._id]
                    ? `bg-${selectionColor} bg-opacity-50`
                    : changeColor(index)
                    ? `hover:bg-${selectionColor} hover:bg-opacity-30 bg-${selectionColor} bg-opacity-10`
                    : ` hover:bg-${selectionColor} hover:bg-opacity-30 bg-${selectionColor} bg-opacity-20` //
                } cursor-pointer `}
              >
                {safeColumns.map((column) => (
                  <td
                    key={`${index}-${column.key}`}
                    className="px-6 py-4"
                    onDoubleClick={() => {
                      console.log("row", row);
                      updateHandler(row[catcher]);
                    }}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="px-7 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm">
            Page {currentPage} of {Math.max(1, totalPages)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
