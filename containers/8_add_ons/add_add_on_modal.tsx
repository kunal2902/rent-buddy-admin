"use client";

// import { Modal } from '@/components';
import { useCreateAddOnModal } from "./hook";
import { ButtonComponent, ModalComponent, TextInputComponent } from "@/components";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const AddAddOnModal = (props: Props) => {
	const { isOpen, onClose } = props;
	const { addOnName, onAddOnNameChange, addOnPrice, onAddOnPriceChange } =
		useCreateAddOnModal();

	return (
		<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="New Add on">

			<TextInputComponent
				mt={1}
				required
				title="Name"
				value={addOnName}
				placeholder="Awesome Name"
				onChange={onAddOnNameChange}
				className="border-grey-600 font-barlow font-base text-base"
			/>

			<TextInputComponent
				mt={1}
				required
				title="Price"
				type="number"
				value={addOnPrice}
				placeholder="347.1"
				onChange={onAddOnPriceChange}
				className="border-grey-600 font-barlow font-base text-base"
			/>

			<div className="mt-1 flex items-center justify-end">
				<ButtonComponent title="Save" fullWidth px={5} />
			</div>
		</ModalComponent>
	);
};

export default AddAddOnModal;
