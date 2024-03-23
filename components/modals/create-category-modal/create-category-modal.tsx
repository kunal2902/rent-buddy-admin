"use client";

import { Modal, ModalHeader } from "@/components/common";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const CreateCategoryModal = (props: Props) => {
	const { isOpen, onClose } = props;

	return (
		<Modal isOpen={isOpen} onClose={onClose} className="border-grey-800">
			<ModalHeader title="Create New Category" onClose={onClose} />
		</Modal>
	);
};

export default CreateCategoryModal;
