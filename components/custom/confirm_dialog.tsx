"use client";

import { ButtonComponent, GroupComponent, ModalComponent, TextComponent, TitleComponent } from "@/components";
import { toTitleCase } from "@/utils";

interface confirmDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	actionName: string;
	entityName: string;
}

export const ConfirmDialog = (props: confirmDialogProps) => {
	const {
		isOpen,
		onClose,
		onConfirm,
		actionName,
		entityName,
	} = props;

	return (
		<ModalComponent
			opened={isOpen}
			onClose={onClose}
			className="border-grey-800 text-bold"
			title={<TitleComponent title={`${toTitleCase(actionName)} ${entityName}`} />}
		>
			<TextComponent
				text={`Are you sure you want to ${actionName} this ${entityName}?`}
			/>
			<GroupComponent justify="end" mt={20}>
				<ButtonComponent
					w={100}
					color="red"
					title="Deny"
					variant="subtle"
					onClick={onClose}
				/>
				<ButtonComponent
					w={100}
					title="Confirm"
					onClick={onConfirm}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};
