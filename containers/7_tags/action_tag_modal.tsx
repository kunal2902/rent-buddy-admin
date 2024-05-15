'use client';

import { toast } from 'react-toastify';
import { Dispatch, SetStateAction } from 'react';
import { ButtonComponent, ModalComponent } from '@/components';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	handleActionTag: () => void;
	tagType: string;
	isDisable: boolean;
}

const ActionTagModal = (props: Props) => {
	const { isOpen, onClose, handleActionTag, tagType, isDisable } = props;

	return (
		<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="Action tag">
			Are you sure want to {isDisable && tagType === 'disable' ? 'disable' : tagType === 'delete' ? 'delete' : 'enable'} this tag?
			<div className="mt-1 flex items-center justify-end">
				<ButtonComponent size="md" variant="subtle" title="No" color="red" px={5} mr={5} onClick={onClose} />
				<ButtonComponent title="Yes" size="md" px={5} ml={5} onClick={handleActionTag} />
			</div>
		</ModalComponent>
	);
};

export default ActionTagModal;
