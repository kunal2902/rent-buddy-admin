import { Stack } from "@mantine/core";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ButtonComponent,
	GroupComponent,
	ModalComponent,
	SpaceComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { NumberInputComponent } from "@/components/mantine/number_input_component";
import { logoutUser, upsertCustomerApi } from "@/utils";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialValueName: string;
	initialValuePhoneNumber: string;
	initialValueEmail?: string;
	customerId?: string;
}

const AddCustomerModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		setCallApi,
		initialValueName,
		initialValuePhoneNumber,
		initialValueEmail,
		customerId,
	} = props;
	const router = useRouter();
	const [name, setName] = useState<string>(initialValueName);
	const [email, setEmail] = useState<string | undefined>(initialValueEmail);
	const [phoneNumber, setPhoneNumber] = useState<string | number>(initialValuePhoneNumber);
	const [inputError, setInputError] = useState<string | null>(null);

	const isEditModal: boolean = initialValueName !== "";

	const handleSubmitCustomer = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!name) {
			setInputError("Please enter the name first");
		}
		const body = {
			email,
			name,
			id: customerId,
			phone: phoneNumber.toString(),
		};
		try {
			await upsertCustomerApi(
				body,
				() => {
					onClose();
					setCallApi(val => !val);
				},
				() => {
				},
				() => {
					logoutUser(router);
				}
			);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<ModalComponent
			opened={isOpen}
			onClose={onClose}
			className="border-grey-800"
			title={<TitleComponent title={isEditModal ? "Edit User" : "New User"} />}
		>
			<GroupComponent grow align="start">
				<Stack>
					<TextInputComponent
						required
						title="Name"
						label="Name"
						value={name}
						error={inputError}
						setValue={setName}
						placeholder="Enter Name"
					/>

					<NumberInputComponent
						required
						title="Phone Number"
						label="Phone Number"
						value={phoneNumber}
						error={inputError}
						setValue={setPhoneNumber}
						placeholder="Phone number"
					/>

					<TextInputComponent
						title="Email"
						label="Email"
						value={email}
						error={inputError}
						setValue={setEmail}
						placeholder="abc@gmail.com"
					/>

				</Stack>
			</GroupComponent>

			<SpaceComponent showHeight />

			<GroupComponent justify="end">
				<ButtonComponent
					title="Save"
					w={100}
					onClick={handleSubmitCustomer}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AddCustomerModal;
