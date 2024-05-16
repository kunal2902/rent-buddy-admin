'use-client';

import { Dispatch, SetStateAction } from 'react';
import { ButtonComponent, ModalComponent } from '@/components';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	handleActionItem: () => void;
	itemType: string;
	isDisable: boolean;
}

const ActionItemModal = (props: Props) => {
    const { isOpen, onClose, handleActionItem, itemType, isDisable } = props;

    return (
	<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="Action item type">
		Are you sure want to {isDisable === true && itemType === 'disable' ? 'disable' : itemType === 'delete' ? 'delete' : 'enable'} this item type?
		<div className="mt-1 flex items-center justify-end">
			<ButtonComponent size="md" variant="subtle" title="No" color="red" px={5} mr={5} onClick={onClose} />
			<ButtonComponent title="Yes" size="md" px={5} ml={5} onClick={handleActionItem} />
		</div>
	</ModalComponent>
    );
};

export default ActionItemModal;
