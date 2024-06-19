"use client";

import { Plus } from "lucide-react";
import React from "react";
import { IoMdClose } from "react-icons/io";
import {
	BadgeComponent,
	ButtonComponent,
	GroupComponent,
	LoaderComponent,
	MantineProviderComponent,
	SelectComponent,
	SortButtonComponent,
	SortButtonComponentItemProps,
	TextComponent,
	TextInputComponent,
	TitleComponent,
	TooltipComponent,
} from "@/components";
import { coloredInputTheme, searchItems, sortItems } from "@/constants";
import { appColorRGBA, getSurfaceColor, useThemeProvider } from "@/utils";
import { ComboBoxProps } from "@/types";

export interface DashboardPageHeaderProps {
	title: string,
	total: number,
	filter: string,
	idLabel: string,
	loading: boolean,
	idVariable: string,
	buttonTitle: string,
	searchValue: string,
	onClick: () => void,
	showAddButton?: boolean,
	showValueSelect?: boolean,
	setFilter: (val: (string)) => void,
	setSearchValue: (value: string) => void,
	valueSelectItems?: Array<ComboBoxProps>,
	searchSelectItems?: Array<ComboBoxProps>,
	setOption?: ((option: ComboBoxProps) => void) | undefined,
	onSortSelected: (selected: SortButtonComponentItemProps) => void,
}

export const DashboardPageHeader = (props: DashboardPageHeaderProps) => {
	const {
		title,
		total,
		filter,
		idLabel,
		loading,
		onClick,
		setFilter,
		idVariable,
		buttonTitle,
		searchValue,
		setSearchValue,
		onSortSelected,
		showAddButton = true,
		showValueSelect = false,
		setOption,
		valueSelectItems,
		searchSelectItems,
	} = props;
	const { darkMode } = useThemeProvider();

	return (
		<GroupComponent className="m-3" align="center" justify="space-between">
			<GroupComponent align="center">
				<TitleComponent title={title} />
				{total && (
					<TooltipComponent
						label={`Total number of ${title}: ${total}`}>
						<BadgeComponent>{total}</BadgeComponent>
					</TooltipComponent>
				)}
			</GroupComponent>
			<GroupComponent>

				<MantineProviderComponent theme={coloredInputTheme(darkMode)}>
					<SelectComponent
						size="sm"
						setValue={setFilter}
						defaultValue={filter}
						setOption={setOption}
						placeholder="Searching In"
						data={searchSelectItems ?? searchItems(idLabel, idVariable)}
					/>
				</MantineProviderComponent>

				<MantineProviderComponent theme={coloredInputTheme(darkMode)}>
					{
						showValueSelect && valueSelectItems ?
							<SelectComponent
								size="sm"
								placeholder="Select"
								data={valueSelectItems}
								setValue={setSearchValue}
								defaultValue={searchValue}
							/> :
							<TextInputComponent
								size="sm"
								value={searchValue}
								placeholder="Search"
								setValue={setSearchValue}
								rightSection={
									loading ?
										<LoaderComponent /> :
										searchValue ?
											<IoMdClose
												size={20}
												onClick={() => setSearchValue("")}
											/> :
											undefined
								}
							/>
					}
				</MantineProviderComponent>

				<SortButtonComponent
					items={sortItems(idVariable)}
					onSelected={onSortSelected}
				/>

				{showAddButton && (
					<ButtonComponent
						c={appColorRGBA}
						color={getSurfaceColor(darkMode).backgroundColor}
						onClick={onClick}
					>
						<Plus size={18} className="sm:mr-2 mr-0" />
						<TextComponent text={buttonTitle} c={appColorRGBA} />
					</ButtonComponent>
				)}
			</GroupComponent>
		</GroupComponent>
	);
};
