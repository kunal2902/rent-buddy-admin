'use client';

import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { ButtonComponent, ModalComponent, TextInputComponent } from '@/components';
import { FileInputComponent } from '@/components/mantine/file_input_component';
import { upsertSubCategoryApi } from '@/utils';
import { useCreateSubCategoryModal } from './hook';

interface Props {
    isOpen: boolean;
    onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
}

const CreateSubCategoryModal = (props: Props) => {
	const { isOpen, onClose, setCallApi } = props;
	const { subCategoryName, onSubCategoryNameChange } = useCreateSubCategoryModal();

	const handleSubmitSubCat = async (event: React.FormEvent) => {
        event.preventDefault();
        const body = {
			name: subCategoryName,
        };
        try {
            await upsertSubCategoryApi(
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
		<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="New sub category">
			<div>
				<FileInputComponent
					label="Please select sub category icon"
					placeholder="Sub category icon"
				/>

				{/* image preview */}

				{/* select category */}

				<TextInputComponent
					mt={1}
					required
					title="Name"
					value={subCategoryName}
					placeholder="Awesome Name"
					onChange={onSubCategoryNameChange}
					className="border-grey-600 font-barlow font-base text-base"
				/>
			</div>
			<div className="mt-1 flex items-center justify-end">
				<ButtonComponent size="md" variant="subtle" title="No" color="red" px={5} mr={5} onClick={onClose} />
				<ButtonComponent title="Save" size="md" px={5} ml={5} onClick={handleSubmitSubCat} />
			</div>
		</ModalComponent>
	);
};

export default CreateSubCategoryModal;
