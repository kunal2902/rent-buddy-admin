"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
	ButtonComponent,
	GroupComponent,
	ModalComponent,
	SpaceComponent, StackComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setAddress: Dispatch<SetStateAction<string | undefined>>;
	address: string | undefined;
	setCity: Dispatch<SetStateAction<string | undefined>>;
	city: string | undefined;
	setState: Dispatch<SetStateAction<string | undefined>>;
	state: string | undefined;
	setPinCode: Dispatch<SetStateAction<string | undefined>>;
	pinCode: string | undefined;
}

const AddShipToModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		setAddress,
		address,
		setCity,
		city,
		setState,
		state,
		setPinCode,
		pinCode,
	} = props;
	const [inputError, setInputError] = useState<string | null>(null);

	const isEditModal: boolean = address !== "";

	const handleSubmitShipTo = () => {
		if (!address) {
			setInputError("Please enter the address first!");
			return;
		}
		if (!city) {
			setInputError("Please enter the city first!");
			return;
		}
		if (!state) {
			setInputError("Please enter the province first!");
			return;
		}
		if (!pinCode) {
			setInputError("Please enter the postal code first!");
			return;
		}

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
			title={<TitleComponent title={isEditModal ? "Edit Ship To Address" : "New Ship To Address"} />}
			size="lg"
		>
			<StackComponent>

				<TextInputComponent
					required
					title="Address"
					label="Address"
					value={address}
					error={inputError}
					setValue={setAddress}
					placeholder="Address"
				/>

				<GroupComponent grow>
					<TextInputComponent
						required
						title="City"
						label="City"
						value={city}
						error={inputError}
						setValue={setCity}
						placeholder="City"
					/>
					<TextInputComponent
						required
						title="Province"
						label="Province"
						value={state}
						error={inputError}
						setValue={setState}
						placeholder="Province"
					/>
					<TextInputComponent
						required
						title="Postal Code"
						label="Postal Code"
						value={pinCode}
						error={inputError}
						setValue={setPinCode}
						placeholder="Postal Code"
					/>
				</GroupComponent>

			</StackComponent>

			<SpaceComponent showHeight />

			<GroupComponent justify="end">
				<ButtonComponent
					title="Save"
					w={100}
					onClick={handleSubmitShipTo}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AddShipToModal;
