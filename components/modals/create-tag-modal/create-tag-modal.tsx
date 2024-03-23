"use client";

import { Modal, ModalHeader } from "@/components/common";
import { SolidBtn, TextInput } from "@/components/elements";
import { useCreateTagModal } from "./hook";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const CreateTagModal = (props: Props) => {
	const { isOpen, onClose } = props;

	const { tagName, onTagNameChange } = useCreateTagModal();

	return (
		<Modal isOpen={isOpen} onClose={onClose} className="border-grey-800">
			<ModalHeader title="Create A Tag" onClose={onClose} />

			<TextInput
				title="Tag Name"
				value={tagName}
				onChange={onTagNameChange}
				inputClassName="border-grey-600 py-2 font-barlow font-base text-base"
				className="mt-1"
			/>

			<div className="mt-1 flex items-center justify-end">
				<SolidBtn title="Save" className="w-fit px-5" />
			</div>
		</Modal>
	);
};

export default CreateTagModal;
