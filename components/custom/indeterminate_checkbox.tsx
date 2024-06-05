"use client";

import { useListState } from "@mantine/hooks";
import { useEffect } from "react";
import { SelectedPermissionModel } from "@/models";
import { CheckboxComponent } from "@/components/mantine/checkbox_component";
import { getBackgroundColor, toTitleCase, useThemeProvider } from "@/utils";
import { GroupComponent, TooltipComponent } from "@/components";
import { StackComponent } from "@/components/mantine/stack_component";

export interface IndeterminateCheckboxProps {
	selectedPermissionModel: SelectedPermissionModel;
	selectAll: boolean;
}

export function IndeterminateCheckbox(props: IndeterminateCheckboxProps) {
	const { darkMode } = useThemeProvider();
	const { selectedPermissionModel, selectAll } = props;
	const [values, handlers] = useListState(selectedPermissionModel.permissions);

	const allChecked = values.every((value) => value.checked);
	const indeterminate = values.some((value) => value.checked)
		&& !allChecked;

	useEffect(() => {
		checkAll(selectAll);
	}, [selectAll]);

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
