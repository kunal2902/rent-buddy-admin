"use client";

import { Modal, ModalHeader } from "@/components/common";
import { useCreateAddOnModal } from "./hook";
import { SolidBtn, TextInput } from "@/components/elements";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const CreateAddOnModal = (props: Props) => {
	const { isOpen, onClose } = props;
	const { addOnName, onAddOnNameChange, addOnPrice, onAddOnPriceChange } =
		useCreateAddOnModal();

	return (
		<Modal isOpen={isOpen} onClose={onClose} className="border-grey-800">
			<ModalHeader title="New Add On" onClose={onClose} />

			<TextInput
				title="Name*"
				value={addOnName}
				onChange={onAddOnNameChange}
				inputClassName="border-grey-600 py-2 font-barlow font-base text-base"
				className="mt-1"
			/>

			<TextInput
				title="Price*"
				value={addOnPrice}
				onChange={onAddOnPriceChange}
				inputClassName="border-grey-600 py-2 font-barlow font-base text-base"
				className="mt-1"
			/>

			<div className="mt-1 flex items-center justify-end">
				<SolidBtn title="Save" className="w-fit px-5" />
			</div>
		</Modal>
	);
};

export default CreateAddOnModal;
