import React from "react";
import { IoSearchCircleSharp } from "react-icons/io5";
const GlobalSearchBar = ({ onGlobalSearchChangeHandler, visibility }) => {
	if (!visibility) return null;
	return (
		<div className="relative w-full min-h-full ">
			{/* <IoSearchCircleSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary text-5xl mr-8" /> */}
			<input
				type="search"
				placeholder="Enter to search..."
				onChange={(e) => onGlobalSearchChangeHandler(e)}
				className="border-2 border-primary w-full h-full pl-10 pr-9 py-2  rounded-lg shadow-sm focus:outline-none  focus:ring-custom-violet focus:border-custom-violet focus:shadow-lg transition-all text-primary text-center select-none cursor-text placeholder:text-primary placeholder:text-xl placeholder:text-opacity-60 placeholder:font-bold"
			/>
		</div>
	);
};

export default GlobalSearchBar;
