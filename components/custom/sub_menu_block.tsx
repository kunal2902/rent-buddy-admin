'use client';

import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';
import { useSubMenuBlock } from './hook';
import { SidebarButton, ActionIconComponent, TooltipComponent } from '@/components';

export interface SubMenuBlockProps {
	id: number;
	title: string;
	Icon: IconType | LucideIcon;
	ActiveIcon: IconType | LucideIcon;
	iconSize?: number;
	iconClassName?: string;
	titleClassName?: string;
	options: Array<{
		id: number;
		title: string;
		Icon: IconType | LucideIcon;
		link: string;
	}>;
	isSidebarOpen: boolean;
}

export const SubMenuBlock = (props: SubMenuBlockProps) => {
	const {
		title,
		Icon,
		options,
		iconClassName,
		iconSize,
		titleClassName,
		id,
		ActiveIcon,
	} = props;

	const { currentPathname, isBlockOpen, isSidebarOpen, toggleBlockState } =
		useSubMenuBlock({ subMenuId: id });

	return (
		<div className="w-full flex flex-col transition-none">
			<TooltipComponent
				label={!isSidebarOpen ? title : ''}
				// className="transition-none bg-light-background-paper border border-gray-800 font-public-sans"
			>
				<ActionIconComponent
					className={twMerge(
						'py-2.5 items-center transition-none my-1.5 flex rounded-md',
						isSidebarOpen
							? 'justify-start px-3 hover:bg-light-background-paper'
							: 'justify-center'
					)}
					onClick={toggleBlockState}
				>
					{isBlockOpen ? (
						<ActiveIcon
							size={iconSize ?? 22}
							className={twMerge(
								`${
									isSidebarOpen ? 'mr-2.5' : ''
								} transition-none`,
								iconClassName
							)}
						/>
					) : (
						<Icon
							size={iconSize ?? 22}
							className={twMerge(
								`${
									isSidebarOpen ? 'mr-2.5' : ''
								} transition-none`,
								iconClassName
							)}
						/>
					)}

					{isSidebarOpen && (
						<>
							<p
								className={twMerge(
									'text-start my-0 py-0 flex-1',
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
				</ActionIconComponent>
			</TooltipComponent>

			{isBlockOpen && (
				<div className={`${isSidebarOpen ? 'pl-2' : ''}`}>
					{options.map((option) => (
						<SidebarButton
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
