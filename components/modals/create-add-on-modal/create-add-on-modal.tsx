"use client";

import { Modal, ModalHeader } from "@/components/common";
import { useCreateAddOnModal } from "./hook";
import { TextInput } from "@/components/elements";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const CreateAddOnModal = (props: Props) => {
	const { isOpen, onClose } = props;
	const { addOnName, onAddOnNameChange } = useCreateAddOnModal();

	return (
		<Modal isOpen={isOpen} onClose={onClose} className="border-grey-800">
			<ModalHeader title="Create New Add On" onClose={onClose} />

			<TextInput
				title="Name*"
				value={addOnName}
				onChange={onAddOnNameChange}
				inputClassName="border-grey-600 py-2 font-barlow font-base text-base"
				className="mt-1"
			/>
		</Modal>
	);
};

export default CreateAddOnModal;
