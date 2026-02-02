import { Link } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import Sidebar from "../components/layouts/Sidebar";
import { Users, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { FaHandshake } from "react-icons/fa";

const LegalsMenu = () => {
  const legalsCategories = [
    {
      id: 1,
      title: "Guarantor",
      description: "Manage guarantor information and documentation",
      icon: FaHandshake,
      href: "/legals-menu/guarantor",
      label: "Active Guarantors",
      gradient: "from-purple-500 to-pink-500",
      lightBg: "bg-purple-50",
      iconBg: "bg-purple-500"
    },
  ];

  return (
    <div className="flex mt-20">
      <div className="flex min-h-screen w-full bg-gradient-to-b from-white/90 to-purple-50/90">
        <Sidebar />
        <div className="flex-1">
          <Navbar visibility={true} />
          <div className="p-8">
            {/* Page Header with Gradient */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Legal Management
              </h1>
              <p className="text-gray-600">
                Manage and organize guarantor information and documentation
              </p>
            </div>

            {/* Stats Overview - More Generic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-purple-100/50 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Legal Overview</p>
                    <p className="text-2xl font-bold text-gray-900">Guarantor Records</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <FaHandshake className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">Growing Network</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-purple-100/50 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Documentation</p>
                    <p className="text-2xl font-bold text-gray-900">Legal Files</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-purple-600 font-medium">Organized and secure</p>
                </div>
              </div>
            </div>

            {/* Management Cards with Purple/Pink Theme - No Counts */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Management Sections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {legalsCategories.map((category) => (
                  <Link
                    key={category.id}
                    to={category.href}
                    className="group block"
                  >
                    <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-purple-100/50 hover:shadow-lg transition-all duration-200 overflow-hidden">
                      {/* Card Header with Purple/Pink Gradient */}
                      <div className={`bg-gradient-to-r ${category.gradient} p-6`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                              <category.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-white">
                                {category.title}
                              </h3>
                              <p className="text-white/90 text-sm mt-0.5">
                                {category.description}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                      </div>

                      {/* Card Body - No Count Display */}
                      <div className="p-6 bg-white/90 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              {category.label}
                            </p>
                          </div>
                          <div className={`px-4 py-2 ${category.lightBg} rounded-lg hover:shadow-md transition-all duration-200 border border-purple-100/50`}>
                            <p className="text-sm font-medium text-purple-700">
                              Manage
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Tips with Purple/Pink Theme */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-purple-100/50 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Quick Tips
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">
                        Use the Legal directory to manage Guarantor Information, update guarantor details and documentation all in one place
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">
                        Keep your legal records organized and easily accessible for compliance and reference purposes
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">
                        Click on any card to access detailed management features
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalsMenu;