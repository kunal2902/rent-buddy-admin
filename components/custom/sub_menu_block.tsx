'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import React from 'react';
import { useSubMenuBlock } from './hook';
import { ActionIconComponent, ButtonComponent, SidebarButton, TooltipComponent } from '@/components';
import { LinkType, SideBarProps, SideBarType, SubMenuType } from '@/constants';
import { appColorRGBA, mantineActionIconVariant } from '@/utils';
import { TextComponent } from '@/components/mantine/text_component';

export interface SubMenuBlockProps extends SideBarProps<SideBarType> {
	iconSize?: number;
	iconClassName?: string;
	titleClassName?: string;
	isSidebarOpen: boolean;
}

export const SubMenuBlock = (props: SubMenuBlockProps) => {
	const {
		id,
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
				{
				isSidebarOpen ?
					<ButtonComponent
						fullWidth
						justify="start"
						color={isBlockOpen ? appColorRGBA : undefined}
						variant={isBlockOpen ? 'filled' : mantineActionIconVariant}
						onClick={toggleBlockState}
						className={twMerge(
						'py-2.5 items-center transition-none my-1.5 flex rounded-md',
						isSidebarOpen
							? 'justify-start px-3 hover:bg-light-background-paper'
							: 'justify-center'
					)}
				>
						<Icon
							size={iconSize ?? 22}
							className={twMerge(
							`${
								isSidebarOpen ? 'mr-2.5' : ''
							} transition-none`,
							iconClassName
						)}
					/>

						<TextComponent c={isBlockOpen ? 'white' : appColorRGBA} text={title} />

					</ButtonComponent>
				:
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
				}
			</TooltipComponent>

			{/*{isBlockOpen && (*/}
			<div className={`${isSidebarOpen ? 'pl-2' : ''}`} style={{ backgroundColor: '#eee' }}>
				{(other as SubMenuType).options.map((item: SideBarProps<SideBarType>) =>
						item.type === SideBarType.Nested ?
							<SubMenuBlock
								isSidebarOpen={isSidebarOpen}
								{...item}
							/> :
							<SidebarButton
								id={item.id}
								Icon={item.Icon}
								title={item.title}
								isSidebarOpen={isSidebarOpen}
								link={(item.other as LinkType).link}
								isActive={(item.other as LinkType).link === currentPathname}
							/>)
					}
			</div>
			{/*)}*/}
		</div>
	);
};
