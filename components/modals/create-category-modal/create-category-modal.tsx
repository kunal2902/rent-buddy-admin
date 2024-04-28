"use client";

import { Modal, ModalHeader } from "@/components/common";
import { useCreateCategoryModal } from "./hook";
import { SolidBtn, TextInput } from "@/components/elements";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const CreateCategoryModal = (props: Props) => {
	const { isOpen, onClose } = props;
	const { categoryName, onCategoryNameChange } = useCreateCategoryModal();

	return (
		<Modal isOpen={isOpen} onClose={onClose} className="border-grey-800">
			<ModalHeader title="Create New Category" onClose={onClose} />

			<TextInput
				title="Name*"
				value={categoryName}
				onChange={onCategoryNameChange}
				inputClassName="border-grey-600 py-2 font-barlow font-base text-base"
				className="mt-1"
			/>

			<div className="mt-1 flex items-center justify-end">
				<SolidBtn title="Save" className="w-fit px-5" />
			</div>
		</Modal>
	);
};

export default CreateCategoryModal;
