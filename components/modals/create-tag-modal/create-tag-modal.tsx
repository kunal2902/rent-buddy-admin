"use client";

import { Modal, ModalHeader } from "@/components/common";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const CreateTagModal = (props: Props) => {
	const { isOpen, onClose } = props;

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalHeader title="Create A Tag" onClose={onClose} />
		</Modal>
	);
};

export default CreateTagModal;
