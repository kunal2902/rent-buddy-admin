"use client";

import React from "react";
import {
	BoxComponent, ButtonComponent,
	CardComponent, DividerComponent,
	GroupComponent, ModalComponent,
	StackComponent,
	TextComponent,
	TitleComponent,
} from "@/components";
import {
	appAccentColorRGBA,
	currencySign,
} from "@/utils";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	subTotal: number;
	total: number;
	tax5:number;
	tax7: number;
	totalEHF: number | undefined;
	totalRemovalCharges: number | undefined;
	deliveryCharges: string | number | undefined;
}

const PriceBreakupModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		subTotal,
		total,
		tax5,
		tax7,
		totalEHF,
		totalRemovalCharges,
		deliveryCharges,
	} = props;

	return (
		<ModalComponent
			opened={isOpen}
			onClose={onClose}
			className="border-grey-800"
			title={<TitleComponent title="Price Breakup" />}
		>

			<CardComponent padding="sm" shadow="sm" radius="md" withBorder style={{ height: "auto" }}>
				<StackComponent gap="sm">
					<GroupComponent justify="space-between">
						<TextComponent text="Sub Total:" size="sm" bold />
						<TextComponent text={`${currencySign} ${subTotal.toFixed(2)}`} bold size="sm" />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="EHF:" size="sm" bold />
						<TextComponent text={`${currencySign} ${totalEHF}`} bold size="sm" />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="Delivery Charges:" size="sm" bold />
						<TextComponent text={`${currencySign} ${Number(deliveryCharges).toFixed(2)}`} bold size="sm" />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="Removal" size="sm" bold />
						<TextComponent text={`${currencySign} ${Number(totalRemovalCharges).toFixed(2)}`} bold size="sm" />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="5% GST:" size="sm" bold />
						<TextComponent text={`${currencySign} ${tax5.toFixed(2)}`} bold size="sm" />
					</GroupComponent>
					<GroupComponent justify="space-between">
						<TextComponent text="7% PST:" size="sm" bold />
						<TextComponent text={`${currencySign} ${tax7.toFixed(2)}`} bold size="sm" />
					</GroupComponent>
					<DividerComponent my={0} variant="dashed" p={0} py={0} />
					<GroupComponent justify="space-between">
						<TextComponent text="Total:" bold />
						<TextComponent text={`${currencySign} ${total.toFixed(2)}`} bold />
					</GroupComponent>
				</StackComponent>
			</CardComponent>

			<BoxComponent h={60} className="mt-3">
				<GroupComponent grow justify="end">
					<GroupComponent grow justify="end">
						<ButtonComponent
							title="Close"
							variant="subtle"
							color={appAccentColorRGBA}
							onClick={onClose}
						/>
					</GroupComponent>
				</GroupComponent>
			</BoxComponent>
		</ModalComponent>
	);
};

export default PriceBreakupModal;
