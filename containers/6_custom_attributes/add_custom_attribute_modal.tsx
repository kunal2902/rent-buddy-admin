"use client";

import React, { useState } from "react";
import { ButtonComponent, ModalComponent, SelectComponent, TextInputComponent } from "@/components";
import { CustomAttributeTypeOptions } from "@/constants";
import { CustomAttributeModel } from "@/models";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: (arg0: boolean) => void;
	customAttribute: CustomAttributeModel | undefined
}

const AddCustomAttributeModal = (props: Props) => {
	const { isOpen, onClose } = props;
	const [loading, setLoading] = useState(false);
	const [customAttributeName, setCustomAttributeName] = useState<string>("");
	const [type, setType] = useState<string | null>(null);

	return (
		<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="New Attribute">

			<TextInputComponent
				mt={1}
				required
				title="Name"
				placeholder="Awesome Name"
				value={customAttributeName}
				setValue={setCustomAttributeName}
				className="border-grey-600 font-barlow font-base text-base"
			/>

			<SelectComponent
				required
				label="Type"
				value={type}
				setValue={setType}
				placeholder="Select a type"
				data={CustomAttributeTypeOptions}
			/>

			<div className="mt-1 flex items-center justify-end">
				<ButtonComponent
					loading={loading}
					w={100}
					title="Save"
				/>
			</div>
		</ModalComponent>
	);
};

export default AddCustomAttributeModal;
