"use client";

import { useCreateCategoryModal } from "./hook";
import { ButtonComponent, ModalComponent, TextInputComponent } from "@/components";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const CreateCategoryModal = (props: Props) => {
	const { isOpen, onClose } = props;
	const { categoryName, onCategoryNameChange } = useCreateCategoryModal();

	return (
		<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="New Category">

			<TextInputComponent
				mt={1}
				required
				title="Name"
				value={categoryName}
				placeholder="Awesome Name"
				onChange={onCategoryNameChange}
				className="border-grey-600 font-barlow font-base text-base"
			/>

			<div className="mt-1 flex items-center justify-end">
				<ButtonComponent title="Save" fullWidth px={5} />
			</div>
		</ModalComponent>
	);
};

export default CreateCategoryModal;
