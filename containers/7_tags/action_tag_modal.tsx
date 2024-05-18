"use client";

import { Dispatch, SetStateAction } from "react";
import { ButtonComponent, ModalComponent } from "@/components";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	handleActionTag: () => void;
	tagAction: string;
}

const ActionTagModal = (props: Props) => {
	const { isOpen, onClose, handleActionTag, tagAction } = props;

	return (
		<ModalComponent
			opened={isOpen}
			onClose={onClose}
			className="border-grey-800"
			title="Action tag"
		>
			Are you sure want to {tagAction} this tag?
			<div className="mt-1 flex items-center justify-end">
				<ButtonComponent
					size="md"
					variant="subtle"
					title="No"
					color="red"
					px={5}
					mr={5}
					onClick={onClose}
				/>
				<ButtonComponent
					title="Yes"
					size="md"
					px={5}
					ml={5}
					onClick={handleActionTag}
				/>
			</div>
		</ModalComponent>
	);
};

export default ActionTagModal;
