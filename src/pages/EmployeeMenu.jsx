import { Link } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import Sidebar from "../components/layouts/Sidebar";
import { Users, Calendar, Sparkles, TrendingUp, Clock, Shield, Activity, Award, ChevronRight, BarChart3, UserCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const StaffMenu = () => {
  const staffCategories = [
    {
      id: 1,
      title: "Employees",
      description: "Manage employee records, roles and assignments",
      icon: <Users className="w-8 h-8" />,
      href: "/staff-menu/employee-menu/employee",
      color: "violet",
     
      features: ["Employee Directory", "Role Management", "Performance Tracking"]
    },
    {
      id: 2,
      title: "Attendance",
      description: "Track and manage employee attendance records",
      icon: <Clock className="w-8 h-8" />,
      href: "/staff-menu/employee-menu/add-employee-attendance",
      color: "purple",
     
      features: ["Time Tracking", "Leave Management", "Reports"]
    },
  ];

 

  const recentActivities = [
    { id: 1, title: "New employee onboarded", time: "2 hours ago", icon: <UserCheck className="w-4 h-4" />, color: "green" },
    { id: 2, title: "Attendance report generated", time: "5 hours ago", icon: <BarChart3 className="w-4 h-4" />, color: "blue" },
    { id: 3, title: "Leave request approved", time: "1 day ago", icon: <Calendar className="w-4 h-4" />, color: "purple" },
  ];

  return (
    <div className="flex mt-20">
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/20">
        <Sidebar />
        <div className="flex-1">
          <Navbar visibility={true} />
          <div className="p-8 max-w-7xl mx-auto">
            
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-12 shadow-2xl">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Sparkles className="w-8 h-8 text-yellow-300" />
                    </motion.div>
                    <span className="text-white/90 font-medium text-sm uppercase tracking-wider">Employee Hub</span>
                  </div>
                  <h1 className="text-5xl font-bold text-white mb-3">
                    Employee Management 
                  </h1>
                  <p className="text-violet-100 text-lg max-w-2xl">
                    Your centralized platform for tracking attendance, and optimizing workforce operations with precision.
                  </p>
                  
                  <div className="mt-8 flex flex-wrap gap-4">
                    <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">System Status: Operational</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">Security: Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

         

            {/* Main Cards Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              {staffCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link to={category.href} className="group block h-full">
                    <div className="relative h-full bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                      <div className={`absolute inset-0 bg-gradient-to-br from-${category.color}-600/0 to-purple-600/0 group-hover:from-${category.color}-600/5 group-hover:to-purple-600/5 transition-all duration-500`}></div>
                      
                      <div className="relative p-8 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-6">
                          <div className={`p-4 bg-gradient-to-br from-${category.color}-100 to-purple-100 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}>
                            <div className={`text-${category.color}-600`}>
                              {category.icon}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                           
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-purple-600 transition-all duration-300">
                            {category.title}
                          </h3>
                          <p className="text-gray-600 text-lg leading-relaxed mb-4">
                            {category.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-4">
                            <div className="h-px bg-gray-200 flex-1"></div>
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Features</span>
                            <div className="h-px bg-gray-200 flex-1"></div>
                          </div>
                          
                          <div className="space-y-2">
                            {category.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full bg-${category.color}-500`}></div>
                                <span className="text-sm text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                             
                            </div>
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${category.color}-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                              <svg className="w-6 h-6 text-white transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

          

            
         
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffMenu;