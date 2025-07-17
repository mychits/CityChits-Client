import React from "react";
import {  NavLink } from "react-router-dom";

const CustomCard = ({ cardData }) => {
	return (
		<NavLink
			to={cardData.redirect}
			key={cardData.key}
			className={"hover:bg-white hover:shadow-2xl hover:bg-opacity-10  "}
		>
			<div
				className={`w-full h-[100px] sm:h-[100px] md:h-[150px] ${cardData.color} bg-opacity-20 rounded-md `}
			>
				<div className={`h-3/4 w-full flex justify-center items-center `}>
					<div className={`w-full flex justify-center items-center gap-4`}>
						{
							<cardData.icon
								className={`text-5xl ${cardData.color} text-white rounded-full p-2 g`}
							/>
						}
						<p className={`text-xl ${cardData.titleColor} font-semibold`}>
							{cardData.title}
						</p>
					</div>
				</div>
				<div
					className={`h-1/4 ${cardData.color} rounded-md  text-white font-semibold flex justify-center items-center`}
				>
					{cardData.value}
				</div>
			</div>
		</NavLink>
	);
};

export default CustomCard;
