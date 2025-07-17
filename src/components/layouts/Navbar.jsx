import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import GlobalSearchBar from "../search/GlobalSearchBar";
import { MdKeyboardArrowDown } from "react-icons/md";
import hotkeys from "../../data/hotKeys";
import { MdOutlineArrowCircleLeft } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoMdMore } from "react-icons/io";
import mychitsHead from "../../assets/images/mychits_head.svg";

const Navbar = ({
	onGlobalSearchChangeHandler = () => {},
	visibility = false,
	isOpened = false,
}) => {
	const navigate = useNavigate();
	const [showHotKeys, setShowHotKeys] = useState(false);
	const [isActiveBackButton, setIsActiveBackButton] = useState(false);

	return (
		<nav
			className={`w-screen h-auto fixed top-0 left-0 z-10 bg-primary-variant flex`}
		>
			<div className="p-[16px] flex border-r-8 border-primary mr-2">
				<img
					src={mychitsHead}
					alt=""
					className={`cursor-pointer duration-500 ${
						isOpened && "rotate-[360deg]"
					} `}
				/>
				<h1
					className={`font-bold text-[#3A3481] flex justify-center m-2 items-center origin-center transition-all duration-300 select-none ${
						isOpened ? "text-3xl mr-14" : "text-[0px] mr-0"
					}`}
				>
					MyChits
				</h1>
			</div>
			<div
				className={`w-full min-h-[88px] bg-gradient-to-r from-primary to-secondary transition-all duration-300 rounded-md grid sm:grid-cols-12  justify-center items-center `}
			>
				<MdOutlineArrowCircleLeft
					className={`text-white hover:text-white active:animate-ping col-span-1 ml-4`}
					onClick={() => {
						navigate(-1);
					}}
					size={63}
				/>
				<div className="col-span-1"></div>
				<div className="col-span-6 flex ">
					<GlobalSearchBar
						onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
						visibility={visibility}
					/>
					<MdKeyboardArrowDown
						size={63}
						color="white"
						className={`active:bg-primary-variant active:rounded-full active:bg-opacity-10 ${
							showHotKeys && "rotate-180"
						}`}
						onClick={() => showHotKeys(true)}
					/>
				</div>

				<div className="sm:col-span-2"></div>
				<CgProfile
					size={63}
					color="white"
					className="sm:col-span-1 active:bg-primary-variant rounded-full active:bg-opacity-10"
				/>
				<IoMdMore
					size={63}
					color="white"
					className="sm:col-span-1 active:bg-primary-variant active:rounded-full  active:bg-opacity-10"
				/>
			</div>
			{showHotKeys && (
				<div className={`h-auto rounded-md bg-primary-variant px-6 py-2 `}>
					{hotkeys.map(({ key, title, path }) => (
						<NavLink
							key={key}
							to={path}
							className={({ isActive }) =>
								`${
									isActive ? "bg-primary bg-opacity-40" : "bg-white"
								} text-center rounded-sm p-6 text-primary font-semibold shadow-[0_2px_2px_gray]`
							}
						>
							{title}
						</NavLink>
					))}
				</div>
			)}
		</nav>
	);
};

export default Navbar;
