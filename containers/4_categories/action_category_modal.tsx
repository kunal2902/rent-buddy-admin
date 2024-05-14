'use-client';

import { Dispatch, SetStateAction } from 'react';
import { ButtonComponent, ModalComponent } from '@/components';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	handleActionCat: () => void;
	catType: string;
	isDisable: boolean;
}

const ActionCategoryModal = (props: Props) => {
    const { isOpen, onClose, handleActionCat, catType, isDisable } = props;

    return (
	<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="Action category">
		Are you sure want to {isDisable === true && catType === 'disable' ? 'disable' : catType === 'delete' ? 'delete' : 'enable'}     this category?
		<div className="mt-1 flex items-center justify-end">
			<ButtonComponent size="md" variant="subtle" title="No" color="red" px={5} mr={5} onClick={onClose} />
			<ButtonComponent title="Yes" size="md" px={5} ml={5} onClick={handleActionCat} />
		</div>
	</ModalComponent>
    );
};

export default ActionCategoryModal;
