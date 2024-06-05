"use client";

import { useListState } from "@mantine/hooks";
import { useEffect } from "react";
import { PermissionModel, SelectedPermissionModel } from "@/models";
import { CheckboxComponent } from "@/components/mantine/checkbox_component";
import { getBackgroundColor, toTitleCase, useThemeProvider } from "@/utils";
import { GroupComponent, TooltipComponent } from "@/components";
import { StackComponent } from "@/components/mantine/stack_component";

export interface IndeterminateCheckboxProps {
	selectAll: boolean;
	setAllChecked: (val: boolean) => void;
	selectedPermissionModel: SelectedPermissionModel;
	setSelectedPermissionModel: (perm: PermissionModel) => void;
}

export function IndeterminateCheckbox(props: IndeterminateCheckboxProps) {
	const {
		selectAll,
		setAllChecked,
		selectedPermissionModel,
		setSelectedPermissionModel,
	} = props;
	const { darkMode } = useThemeProvider();
	const [values, handlers] = useListState(selectedPermissionModel.permissions);

	const allChecked = values.every((value) => value.checked);
	const indeterminate = values.some((value) => value.checked)
		&& !allChecked;

	useEffect(() => {
		setAllChecked(allChecked);
	}, [allChecked]);

	useEffect(() => {
		checkAll(selectAll);
	}, [selectAll]);

	useEffect(() => {
		const tempArray = values.map((value) => value.checked ? value.permission : "");
		tempArray.filter(n => n);
		setSelectedPermissionModel({
			entity: selectedPermissionModel.entity,
			permissions: tempArray,
		});
	}, [values]);

	const items = values.map((value, index) => (
		<CheckboxComponent
			size="xs"
			checked={value.checked}
			key={`${value.permission}_${index}`}
			label={toTitleCase(value.permission)}
			onChecked={(checked) => handlers.setItemProp(index, "checked", checked)}
		/>
	));

	const checkAll = (bool?: boolean) => {
		handlers.setState((current) =>
			current.map((value) => ({
				...value,
				checked: bool ?? !allChecked,
			}))
		);
		selectedPermissionModel.checked = bool ?? allChecked;
	};

	return (
		<StackComponent pl={2}>
			<TooltipComponent label={`Select all ${selectedPermissionModel.entity}`}>
				<CheckboxComponent
					size="sm"
					checked={allChecked}
					onChecked={checkAll}
					indeterminate={indeterminate}
					label={toTitleCase(selectedPermissionModel.entity)}
				/>
			</TooltipComponent>
			<GroupComponent style={getBackgroundColor(darkMode)} p={10}>
				{items}
			</GroupComponent>
		</StackComponent>
	);
}
