"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ButtonComponent,
	GroupComponent,
	ModalComponent,
	SpaceComponent, StackComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { NumberInputComponent } from "@/components/mantine/number_input_component";
import { logoutUser, upsertCustomerApi } from "@/utils";
import ShowNotification from "@/components/mantine/show_notification";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialValueName: string;
	initialValuePhoneNumber: string | undefined;
	initialValueEmail?: string;
	customerId?: string;
	initialValueAddress: string | undefined;
	initialValueCity: string | undefined;
	initialValueState: string | undefined;
	initialValuePinCode: string | undefined;
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
		initialValueAddress,
		initialValueCity,
		initialValueState,
		initialValuePinCode,
	} = props;
	const router = useRouter();
	const [name, setName] = useState<string>(initialValueName);
	const [email, setEmail] = useState<string | undefined>(initialValueEmail);
	const [phoneNumber, setPhoneNumber] =
		useState<string | number | undefined>(initialValuePhoneNumber);
	const [address, setAddress] = useState<string | undefined>(initialValueAddress);
	const [city, setCity] = useState<string | undefined>(initialValueCity);
	const [state, setState] = useState<string | undefined>(initialValueState);
	const [pinCode, setPinCode] = useState<string | number | undefined>(initialValuePinCode);
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
			city,
			state,
			address,
			pinCode: pinCode ? pinCode.toString() : undefined,
			id: customerId,
			phone: phoneNumber,
		};
		try {
			await upsertCustomerApi(
				body,
				() => {
					ShowNotification("Success", "success");
					onClose();
					setCallApi(val => !val);
				},
				(err: any) => {
					ShowNotification(err.error, "error");
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
			size="lg"
		>
			<StackComponent>
				<GroupComponent grow align="start">
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
						placeholder="Phone Number"
					/>
				</GroupComponent>

				<TextInputComponent
					title="Email"
					label="Email"
					value={email}
					error={inputError}
					setValue={setEmail}
					placeholder="abc@gmail.com"
				/>

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
					onClick={handleSubmitCustomer}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AddCustomerModal;
