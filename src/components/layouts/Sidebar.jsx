import { Fragment, useState } from "react";
import { BsArrowLeftShort, BsChevronDown } from "react-icons/bs";
import sidebarMenu from "../../data/sidebarMenu";
import Navbar from "./Navbar";
import { Link, NavLink } from "react-router-dom";

const Sidebar = ({
	navSearchBarVisibility = false,
	navbarVisibility=true,
	onGlobalSearchChangeHandler = () => {},
}) => {
	const [open, setOpen] = useState(true);

	const [showArrowLeft, setShowArrowLeft] = useState(false);
	const [submenuOpenIndex, setSubmenuOpenIndex] = useState(null);
	const toggleSubMenu = (index) => {
		if (submenuOpenIndex === index) {
			setSubmenuOpenIndex(null);
		} else {
			setSubmenuOpenIndex(index);
		}
	};

	return (
		<>
		<Navbar
				isOpened={open}
				visibility={navSearchBarVisibility}
				onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
			/>
			{ navbarVisibility && <div
				className={`bg-primary-variant min-h-screen p-5 pt-8 ${
					open ? "w-64" : "w-28 "
				} duration-300 relative border-r-8 border-primary outline-r-8 outline-primary-variant`}
				onMouseEnter={() => setShowArrowLeft(true)}
				onMouseLeave={() => setShowArrowLeft(false)}
			>
				{showArrowLeft && (
					<BsArrowLeftShort
						className={`bg-white text-secondary text-3xl rounded-full absolute z-20 -right-3 top-20 border border-secondary cursor-pointer ${
							!open && "rotate-180"
						}`}
						onClick={() => setOpen(!open)}
					/>
				)}

				<ul className="pt-2">
					{sidebarMenu.map((menu, index) => (
						<Fragment key={menu.id}>
							<NavLink
								to={menu.link}
								onClick={() => toggleSubMenu(index)}
								className={({ isActive }) =>
									`${isActive && `bg-${menu.activeColor} bg-opacity-30`}
                side-card hover:bg-${menu.activeColor} hover:bg-opacity-10 ${
										menu.spacing ? "mt-9" : "mt-2"
									}`
								}
							>
								<span className="side-icon">{<menu.icon />}</span>
								<span
									className={`text-base font-medium flex-1 ${
										!open && "hidden"
									} `}
								>
									{menu.title}
								</span>
								{menu.submenu && open && (
									<BsChevronDown
										className={`${submenuOpenIndex && "rotate-180"}`}
									/>
								)}
							</NavLink>
							{menu.submenu && submenuOpenIndex === index && open && (
								<ul>
									{menu.submenuItems.map((submenuItem, index) => (
										<Fragment key={submenuItem.id}>
											<a
												href={submenuItem.link}
												rel="noopener noreferrer"
												target={`${submenuItem.newTab && "_blank"}`}
											>
												<li
													className={`${
														submenuItem.red ? "text-red-300" : "text-gray-300"
													} select-none text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-light-white rounded-md ${
														menu.spacing ? "mt-9" : "mt-2"
													}`}
												>
													{submenuItem?.icon}
													{submenuItem?.title}
												</li>
											</a>
										</Fragment>
									))}
								</ul>
							)}
						</Fragment>
					))}
				</ul>
			</div>}
		</>
	);
};

export default Sidebar;
