'use-client';

import { Dispatch, SetStateAction } from 'react';
import { ButtonComponent, ModalComponent } from '@/components';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	handleActionAddOn: () => void;
	addOnType: string;
	isDisable: boolean;
}

const ActionAddOnModal = (props: Props) => {
    const { isOpen, onClose, handleActionAddOn, addOnType, isDisable } = props;

    return (
	<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="Action add on">
		Are you sure want to {isDisable === true && addOnType === 'disable' ? 'disable' : addOnType === 'delete' ? 'delete' : 'enable'} this add on?
		<div className="mt-1 flex items-center justify-end">
			<ButtonComponent size="md" variant="subtle" title="No" color="red" px={5} mr={5} onClick={onClose} />
			<ButtonComponent title="Yes" size="md" px={5} ml={5} onClick={handleActionAddOn} />
		</div>
	</ModalComponent>
    );
};

export default ActionAddOnModal;
