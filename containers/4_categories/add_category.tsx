'use client';

import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { useCreateCategoryModal } from './hook';
import { ButtonComponent, ModalComponent, TextInputComponent } from '@/components';
import { upsertCategoryApi } from '@/utils';

interface Props {
    isOpen: boolean;
    onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
}

const CreateCategoryModal = (props: Props) => {
	const { isOpen, onClose, setCallApi } = props;
	const { categoryName, onCategoryNameChange } = useCreateCategoryModal();

	const handleSubmitCat = async (event: React.FormEvent) => {
        event.preventDefault();
        const body = {
			name: categoryName,
        };
        try {
            await upsertCategoryApi(
                body,
                () => {
					onClose();
					setCallApi(true);
                },
                (message: string) => {
                    toast.error(message);
                },
				() => {}
            );
        } catch (error) {
            console.error('Error:', error);
        }
    };

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
				<ButtonComponent title="Save" fullWidth px={5} onClick={handleSubmitCat} />
			</div>
		</ModalComponent>
	);
};

export default CreateCategoryModal;
