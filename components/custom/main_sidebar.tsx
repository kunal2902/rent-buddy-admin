"use client";

import { twMerge } from "tailwind-merge";
import { useState } from "react";
import {
	LinkType,
	SidebarItems,
	SideBarProps,
	SideBarType,
	SubMenuType,
} from "@/constants";
import {
	NavLinkComponent,
	TooltipComponent,
	useMainSidebar,
} from "@/components";
import { appColorRGBA, mantineNavLinkChildOffset } from "@/utils";

export const MainSidebar = () => {
	const { isSidebarOpen, currentPathname } = useMainSidebar();
	const [disableParentTooltip, setDisableParentTooltip] =
		useState<boolean>(false);
	const [disableSubParentTooltip, setDisableSubParentTooltip] =
		useState<boolean>(false);

	const checkCurrentPathMatch = (
		options: Array<SideBarProps<SideBarType>>,
	): boolean =>
		options.some(
			(item) => (item.other as LinkType).link === currentPathname,
		);

	return (
		<div
			className={`${
				isSidebarOpen ? "lg:w-64 w-56 items-center" : "w-20"
			} h-screen flex flex-col fixed z-20 top-0 left-0 bg-light-background-natural pt-16 shadow`}
		>
			<div className="flex-grow flex flex-col w-full overflow-y-scroll p-3">
				{SidebarItems.map((item) => {
					const { Icon } = item;
					const { options, ActiveIcon } = item.other as SubMenuType;
					const isItemSelected =
						(item.other as LinkType).link === currentPathname;

					return item.type === SideBarType.Nested ? (
						<TooltipComponent
							key={item.id}
							disabled={disableParentTooltip}
							label={!isSidebarOpen ? item.title : undefined}
						>
							<NavLinkComponent
								label={isSidebarOpen ? item.title : ""}
								active={
									checkCurrentPathMatch(options) ||
									currentPathname.includes(
										item.title.toLowerCase(),
									)
								}
								childrenOffset={
									isSidebarOpen
										? mantineNavLinkChildOffset
										: 0
								}
								defaultOpened={
									checkCurrentPathMatch(options) ||
									currentPathname.includes(
										item.title.toLowerCase(),
									)
								}
								variant={
									checkCurrentPathMatch(options) ||
									currentPathname.includes(
										item.title.toLowerCase(),
									)
										? "light"
										: undefined
								}
								leftSection={
									checkCurrentPathMatch(options) ||
									currentPathname.includes(
										item.title.toLowerCase(),
									) ? (
										<ActiveIcon
											size={22}
											className={twMerge(
												`${
													isSidebarOpen
														? "mr-2.5"
														: ""
												} transition-none`,
											)}
										/>
									) : (
										<Icon
											size={22}
											className={twMerge(
												`${
													isSidebarOpen
														? "mr-2.5"
														: ""
												} transition-none`,
											)}
										/>
									)
								}
							>
								{options.map((subItem) => {
									const {
										options: subOptions,
										ActiveIcon: SubActiveIcon,
									} = subItem.other as SubMenuType;
									const isSubItemSelected =
										(subItem.other as LinkType).link ===
										currentPathname;
									return subItem.type ===
										SideBarType.Nested ? (
										<TooltipComponent
											key={subItem.id}
											disabled={disableSubParentTooltip}
											label={
												!isSidebarOpen
													? subItem.title
													: undefined
											}
										>
											<NavLinkComponent
												active={
													checkCurrentPathMatch(
														subOptions,
													) || !isSidebarOpen
												}
												variant="light"
												childrenOffset={
													isSidebarOpen
														? mantineNavLinkChildOffset
														: 0
												}
												label={
													isSidebarOpen
														? subItem.title
														: ""
												}
												defaultOpened={checkCurrentPathMatch(
													subOptions,
												)}
												color={
													checkCurrentPathMatch(
														subOptions,
													)
														? appColorRGBA
														: !isSidebarOpen
															? "rgba(70, 70, 70, 1)"
															: undefined
												}
												leftSection={
													checkCurrentPathMatch(
														subOptions,
													) ? (
														<SubActiveIcon
															size={22}
															className={twMerge(
																`${
																	isSidebarOpen
																		? "mr-2.5"
																		: ""
																} transition-none`,
															)}
														/>
													) : (
														<subItem.Icon
															size={22}
															className={twMerge(
																`${
																	isSidebarOpen
																		? "mr-2.5"
																		: ""
																} transition-none`,
															)}
														/>
													)
												}
												// @ts-ignore
												onMouseLeave={() => {
													setDisableParentTooltip(
														false,
													);
												}}
												onMouseEnter={() => {
													setDisableParentTooltip(
														true,
													);
												}}
											>
												{subOptions.map(
													(subSubItem) => {
														const isSubSubItemSelected =
															(
																subSubItem.other as LinkType
															).link ===
															currentPathname;
														return (
															<TooltipComponent
																key={
																	subSubItem.id
																}
																label={
																	!isSidebarOpen
																		? subSubItem.title
																		: undefined
																}
															>
																<NavLinkComponent
																	label={
																		isSidebarOpen
																			? subSubItem.title
																			: ""
																	}
																	href={
																		(
																			subSubItem.other as LinkType
																		).link
																	}
																	active={
																		isSubSubItemSelected ||
																		!isSidebarOpen
																	}
																	variant={
																		isSubSubItemSelected
																			? "filled"
																			: undefined
																	}
																	color={
																		isSubSubItemSelected
																			? appColorRGBA
																			: !isSidebarOpen
																				? "rgba(0, 0, 0, 1)"
																				: undefined
																	}
																	leftSection={
																		<subSubItem.Icon
																			size={
																				22
																			}
																			className={twMerge(
																				`${
																					isSidebarOpen
																						? "mr-2.5"
																						: ""
																				} transition-none`,
																			)}
																		/>
																	}
																	// @ts-ignore
																	onMouseLeave={() => {
																		setDisableParentTooltip(
																			false,
																		);
																		setDisableSubParentTooltip(
																			false,
																		);
																	}}
																	onMouseEnter={() => {
																		setDisableParentTooltip(
																			true,
																		);
																		setDisableSubParentTooltip(
																			true,
																		);
																	}}
																/>
															</TooltipComponent>
														);
													},
												)}
											</NavLinkComponent>
										</TooltipComponent>
									) : (
										<TooltipComponent
											key={subItem.id}
											label={
												!isSidebarOpen
													? subItem.title
													: undefined
											}
										>
											<NavLinkComponent
												label={
													isSidebarOpen
														? subItem.title
														: ""
												}
												href={
													(subItem.other as LinkType)
														.link
												}
												active={
													isSubItemSelected ||
													!isSidebarOpen
												}
												variant={
													isSubItemSelected
														? "filled"
														: "light"
												}
												color={
													isSubItemSelected
														? appColorRGBA
														: !isSidebarOpen
															? "rgba(70, 70, 70, 1)"
															: undefined
												}
												leftSection={
													<subItem.Icon
														size={22}
														className={twMerge(
															`${
																isSidebarOpen
																	? "mr-2.5"
																	: ""
															} transition-none`,
														)}
													/>
												}
												// @ts-ignore
												onMouseLeave={() => {
													setDisableParentTooltip(
														false,
													);
												}}
												onMouseEnter={() => {
													setDisableParentTooltip(
														true,
													);
												}}
											/>
										</TooltipComponent>
									);
								})}
							</NavLinkComponent>
						</TooltipComponent>
					) : (
						<TooltipComponent
							key={item.id}
							label={!isSidebarOpen ? item.title : undefined}
						>
							<NavLinkComponent
								label={isSidebarOpen ? item.title : ""}
								active={isItemSelected}
								href={(item.other as LinkType).link}
								variant={isItemSelected ? "filled" : undefined}
								leftSection={
									<Icon
										size={22}
										className={twMerge(
											`${
												isSidebarOpen ? "mr-2.5" : ""
											} transition-none`,
										)}
									/>
								}
							/>
						</TooltipComponent>
					);
				})}
			</div>
		</div>
	);
};
