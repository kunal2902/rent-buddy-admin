'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import React from 'react';
import { useSubMenuBlock } from './hook';
import { ActionIconComponent, SidebarButton, TooltipComponent } from '@/components';
import { LinkType, SideBarProps, SideBarType, SubMenuType } from '@/constants';

export interface SubMenuBlockProps extends SideBarProps<SideBarType> {
	iconSize?: number;
	iconClassName?: string;
	titleClassName?: string;
	isSidebarOpen: boolean;
}

export const SubMenuBlock = (props: SubMenuBlockProps) => {
	const {
		id,
		link,
		type,
		Icon,
		title,
		other,
		iconSize,
		iconClassName,
		titleClassName,
	} = props;

	const { currentPathname, isBlockOpen, isSidebarOpen, toggleBlockState } =
		useSubMenuBlock({ subMenuId: id });

	function getOtherOptions<T extends SubMenuType | LinkType>(t: T): SubMenuType {
		return (t as SubMenuType);
	}

	function ActiveIconComponent(): React.ReactNode {
		const { ActiveIcon } = getOtherOptions(other);

		return <ActiveIcon
			size={iconSize ?? 22}
			className={twMerge(
				`${
					isSidebarOpen ? 'mr-2.5' : ''
				} transition-none`,
				iconClassName
			)}
		/>;
	}

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
					{
						isBlockOpen ? (
							<ActiveIconComponent />
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
					{/*{type == SideBarType.Nested?
						<SubMenuBlock isSidebarOpen={isSidebarOpen} id={} type={} title={} Icon={} other={}

					{options.map((option) => (
						<SidebarButton
							key={option.id}
							isActive={option.link === currentPathname}
							isSidebarOpen={isSidebarOpen}
							{...option}
						/>
					))}*/}
				</div>
			)}
		</div>
	);
};
