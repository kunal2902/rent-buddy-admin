"use client";

import { Modal, ModalHeader } from "@/components/common";
import { SolidBtn, TextInput } from "@/components/elements";
import { useCreateCustomAttributeModal } from "./hook";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const CreateCustomAttributeModal = (props: Props) => {
	const { isOpen, onClose } = props;

	const { customAttributeName, onCustomAttributeNameChange } =
		useCreateCustomAttributeModal();

	return (
		<Modal isOpen={isOpen} onClose={onClose} className="border-grey-800">
			<ModalHeader title="Create New Attribute" onClose={onClose} />

			<TextInput
				title="Name*"
				value={customAttributeName}
				onChange={onCustomAttributeNameChange}
				inputClassName="border-grey-600 py-2 font-barlow font-base text-base"
				className="mt-1"
			/>

			<div className="mt-1 flex items-center justify-end">
				<SolidBtn title="Save" className="w-fit px-5" />
			</div>
		</Modal>
	);
};

export default CreateCustomAttributeModal;
