"use client";

import { toast } from "react-toastify";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
	ButtonComponent, GroupComponent,
	ModalComponent, SpaceComponent,
	TextInputComponent, TitleComponent,
} from "@/components";
import { upsertItemApi } from "@/utils";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialItemName: string;
	itemId: string;
}

const AddItemModal = (props: Props) => {
	const { isOpen, onClose, setCallApi, initialItemName, itemId } = props;
	const [itemName, setItemName] = useState<string>(initialItemName);
	const [inputError, setInputError] = useState<string | null>(null);
	const isEditModal: boolean = initialItemName !== "";

	useEffect(() => {
		if (itemName) {
			setInputError(null);
		}
	}, [itemName]);

	const handleSubmitItem = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!itemName) {
			setInputError("Please enter the name first");
		}
		const body = {
			name: itemName,
			id: itemId,
		};
		try {
			await upsertItemApi(
				body,
				() => {
					onClose();
					setCallApi(true);
				},
				(message: string) => {
					toast.error(message);
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
			title={<TitleComponent title={isEditModal ? "Edit Item" : "New Item"} />}
		>
			<TextInputComponent
				required
				title="Name"
				label="Item Name"
				value={itemName}
				error={inputError}
				setValue={setItemName}
				placeholder="Enter Item Name"
			/>

			<SpaceComponent showHeight />

			<GroupComponent justify="end">
				<ButtonComponent
					title="Save"
					w={100}
					onClick={handleSubmitItem}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AddItemModal;
