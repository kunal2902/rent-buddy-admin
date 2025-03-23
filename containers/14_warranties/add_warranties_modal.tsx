"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ButtonComponent,
	GroupComponent,
	ModalComponent, NumberInputComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { logoutUser, upsertWarrantyApi } from "@/utils";
import ShowNotification from "@/components/mantine/show_notification";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	warrantyId: string;
	initialWarrantyTitleValue:string;
	initialPriceValue: number | undefined | string;
	initialMinPrice: number | undefined | string;
	initialMaxPrice: number | undefined | string;
}

const AddWarrantyModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		setCallApi,
		warrantyId,
		initialWarrantyTitleValue,
		initialPriceValue,
		initialMinPrice,
		initialMaxPrice,
	} = props;
	const router = useRouter();
	const isEditModal: boolean = initialWarrantyTitleValue !== "";
	const [loading, setLoading] = useState<boolean>(false);
	const [warrantyTitle, setWarrantyTitle] = useState<string>(initialWarrantyTitleValue);
	const [inputError, setInputError] = useState<string | null>(null);
	const [price, setPrice] = useState<number | undefined | string>(initialPriceValue);
	const [minPrice, setMinPrice] = useState<number | undefined | string>(initialMinPrice);
	const [maxPrice, setMaxPrice] = useState<number | undefined | string>(initialMaxPrice);

	useEffect(() => {
		if (warrantyTitle) {
			setInputError(null);
		}
	}, [warrantyTitle]);

	const handleSubmitWarranty = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!setWarrantyTitle) {
			setInputError("Please enter the name first");
		}

		const warrantyData = {
			id: warrantyId,
			warranty_title: warrantyTitle,
			price: String(price),
			min_price: String(minPrice),
			max_price: String(maxPrice),
		};

		console.log(warrantyData);

		try {
			await upsertWarrantyApi(
				warrantyData,
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
			title={<TitleComponent title={isEditModal ? "Edit Warranty" : "New Warranty"} />}
		>
			<GroupComponent grow align="start">
				<TextInputComponent
					required
					title="Name"
					label="Warranty Name"
					value={warrantyTitle}
					error={inputError}
					setValue={setWarrantyTitle}
					placeholder="Enter Warranty Name"
				/>
				<NumberInputComponent
					min={0}
					required
					value={price}
					setValue={(value) => setPrice(value !== "" ? Number(value) : undefined)}
					title="Warranty Price"
					label="Warranty Price"
					error={inputError}
					placeholder="Enter Price"
				/>
			</GroupComponent>
			<GroupComponent grow align="start">
				<NumberInputComponent
					min={0}
					required
					value={minPrice}
					setValue={(value) => setMinPrice(value !== "" ? Number(value) : undefined)}
					title="Minimum Price"
					label="Minimum Price"
					error={inputError}
					placeholder="Enter Price"
				/>
				<NumberInputComponent
					min={0}
					required
					value={maxPrice}
					setValue={(value) => setMaxPrice(value !== "" ? Number(value) : undefined)}
					title="Maximum Price"
					label="Maximum Price"
					error={inputError}
					placeholder="Enter Price"
				/>
			</GroupComponent>

			<GroupComponent mt={10} justify="end">
				<ButtonComponent
					loading={loading}
					title="Save"
					w={100}
					onClick={handleSubmitWarranty}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AddWarrantyModal;
