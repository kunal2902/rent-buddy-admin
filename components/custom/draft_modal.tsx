'use client';

import { ButtonComponent, ModalComponent } from '@/components';

export interface DraftModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const DraftModal = (props: DraftModalProps) => {
	const { isOpen, onClose } = props;

	return (
		<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="Draft Orders">

			<div className="mt-1 flex items-center justify-end">
				<ButtonComponent title="Save" fullWidth px={5} />
			</div>
		</ModalComponent>
	);
};
