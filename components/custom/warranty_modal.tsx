"use client";

import React from "react";
import {
	BoxComponent,
	ButtonComponent,
	CardComponent,
	GroupComponent,
	ModalComponent,
	StackComponent,
	TextComponent,
	TitleComponent,
} from "@/components";
import { WarrantyModel } from "@/models/warranty_modal";

interface Props {
	isOpen: boolean;
	itemPrice: number;
	onClose: () => void;
	warrantiesList: Array<WarrantyModel>;
	selectedWarranty: { duration: string; price: number } | null;
	setSelectedWarranty: (warranty: { duration: string; price: number }) => void;
}

const WarrantyModal = ({
   isOpen,
   onClose,
   itemPrice,
   selectedWarranty,
   setSelectedWarranty,
   warrantiesList,
}: Props) => {
	const handleCardClick = (option: WarrantyModel) => {
		setSelectedWarranty({
			duration: option.warranty_title,
			price: Number(option.price),
		});
	};

	return (
		<ModalComponent
			opened={isOpen}
			onClose={onClose}
			title={<TitleComponent title="Choose Warranty" />}
		>
			<StackComponent gap="sm">
				{warrantiesList
					.filter(
						(option) =>
							itemPrice >= Number(option.min_price) &&
							itemPrice <= Number(option.max_price)
					)
					.map((option) => (
						<div
							key={option.warranty_id}
							onClick={() => handleCardClick(option)}
						>
							<CardComponent
								padding="sm"
								shadow="sm"
								radius="md"
								withBorder
								style={{
									cursor: "pointer",
									backgroundColor:
										selectedWarranty?.duration === option.warranty_title
											? "rgba(116, 105, 182, 0.12)" // Highlight color
											: "white", // Default color
								}}
							>
								<GroupComponent justify="space-between">
									<TextComponent
										text={`Up to $${option.max_price}`}
										bold
									/>
									<TextComponent text={option.warranty_title} bold />
									<TextComponent text={`$ ${option.price}`} />
								</GroupComponent>
							</CardComponent>
						</div>
					))}
				<BoxComponent h={60} className="mt-3">
					<GroupComponent grow justify="end">
						<ButtonComponent
							title="Add Warranty"
							onClick={onClose}
							disabled={!selectedWarranty}
						/>
					</GroupComponent>
				</BoxComponent>
			</StackComponent>
		</ModalComponent>
	);
};

export default WarrantyModal;
