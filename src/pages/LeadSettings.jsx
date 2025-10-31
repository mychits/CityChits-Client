import { useEffect, useState } from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import { BsPersonCheck } from "react-icons/bs";
import { IoPeopleOutline } from "react-icons/io5";
import { RiAdminLine } from "react-icons/ri";
import { MdAppSettingsAlt } from "react-icons/md";
import { GoGraph } from "react-icons/go";
import { FiArrowRight } from "react-icons/fi";

const data = [
  {
    title: "Designation",
    description: "Manage employee designations and roles",
    path: "/designation",
    icon: <IoPeopleOutline size={28} />,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Administrative Privileges",
    description: "Configure admin access levels",
    path: "/administrative-privileges",
    icon: <RiAdminLine size={28} />,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    title: "Admin Access Rights",
    description: "Control system access permissions",
    path: "/admin-access-rights",
    icon: <BsPersonCheck size={28} />,
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Mobile Access",
    description: "Manage mobile application settings",
    path: "app-settings/groups/mobile-access",
    icon: <MdAppSettingsAlt size={24} />,
    gradient: "from-violet-500 to-violet-600",
  },
  // {
  //   title: "Agent Targets",
  //   description: "Set and monitor performance targets",
  //   path: "/target",
  //   icon: <GoGraph size={28} />,
  //   gradient: "from-pink-500 to-pink-600",
  // },
];

const LeadSettings = () => {
  const navigate = useNavigate();
  const [onload, setOnload] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOnload(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="flex-grow p-8 bg-gradient-to-br from-violet-50 to-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600 mb-2">
          Settings Dashboard
        </h1>
        <p className="text-gray-600">Manage your system settings and configurations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {data.map((item, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(item.path)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`
          relative cursor-pointer rounded-2xl overflow-hidden
          transform transition-all duration-500 ease-in-out
          ${onload ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"}
          ${hoveredIndex === index ? "scale-105 shadow-2xl" : "shadow-lg"}
        `}
            style={{
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <div className="h-full bg-white">
              <div className={`h-2 bg-gradient-to-r ${item.gradient}`}></div>
              <div className="p-6">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r ${item.gradient} text-white mb-4 shadow-md`}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {item.description}
                </p>
                <div className="flex items-center text-violet-600 font-medium text-sm">
                  <span>Configure</span>
                  <FiArrowRight 
                    className={`ml-2 transition-transform duration-300 ${hoveredIndex === index ? "translate-x-1" : ""}`} 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadSettings;  