'use client';

import { useCreateCustomAttributeModal } from './hook';
import { ButtonComponent, ModalComponent, SelectComponent, TextInputComponent } from '@/components';
import { CustomAttributeTypeOptions } from '@/constants';

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const AddCustomAttributeModal = (props: Props) => {
	const { isOpen, onClose } = props;

	const {
		customAttributeName,
		onCustomAttributeNameChange,
		type,
		onTypeChange,
	} = useCreateCustomAttributeModal();

	return (
		<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="New Attribute">

			<TextInputComponent
				mt={1}
				required
				title="Name"
				placeholder="Awesome Name"
				value={customAttributeName}
				onChange={onCustomAttributeNameChange}
				className="border-grey-600 font-barlow font-base text-base"
			/>

			<SelectComponent
				required
				value={type}
				label="Type"
				onChange={onTypeChange}
				placeholder="Select a type"
				data={CustomAttributeTypeOptions}
			/>

			<div className="mt-1 flex items-center justify-end">
				<ButtonComponent title="Save" fullWidth px={5} />
			</div>
		</ModalComponent>
	);
};

export default AddCustomAttributeModal;
