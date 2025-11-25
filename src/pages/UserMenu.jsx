import { Link } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import Sidebar from "../components/layouts/Sidebar";
import { Users, ChevronRight, Zap, Shield, UserCheck, Sparkles, ArrowUpRight, Grid3x3 } from "lucide-react";
import { IoIosPersonAdd } from "react-icons/io";
import { MdCancel } from "react-icons/md";

const UserMenu = () => {
  const userCategories = [
    {
      id: 1,
      title: "Customers",
      description: "Manage customer records and information",
      icon: IoIosPersonAdd,
      gradient: "from-violet-500 via-purple-500 to-pink-500",
      bgGradient: "from-violet-50 via-purple-50 to-pink-50",
      href: "/customer-menu/user",
      stats: "Active Customers",
      secondaryIcon: Shield,
      iconColor: "text-violet-600",
      bgColor: "bg-violet-100"
    },
    {
      id: 2,
      title: "Unverified Customers",
      description: "Manage unverified customer records",
      icon: MdCancel,
      gradient: "from-amber-500 via-orange-500 to-red-500",
      bgGradient: "from-amber-50 via-orange-50 to-red-50",
      href: "/customer-menu/un-approved-customer",
      stats: "Unverified Customers",
      secondaryIcon: UserCheck,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-100"
    },
  ];

  return (
    <div className="flex mt-20">
      <div className="flex min-h-screen w-full relative overflow-hidden">
      
        {/* <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-gray-50">
          <div className="absolute inset-0">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
        </div> */}

        <Sidebar />
        <div className="flex-1 relative">
          <Navbar visibility={true} />
          <div className="p-8 relative">
        
            <div className="mb-12">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
                    Customer Management
                  </h1>
                  <p className="text-slate-600 mt-1 text-lg">Manage and organize your customer base</p>
                </div>
              </div>
            </div>

          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {userCategories.map((category) => {
                const Icon = category.icon;
                const SecondaryIcon = category.secondaryIcon;
                return (
                  <Link key={category.id} to={category.href} className="group">
                    <div className="relative h-full overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-2">
                    
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-700 p-[2px]">
                        <div className={`w-full h-full rounded-3xl bg-gradient-to-r ${category.gradient}`}></div>
                      </div>
                      
                     
                      <div className="relative h-full bg-white rounded-3xl p-8">
                    
                        <div className={`absolute top-4 right-4 w-32 h-32 rounded-full bg-gradient-to-br ${category.bgGradient} opacity-30 blur-2xl`}></div>
                        
                       
                        <div className="flex items-start justify-between mb-6 relative">
                          <div className="relative group">
                            <div className="absolute -inset-3 bg-gradient-to-r from-violet-400 to-purple-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition duration-500"></div>
                            <div className={`relative w-16 h-16 rounded-2xl ${category.bgColor} flex items-center justify-center shadow-xl border border-white/50 group-hover:scale-110 transition-transform duration-500`}>
                              <Icon className={`w-8 h-8 ${category.iconColor}`} />
                            </div>
                          </div>
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-white shadow-lg border border-slate-200/50 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                            <SecondaryIcon className="w-5 h-5 text-slate-600" />
                          </div>
                        </div>

                       
                        <div className="mb-6 relative">
                          <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                            {category.title}
                          </h3>
                          <p className="text-slate-600 leading-relaxed">
                            {category.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 relative">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                            </div>
                            <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                              {category.stats}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-violet-600 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                            <span className="text-sm font-semibold">Explore</span>
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
     
            <div className="relative p-8 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
       
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-violet-200/30 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-200/30 to-transparent rounded-full blur-3xl"></div>
              
              <div className="relative flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                    <Zap className="w-7 h-7 text-violet-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    Quick Tips
                    <Sparkles className="w-5 h-5 text-violet-500 animate-pulse" />
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Use the Customer directory to manage customer information, update customer details all in one place.
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-2">
                    Use the Customer directory to manage Unverified Customers Information, update customer information all in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes tilt {
          0%, 50%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(0.5deg);
          }
          75% {
            transform: rotate(-0.5deg);
          }
        }
        .animate-tilt {
          animation: tilt 10s infinite;
        }
      `}</style>
    </div>
  );
};

export default UserMenu;