'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';
import { ActionIconComponent, TooltipComponent } from '@/components';

export interface SidebarButtonProps {
	link: string;
	title: string;
	Icon: LucideIcon | IconType;
	iconSize?: number;
	iconClassName?: string;
	className?: string;
	titleClassName?: string;
	linkClassName?: string;
	isActive: boolean;
	isSidebarOpen: boolean;
}

export const SidebarButton = (props: SidebarButtonProps) => {
	const {
		link,
		title,
		Icon,
		iconSize,
		iconClassName,
		className,
		titleClassName,
		linkClassName,
		isActive,
		isSidebarOpen,
	} = props;

	return (
		<TooltipComponent
			label={!isSidebarOpen ? title : ''}
			// className="transition-none bg-light-background-paper border border-gray-800 font-public-sans"
		>
			<Link
				className={twMerge('w-full flex', linkClassName)}
				href={link}
			>
				<ActionIconComponent
					className={twMerge(
						'w-full flex items-center my-1.5 py-2.5 font-public-sans transition-none',
						`${
							isSidebarOpen
								? 'justify-start px-3 rounded-md hover:bg-gray-200/70 hover:text-light-secondary-text'
								: 'justify-center text-light-secondary-text'
						}`,
						`${
							isActive
								? 'text-primary-dark hover:text-primary-dark'
								: 'text-light-secondary-text'
						}`,
						`${
							isSidebarOpen && isActive
								? 'bg-primary-lighter/60 text-primary-dark hover:bg-primary-lighter/60 hover:text-primary-dark'
								: ''
						}`,
						className
					)}>
					<Icon
						size={iconSize ?? 22}
						className={twMerge(
							`${
								isSidebarOpen ? 'mr-2.5' : ''
							} transition-none`,
							iconClassName
						)}
					/>

					{isSidebarOpen && (
						<p
							className={twMerge(
								'text-start my-0 py-0',
								titleClassName
							)}
						>
							{title}
						</p>
					)}
				</ActionIconComponent>
			</Link>
		</TooltipComponent>
	);
};
