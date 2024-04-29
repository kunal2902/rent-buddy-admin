"use client";

import { Modal, ModalHeader } from "@/components/common";
import { SolidBtn } from "@/components/elements";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const DraftModal = (props: Props) => {
	const { isOpen, onClose } = props;

	return (
		<Modal isOpen={isOpen} onClose={onClose} className="border-grey-800">
			<ModalHeader title="Draft Orders" onClose={onClose} />

			<div className="mt-1 flex items-center justify-end">
				<SolidBtn title="Save" className="w-fit px-5" />
			</div>
		</Modal>
	);
};

export default DraftModal;
