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

interface Props {
	isOpen: boolean;
	onClose: () => void;
	itemPrice: number;
	selectedWarranty: { duration: string; price: number } | null;
	setSelectedWarranty: (warranty: { duration: string; price: number }) => void;
}

const WarrantyModal = ({
   isOpen,
   onClose,
   itemPrice,
   selectedWarranty,
   setSelectedWarranty,
}: Props) => {
	const warrantyOptions = [
		{
			duration: "1 Year",
			price: itemPrice >= 1500 && itemPrice <= 3499 ? 109 : 129,
		},
		{
			duration: "2 Years",
			price: itemPrice >= 1500 && itemPrice <= 3499 ? 169 : 219,
		},
		{
			duration: "3 Years",
			price: itemPrice >= 1500 && itemPrice <= 3499 ? 219 : 249,
		},
	];

	const handleCardClick = (option: { duration: string; price: number }) => {
		setSelectedWarranty(option);
	};

		console.log(selectedWarranty);

	return (
		<ModalComponent
			opened={isOpen}
			onClose={onClose}
			title={<TitleComponent title="Choose Warranty" />}
		>
			<StackComponent gap="sm">
				{warrantyOptions.map((option) => (
					<div
						key={option.duration}
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
									selectedWarranty?.duration === option.duration
										? "rgba(116, 105, 182, 0.12)"
										: "white",
							}}
						>
							<GroupComponent justify="space-between">
								<TextComponent
									text={`Up to $${
										itemPrice >= 1500 && itemPrice <= 3499
											? "1500"
											: "3500"
									}`}
									bold
								/>
								<TextComponent text={option.duration} bold />
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
							disabled={!selectedWarranty} // Disable button if no warranty selected
						/>
					</GroupComponent>
				</BoxComponent>
			</StackComponent>
		</ModalComponent>
	);
};

export default WarrantyModal;
