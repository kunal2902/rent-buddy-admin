"use client";

import { toast } from "react-toastify";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
	ButtonComponent, GroupComponent,
	ModalComponent, SpaceComponent,
	TextInputComponent, TitleComponent,
} from "@/components";
import { upsertTagApi } from "@/utils";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialTagValue: string;
	tagId: string;
}

const AddTagModal = (props: Props) => {
	const { isOpen, onClose, setCallApi, initialTagValue, tagId } = props;
	const [tagName, setTagName] = useState<string>(initialTagValue);
	const [inputError, setInputError] = useState<string | null>(null);
	const isEditModal: boolean = initialTagValue !== "";

	useEffect(() => {
		if (tagName) {
			setInputError(null);
		}
	}, [tagName]);

	const handleSubmitTag = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!tagName) {
			setInputError("Please enter the name first");
		}
		const body = {
			name: tagName,
			id: tagId,
		};
		try {
			await upsertTagApi(
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
			title={<TitleComponent title={isEditModal ? "Edit Tag" : "New Tag"} />}
		>
			<TextInputComponent
				required
				title="Name"
				label="Tag Name"
				value={tagName}
				error={inputError}
				setValue={setTagName}
				placeholder="Enter tag Name"
			/>

			<SpaceComponent showHeight />

			<GroupComponent justify="end">
				<ButtonComponent
					title="Save"
					w={100}
					onClick={handleSubmitTag}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AddTagModal;
