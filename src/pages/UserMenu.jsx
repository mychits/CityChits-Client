import { Link } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import Sidebar from "../components/layouts/Sidebar";
import { Users, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { IoIosPersonAdd } from "react-icons/io";
import { MdCancel } from "react-icons/md";

const UserMenu = () => {
  const userCategories = [
    {
      id: 1,
      title: "Active Customers",
      description: "Manage verified customer records and details",
      icon: IoIosPersonAdd,
      href: "/customer-menu/user",
      badge: "Active",
      badgeColor: "bg-blue-100 text-blue-700",
      borderColor: "border-blue-600",
      iconBg: "bg-blue-50 text-blue-600"
    },
    {
      id: 2,
      title: "Unverified Customers",
      description: "Review pending customer registrations",
      icon: MdCancel,
      href: "/customer-menu/un-approved-customer",
      badge: "Pending",
      badgeColor: "bg-amber-100 text-amber-700",
      borderColor: "border-amber-500",
      iconBg: "bg-amber-50 text-amber-600"
    },
  ];

  return (
    <div className="min-h-screen mt-20 bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar visibility={true} />
          <div className="p-4 md:p-8 md:ml-16 md:mr-11 md:mt-11 pb-8">
            
            {/* Professional Header */}
            <header className="mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Customer Management
                </h1>
                <p className="text-gray-600">
                  Manage customer records, verify registrations, and monitor growth.
                </p>
              </div>
            </header>

            {/* Quick Stats Matching Home Theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {/* Stat 1 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                      Active
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Total Customers
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Registered user base
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    1,240
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Growing steadily
                    </span>
                    <div className="flex items-center text-sm text-green-600 font-medium">
                      <TrendingUp className="w-4 h-4 mr-1" /> +12%
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                      Pending
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Pending Review
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Unverified registrations
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-amber-600">
                    24
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Action required
                    </span>
                    <Link 
                      to="/customer-menu/un-approved-customer"
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      View List
                    </Link>
                  </div>
                </div>
              </div>

               {/* Stat 3 - Placeholder for balance */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300 hidden lg:block xl:block">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Verification Rate
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Approved vs Total
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-indigo-600">
                    98%
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Last 30 days
                  </span>
                </div>
              </div>
            </div>

            {/* Management Navigation Cards - Modern & Unique */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Management Sections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userCategories.map((category) => (
                  <Link
                    key={category.id}
                    to={category.href}
                    className="group block"
                  >
                    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}>
                      
                      {/* Accent Left Border */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${category.borderColor} transition-all duration-300 group-hover:w-2`}></div>

                      <div className="flex items-center justify-between pl-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2.5 rounded-lg ${category.iconBg} transition-colors`}>
                              <category.icon className="text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {category.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 pl-1">
                            {category.description}
                          </p>
                          
                          <div className="flex items-center gap-3 pl-1">
                            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${category.badgeColor}`}>
                              {category.badge}
                            </span>
                          </div>
                        </div>

                        <div className="flex-shrink-0 pl-4">
                          <button className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Tips - Clean Style */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Quick Guidelines
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        <strong className="text-gray-900">Verified Customers:</strong> Full access to profiles, payment history, and enrollment status.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        <strong className="text-gray-900">Unverified Customers:</strong> Requires document review before approval. Verify identity to enable access.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Use the <span className="font-semibold text-blue-600">"Manage"</span> buttons on the dashboard for quick actions.
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

export default UserMenu;