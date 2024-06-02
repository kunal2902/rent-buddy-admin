"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Checkbox, Stack } from "@mantine/core";
import {
	ButtonComponent,
	ModalComponent,
	SelectComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { CustomAttributeTaxTypeOptions, CustomAttributeTypeOptions } from "@/constants";
import { CustomAttributeModel } from "@/models";
import { mantineSize, upsertAttributeApi, upsertTagApi } from "@/utils";
import { toast } from "react-toastify";

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
		customAttributeId,
		initialValueName,
		initialValueType,
		initialValueDefaultValue,
		initialValueIsTax,
		initialValueTaxType,
	} = props;
	const [loading, setLoading] = useState(false);
	const [customAttributeName, setCustomAttributeName] = useState<string>(initialValueName);
	const [isTax, setIsTax] = useState<boolean>(initialValueIsTax);
	const [type, setType] = useState<string | null>(initialValueType);
	const [taxType, setTaxType] = useState<string | null>(initialValueTaxType);
	const [defaultValue, setDefaultValue] = useState<string>(initialValueDefaultValue);
	const [inputError, setInputError] = useState<string | null>(null);
	// const isEditModal: boolean = initialItemTypeValue !== "";
	const isEditModal: boolean = true;

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

		let customAttributBody = {};
		if (isTax) {
			customAttributBody = {
				id: customAttributeId,
				name: customAttributeName,
				type,
				defaultValue,
				is_tax: isTax,
				tax_type: taxType,
			};
		} else {
			customAttributBody = {
				id: customAttributeId,
				name: customAttributeName,
				type,
				defaultValue,
				is_tax: isTax,
			};
		}
		setLoading(true);
		try {
			await upsertAttributeApi(
				customAttributBody,
				() => {
					onClose();
					setCallApi(val => !val);
					setLoading(false);
				},
				(message: string) => {
					toast.error(message);
					setLoading(false);
				},
				() => {},
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
			<Stack>
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
					isGrouped={false}
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

				<Checkbox
					label="Is this a tax?"
					size={mantineSize}
					onChange={(event) => setIsTax(event.currentTarget.checked)}
				/>
				{isTax &&
					<SelectComponent
						required
						label="Tax Type"
						value={taxType}
						setValue={setTaxType}
						placeholder="Select a Tax Type"
						data={CustomAttributeTaxTypeOptions}
						isGrouped={false}
					/>
				}

			</Stack>

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
