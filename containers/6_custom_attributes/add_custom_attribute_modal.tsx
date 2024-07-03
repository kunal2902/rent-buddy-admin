"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ButtonComponent,
	CheckboxComponent,
	ModalComponent,
	SelectComponent,
	StackComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { CustomAttributeTaxTypeOptions, CustomAttributeTypeOptions } from "@/constants";
import { logoutUser, mantineSize, upsertAttributeApi } from "@/utils";
import ShowNotification from "@/components/mantine/show_notification";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	customAttributeId: string;
	initialValueName: string;
	initialValueType: string;
	initialValueDefaultValue: string;
	initialValueIsTax: boolean;
	initialValueTaxType: string;
}

const AddCustomAttributeModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		setCallApi,
		initialValueName,
		initialValueType,
		customAttributeId,
		initialValueIsTax,
		initialValueTaxType,
		initialValueDefaultValue,
	} = props;
	const isEditModal: boolean = true;
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [isTax, setIsTax] = useState<boolean>(initialValueIsTax);
	const [type, setType] = useState<string | null>(initialValueType);
	const [taxType, setTaxType] = useState<string | null>(initialValueTaxType);
	const [inputError, setInputError] = useState<string | null>(null);
	const [defaultValue, setDefaultValue] = useState<string>(initialValueDefaultValue);
	const [customAttributeName, setCustomAttributeName] = useState<string>(initialValueName);

	useEffect(() => {
		if (customAttributeName) {
			setInputError(null);
			setIsTax(initialValueIsTax);
		}
	}, [customAttributeName, initialValueIsTax]);

	const handleSubmitCustomAttribute = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!customAttributeName) {
			setInputError("Please enter the name first");
		}

		let customAttributeBody;
		if (isTax) {
			customAttributeBody = {
				id: customAttributeId,
				name: customAttributeName,
				type,
				default_value: defaultValue,
				is_tax: isTax,
				tax_type: taxType,
			};
		} else {
			customAttributeBody = {
				id: customAttributeId,
				name: customAttributeName,
				type,
				default_value: defaultValue,
				is_tax: isTax,
			};
		}
		setLoading(true);
		try {
			await upsertAttributeApi(
				customAttributeBody,
				() => {
					onClose();
					setCallApi(val => !val);
					setLoading(false);
					ShowNotification("Successfully", "success");
				},
				(message: any) => {
					ShowNotification(message.error, "error");
					setLoading(false);
				},
				() => {
					logoutUser(router);
				},
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
			title={<TitleComponent title={isEditModal ? "Edit Custom Attribute" : "New Custom Attribute"} />}
		>
			<StackComponent>
				<TextInputComponent
					required
					title="Name"
					label="Custom Attribute Name"
					value={customAttributeName}
					error={inputError}
					setValue={setCustomAttributeName}
					placeholder="Enter Custom Attribute Name"
				/>

				<SelectComponent
					required
					label="Type"
					value={type}
					setValue={setType}
					placeholder="Select a Type"
					data={CustomAttributeTypeOptions}
				/>

				<TextInputComponent
					required
					title="Value"
					label="Enter Default Value"
					value={defaultValue}
					error={inputError}
					setValue={setDefaultValue}
					placeholder="Enter Default Value"
				/>

				<CheckboxComponent
					label="Calculate this on bill?"
					size={mantineSize}
					checked={initialValueIsTax}
					onChecked={(checked) => setIsTax(checked)}
				/>
				{isTax &&
					<SelectComponent
						required
						label="Calculation type"
						value={taxType}
						setValue={setTaxType}
						placeholder="Select a Calculation type"
						data={CustomAttributeTaxTypeOptions}
					/>
				}

			</StackComponent>

			<div className="mt-1 flex items-center justify-end">
				<ButtonComponent
					loading={loading}
					w={100}
					title="Save"
					onClick={handleSubmitCustomAttribute}
				/>
			</div>
		</ModalComponent>
	);
};

export default AddCustomAttributeModal;
