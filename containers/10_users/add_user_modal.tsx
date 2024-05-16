"use client";

import { ButtonComponent, ModalComponent } from "@/components";

export interface AddUserModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const AddUserModal = (props: AddUserModalProps) => {
	const { isOpen, onClose } = props;

	return (
		<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="New User">

			<div className="mt-1 flex items-center justify-end">
				<ButtonComponent title="Save" fullWidth px={5} />
			</div>
		</ModalComponent>
	);
};
