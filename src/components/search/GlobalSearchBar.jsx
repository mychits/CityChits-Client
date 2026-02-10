import React from "react";
import { FiSearch } from "react-icons/fi";

const GlobalSearchBar = ({ onGlobalSearchChangeHandler, visibility }) => {
  if (!visibility) return null;

  return (
    <div className="relative w-full group">
      <input
        type="text"
        placeholder="Search transactions, users..."
        onChange={(e) => onGlobalSearchChangeHandler(e)}
        className="w-full h-10 pl-11 pr-4 bg-white/60 border border-white/40 text-slate-900 placeholder-slate-500 rounded-full text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 outline-none shadow-sm"
      />
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg text-white shadow-md">
            <FiSearch className="text-xs" />
        </div>
      </div>
     
    </div>
  );
};

export default GlobalSearchBar;