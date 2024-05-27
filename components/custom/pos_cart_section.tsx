"use client";

import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Box, Divider, Stack } from "@mantine/core";
import { AddIcon } from "@storybook/icons";
import {
	ActionIconComponent,
	ButtonComponent,
	CardComponent,
	GroupComponent,
	ScrollAreaComponent,
	SelectComponent,
	TextComponent,
	TooltipComponent,
} from "@/components";
import AddUserModal from "@/containers/10_users/add_user_modal";
import { appAccentColorRGBA, currencySign } from "@/utils";
import { ComboBoxProps } from "@/types";

export const PosCartSection = () => {
	const [isUserModalOpen, setUserModalOpen] = useState(false);
	const [selectedCustomer, setSelectedCustomer] = useState<string | null>("");
	const customerData: Array<ComboBoxProps> = [
		{
			id: "1",
			value: "1",
			label: "User 1",
		},
		{
			id: "2",
			value: "2",
			label: "User 2",
		},
	];

	return (
		<>
			<AddUserModal
				isOpen={isUserModalOpen}
				onClose={() => {
					setUserModalOpen(false);
				}}
				setCallApi={() => {}}
			/>
			<div
				className="w-[30%] pr-3 mt-1"
				style={{ height: "calc(100vh - 56px)" }}
			>
				<Box h={40}>
					<GroupComponent>
						<SelectComponent
							required
							data={customerData}
							value={selectedCustomer}
							placeholder="Select Customer"
							setValue={setSelectedCustomer}
							style={{ width: "calc(100% - 60px)" }}
						/>
						<TooltipComponent label="Add Customer">
							<ActionIconComponent
								w={40}
								h={40}
								variant="filled"
								onClick={() => {
									setUserModalOpen(true);
								}}
							>
								<AddIcon />
							</ActionIconComponent>
						</TooltipComponent>
					</GroupComponent>
				</Box>

				<Box className="mt-3" h={30}>
					<TextComponent
						bold
						size="xl"
						text="Order Details"
					/>
				</Box>

				<CardComponent
					className="mt-3"
					mih={90}
					shadow="sm"
					radius="md"
					padding="sm"
					withBorder>
					<Stack gap="sm">
						<GroupComponent justify="space-between">
							<TextComponent
								text="Customer Name:"
								bold />
							<TextComponent text="Ashish Kumar" />
						</GroupComponent>
						<GroupComponent justify="space-between">
							<TextComponent
								text="Order Date:"
								bold />
							<TextComponent
								text="12/06/2024 11:12 AM" />
						</GroupComponent>
					</Stack>
				</CardComponent>

				<CardComponent
					p={0}
					shadow="sm"
					radius="md"
					withBorder
					className="my-3"
					style={{ height: "calc(100vh - 454px" }}>
					<ScrollAreaComponent>
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item =>
							<Box px={12} pt={12} pb={item === 10 ? 6 : 0}>
								<Stack gap={0}>
									<GroupComponent justify="space-between" gap={0}>
										<TextComponent text={`Product name ${item}`} />
										<TextComponent text={`${currencySign} ${item * 110}`} c="green" />
									</GroupComponent>
									<TextComponent text={`x ${item}`} c="dimmed" />
									{item !== 10 &&
										<Divider my={0} variant="dashed" p={0} py={0} />
									}
								</Stack>
							</Box>
						)}
					</ScrollAreaComponent>
				</CardComponent>

				<CardComponent
					padding="sm"
					shadow="sm"
					radius="md"
					withBorder
					style={{ height: 120 }}>
					<Stack gap="sm">
						<GroupComponent justify="space-between">
							<TextComponent text="Sub Total:" size="sm" />
							<TextComponent text={`${currencySign} 300`} bold size="sm" />
						</GroupComponent>
						<GroupComponent justify="space-between">
							<TextComponent text="Tax (15%):" size="sm" />
							<TextComponent text={`${currencySign} 45`} bold size="sm" />
						</GroupComponent>
						<Divider my={0} variant="dashed" p={0} py={0} />
						<GroupComponent justify="space-between">
							<TextComponent text="Total:" bold />
							<TextComponent text={`${currencySign} 345`} bold />
						</GroupComponent>
					</Stack>
				</CardComponent>

				<Box h={40} className="mt-3">
					<GroupComponent>
						<TooltipComponent label="Clear cart">
							<ActionIconComponent c="red" maw={36} h={36}>
								<RiDeleteBin6Line />
							</ActionIconComponent>
						</TooltipComponent>
						<GroupComponent grow justify="space-evenly" w="calc(100% - 50px)">
							<ButtonComponent color={appAccentColorRGBA} title="Save Draft" />
							<ButtonComponent title="Checkout" />
						</GroupComponent>
					</GroupComponent>
				</Box>
			</div>
		</>
	);
};
