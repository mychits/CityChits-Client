import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsPersonCheck } from "react-icons/bs";
import { IoPeopleOutline } from "react-icons/io5";
import { RiAdminLine } from "react-icons/ri";
import { MdAppSettingsAlt } from "react-icons/md";
import { GoGraph } from "react-icons/go";

const cardData = [
  {
    icon: IoPeopleOutline,
    title: "Designation",
    subtitle: "Manage staff designations",
    redirect: "/designation",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    borderColor: "border-violet-600",
  },
  {
    icon: RiAdminLine,
    title: "Administrative Privileges",
    subtitle: "Set up roles & privileges",
    redirect: "/administrative-privileges",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    borderColor: "border-red-600",
  },
  {
    icon: BsPersonCheck,
    title: "Admin Access Rights",
    subtitle: "Control admin permissions",
    redirect: "/admin-access-rights",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    borderColor: "border-purple-600",
  },
  {
    icon: MdAppSettingsAlt,
    title: "Mobile Access",
    subtitle: "App-specific access settings",
    redirect: "app-settings/groups/mobile-access",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    borderColor: "border-green-600",
  },
  {
    icon: GoGraph,
    title: "Agent Targets",
    subtitle: "Monitor & assign targets",
    redirect: "/target",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    borderColor: "border-orange-600",
  },
];

const LeadSettings = () => {
  const navigate = useNavigate();
  const [onload, setOnload] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setOnload(false), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-grow p-7">
    

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-fr">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`transform transition-all duration-500 hover:scale-[1.05] hover:shadow-lg min-w-0 ${
              onload ? "-translate-y-6 opacity-0" : "translate-y-0 opacity-100"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div
              onClick={() => navigate(card.redirect)}
              className={`relative rounded-2xl p-1 cursor-pointer transition-all duration-300 ease-out
                bg-white border ${card.borderColor} 
                hover:shadow-violet-400 hover:shadow-lg
                hover:border-violet-500 hover:bg-violet-50`}
            >
              <div className="bg-white rounded-xl overflow-hidden h-full">
                <div className="p-3">
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-lg ${card.iconBg} mr-3`}>
                      <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 truncate">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-md text-gray-500 line-clamp-2 mb-2">
                    {card.subtitle}
                  </p>
                  <div className="flex justify-end">
                    <span className="text-md text-violet-600 font-medium hover:underline">
                      View →
                    </span>
                  </div> 
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
