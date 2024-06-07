"use client";

import { useListState } from "@mantine/hooks";
import { useEffect } from "react";
import { PermissionModel, SelectedPermissionModel } from "@/models";
import { CheckboxComponent, GroupComponent, StackComponent, TooltipComponent } from "@/components";
import { getBackgroundColor, toTitleCase, useThemeProvider } from "@/utils";

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
			disabled={selectAll}
			checked={value.checked}
			key={`${value.permission}_${index}`}
			label={toTitleCase(value.permission)}
			onChecked={(checked) => {
				handlers.setItemProp(index, "checked", checked);
				setAllChecked(allChecked);
			}}
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
		setAllChecked(allChecked);
	};

	return (
		<StackComponent pl={2}>
			<TooltipComponent label={`Select all ${selectedPermissionModel.entity}`}>
				<CheckboxComponent
					size="sm"
					checked={allChecked}
					onChecked={checkAll}
					disabled={selectAll}
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
