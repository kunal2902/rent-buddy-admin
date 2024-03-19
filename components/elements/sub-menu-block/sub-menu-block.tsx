"use client";

import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";
import { useSubMenuBlock } from "./hook";
import { SidebarBtn } from "../sidebar-btn";

interface Props {
	id: string;
	title: string;
	Icon: IconType | LucideIcon;
	iconSize?: number;
	iconClassName?: string;
	titleClassName?: string;
	options: Array<{
		id: string;
		title: string;
		Icon: IconType | LucideIcon;
		link: string;
	}>;
	isSidebarOpen: boolean;
}

const SubMenuBlock = (props: Props) => {
	const {
		title,
		Icon,
		options,
		iconClassName,
		iconSize,
		titleClassName,
		id,
	} = props;

	const { currentPathname, isBlockOpen, isSidebarOpen, toggleBlockState } =
		useSubMenuBlock({ subMenuId: id });

	return (
		<div className="w-full flex flex-col">
			<button
				className={twMerge(
					"py-2.5 items-center transition-none my-1.5 flex rounded-md",
					isSidebarOpen
						? "justify-start px-3 hover:bg-light-background-paper"
						: "justify-center"
				)}
				onClick={toggleBlockState}
			>
				<Icon
					size={iconSize ?? 22}
					className={twMerge(
						`${isSidebarOpen ? "mr-2.5" : ""} transition-none`,
						iconClassName
					)}
				/>

				{isSidebarOpen && (
					<>
						<p
							className={twMerge(
								"text-start my-0 py-0 flex-1",
								titleClassName
							)}
						>
							{title}
						</p>

						{isBlockOpen ? (
							<ChevronUp size={22} />
						) : (
							<ChevronDown size={22} />
						)}
					</>
				)}
			</button>

			{isBlockOpen && (
				<div className={`${isSidebarOpen ? "pl-2" : ""}`}>
					{options.map((option) => (
						<SidebarBtn
							key={option.id}
							isActive={option.link === currentPathname}
							isSidebarOpen={isSidebarOpen}
							{...option}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default SubMenuBlock;
