"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ButtonComponent, GroupComponent,
	ModalComponent, SpaceComponent,
	TextInputComponent, TitleComponent,
} from "@/components";
import { logoutUser, upsertTagApi } from "@/utils";
import ShowNotification from "@/components/mantine/show_notification";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialTagValue: string;
	tagId: string;
}

const AddTagModal = (props: Props) => {
	const router = useRouter();
	const { isOpen, onClose, setCallApi, initialTagValue, tagId } = props;
	const [tagName, setTagName] = useState<string>(initialTagValue);
	const [inputError, setInputError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
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
		setLoading(true);
		try {
			await upsertTagApi(
				body,
				() => {
					onClose();
					setCallApi(val => !val);
					setLoading(false);
					ShowNotification("Success", "success");
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
					loading={loading}
					title="Save"
					w={100}
					onClick={handleSubmitTag}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AddTagModal;
