'use client';

import { useCreateTagModal } from './hook';
import { ButtonComponent, ModalComponent, TextInputComponent } from '@/components';

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const AddTagModal = (props: Props) => {
	const { isOpen, onClose } = props;

	const { tagName, onTagNameChange } = useCreateTagModal();

	return (
		<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="New Tag">

			<TextInputComponent
				mt={1}
				required
				title="Name"
				value={tagName}
				placeholder="Awesome Name"
				onChange={onTagNameChange}
				className="border-grey-600 font-barlow font-base text-base"
			/>

			<div className="mt-1 flex items-center justify-end">
				<ButtonComponent title="Save" fullWidth px={5} />
			</div>
		</ModalComponent>
	);
};

export default AddTagModal;
