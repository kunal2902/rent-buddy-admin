"use client";

import { Badge, Loader } from "@mantine/core";
import { Plus } from "lucide-react";
import React from "react";
import {
	ButtonComponent,
	GroupComponent, MantineProviderComponent,
	SelectComponent, SortButtonComponent,
	SortButtonComponentItemProps,
	TextComponent,
	TextInputComponent,
	TitleComponent, TooltipComponent
} from "@/components";
import { coloredInputTheme, searchItems, sortItems } from "@/constants";
import { appColorRGBA, getSurfaceColor, useThemeProvider } from "@/utils";
import { ComboBoxProps } from "@/types";

export interface DashboardPageHeaderProps {
	title: string,
	total?: number,
	idLabel: string,
	loading: boolean,
	idVariable: string,
	setFilter: (val: (string | null)) => void
	buttonTitle: string,
	searchValue: string,
	setSearchValue: (value: string) => void,
	setOption: ((option: ComboBoxProps) => void) | undefined
	onClick: () => void,
	onSortSelected: (selected: SortButtonComponentItemProps) => void,
	showAddButton?: boolean
}

export const DashboardPageHeader = (props: DashboardPageHeaderProps) => {
	const {
		title,
		total,
		idLabel,
		loading,
		idVariable,
		setFilter,
		buttonTitle,
		searchValue,
		setSearchValue,
		setOption,
		onClick,
		onSortSelected,
		showAddButton = true,
	} = props;
	const { darkMode } = useThemeProvider();

	return (
		<GroupComponent className="m-3" align="center" justify="space-between">
			<GroupComponent align="center">
				<TitleComponent title={title} />
				{total && <TooltipComponent label={`Total number of ${title}: ${total}`}><Badge>{total}</Badge></TooltipComponent>}
			</GroupComponent>
			<GroupComponent>

				<MantineProviderComponent theme={coloredInputTheme(darkMode)}>
					<SelectComponent
						placeholder="Searching In"
						searchable
						size="sm"
						data={searchItems(idLabel, idVariable)}
						setValue={setFilter}
						setOption={setOption}
					/>
				</MantineProviderComponent>

				<MantineProviderComponent theme={coloredInputTheme(darkMode)}>
					<TextInputComponent
						size="sm"
						value={searchValue}
						setValue={setSearchValue}
						placeholder="Search"
						rightSection={loading && <Loader size={20} />}
					/>
				</MantineProviderComponent>

				<SortButtonComponent
					items={sortItems(idVariable)}
					onSelected={onSortSelected}
				/>

				{showAddButton && <ButtonComponent
					c={appColorRGBA}
					color={getSurfaceColor(darkMode).backgroundColor}
					onClick={onClick}
				>
					<Plus size={18} className="sm:mr-2 mr-0" />
					<TextComponent text={buttonTitle} c={appColorRGBA} />
				</ButtonComponent>}
			</GroupComponent>
		</GroupComponent>
	);
};
