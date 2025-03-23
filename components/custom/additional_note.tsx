"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
	ButtonComponent,
	GroupComponent,
	ModalComponent,
	SpaceComponent,
	TextAreaInputComponent,
	TitleComponent
} from "@/components";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setNote: Dispatch<SetStateAction<string | undefined>>;
	note: string | undefined;
}

const AdditionalNoteModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		setNote,
		note
	} = props;
	const [inputError, setInputError] = useState<string | null>(null);

	const handleSubmitAdditionalNote = () => {
		// if (!address) {
		// 	setInputError("Please enter the address first!");
		// 	return;
		// }
		// if (!city) {
		// 	setInputError("Please enter the city first!");
		// 	return;
		// }
		// if (!state) {
		// 	setInputError("Please enter the province first!");
		// 	return;
		// }
		// if (!pinCode) {
		// 	setInputError("Please enter the postal code first!");
		// 	return;
		// }

		// Clear the error
		setInputError(null);

		// Close the modal
		onClose();
	};

	return (
		<ModalComponent
			opened={isOpen}
			onClose={onClose}
			className="border-grey-800"
			title={<TitleComponent title="Add Additional Note" />}
			size="lg"
		>

			<TextAreaInputComponent
				required
				title="Additional Note"
				// label="Additional Note"
				value={note}
				error={inputError}
				setValue={setNote}
				placeholder="Additional Note"
			/>

			<SpaceComponent showHeight />

			<GroupComponent justify="end">
				<ButtonComponent
					title="Save"
					w={100}
					onClick={handleSubmitAdditionalNote}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AdditionalNoteModal;
