"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox, Fieldset, Stack } from "@mantine/core";
import { Image as ImageIcon } from "lucide-react";
import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import {
	ActionIconComponent,
	ButtonComponent,
	GroupComponent,
	ImageComponent,
	ModalComponent,
	ScrollAreaComponent,
	SelectComponent,
	SimpleGridComponent,
	SpaceComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { logoutUser, upsertItemApi } from "@/utils";
import { NumberInputComponent } from "@/components/mantine/number_input_component";
import { TextAreaInputComponent } from "@/components/mantine/textarea_input_component";
import { StackComponent } from "@/components/mantine/stack_component";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialItemName: string;
	itemId: string;
}

const AddItemModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		setCallApi,
		initialItemName,
		itemId,
	} = props;
	const router = useRouter();
	const isEditModal: boolean = initialItemName !== "";
	const [itemName, setItemName] = useState<string>(initialItemName);
	const [loading, setLoading] = useState<boolean>(false);
	const [inputError, setInputError] = useState<string | null>(null);

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
		setLoading(true);
		const body = {
			name: itemName,
			id: itemId,
		};
		try {
			await upsertItemApi(
				body,
				() => {
					onClose();
					setLoading(false);
					setCallApi(true);
				},
				(message: string) => {
					console.log(message);
					setLoading(false);
				},
				() => {
					logoutUser(router);
					setLoading(false);
				}
			);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	function getImageRow() {
		return (
			<Stack gap={10} h={180} mah={180} maw={160} w={160}>
				<ImageComponent
					src="http://localhost:8000/image/5b694cb7-3dbe-44de-83df-2c042e57fb6d.jpeg"
					w={160}
					h={140}
				/>
				<GroupComponent
					gap={0}
					mah={30}
					h={30}
					justify="center">

					<ActionIconComponent
						size="xs"
						h={30}
						w={30}
						color="red"
						mr={5}
					>
						<MdOutlineDeleteForever size={18} />
					</ActionIconComponent>

					<ActionIconComponent
						size="xs"
						h={30}
						w={30}
						ml={5}
					>
						<MdOutlineEdit size={18} />
					</ActionIconComponent>
				</GroupComponent>
			</Stack>
		);
	}

	function getCustomAttribute() {
		return (
			<GroupComponent align="start">
				<Checkbox mt={7} />
				<TextInputComponent
					className="flex-grow"
					title="Name"
					label="Item Name"
					value={itemName}
					error={inputError}
					setValue={setItemName}
					placeholder="Enter Item Name"
				/>
			</GroupComponent>
		);
	}

	return (
		<ModalComponent
			fullScreen
			opened={isOpen}
			onClose={onClose}
			title={<TitleComponent title={isEditModal ? "Edit Item" : "Add New Item"} />}
		>
			<Fieldset legend={<TitleComponent title="Product Information" order={5} />}>
				<StackComponent>
					<SimpleGridComponent
						cols={{
							base: 1,
							sm: 2,
							md: 3,
							lg: 3,
							xl: 3,
						}}
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
						<TextInputComponent
							title="Internal Name"
							label="Internal Name"
							value={itemName}
							error={inputError}
							setValue={setItemName}
							placeholder="Enter Item Name"
						/>
						<TextInputComponent
							required
							title="SKU"
							label="SKU"
							value={itemName}
							error={inputError}
							setValue={setItemName}
							placeholder="Enter Item Name"
						/>
						<NumberInputComponent
							required
							title="Stock Quantity"
							label="Stock Quantity"
							value={itemName}
							error={inputError}
							// setValue={setItemName}
							placeholder="Enter Item Name"
						/>
						<NumberInputComponent
							required
							title="Price"
							label="Price"
							value={itemName}
							error={inputError}
							// setValue={setItemName}
							placeholder="Enter Item Name"
						/>
					</SimpleGridComponent>
					<GroupComponent grow>
						<TextAreaInputComponent
							required
							title="Short Dscription"
							label="Short Dscription"
							value={itemName}
							error={inputError}
							setValue={setItemName}
							resize="vertical"
							placeholder="Enter Item Name"
						/>
						<TextAreaInputComponent
							title="Dscription"
							label="Dscription"
							value={itemName}
							error={inputError}
							setValue={setItemName}
							resize="vertical"
							placeholder="Enter Item Name"
						/>
					</GroupComponent>
				</StackComponent>
			</Fieldset>

			<SpaceComponent showHeight />

			<Fieldset legend={<TitleComponent title="Images" order={5} />}>
				<ScrollAreaComponent
					h={200}
					type="always"
					w="100%"
					scrollbars="x"
				>
					<GroupComponent gap={10} maw={12 * 170} w={12 * 170}>
						{[1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1].map(() => getImageRow())}
						<StackComponent
							// onClick={onChooseIconClick}
							className="cursor-pointer border border-dashed flex flex-col items-center justify-center rounded-md border-primary-darker text-primary-darker"
							h={180}
							w={160}
							justify="center"
							align="center"
						>
							<ImageIcon size={50} />
							<p className="text-center mt-0.5">Choose an Icon</p>
						</StackComponent>
					</GroupComponent>
				</ScrollAreaComponent>
			</Fieldset>

			<SpaceComponent showHeight />

			<Fieldset legend={<TitleComponent title="Other Arrtributes" order={5} />}>
				<SimpleGridComponent
					cols={{
						base: 1,
						sm: 2,
						md: 3,
						lg: 3,
						xl: 3,
					}}
				>
					<SelectComponent
						data={[]}
						setValue={() => {
						}}
						required
						label="Select category"
						placeholder="Select category"
						// data={categories}
						clearable={false}
						// value={categoryId}
						// setValue={setCategoryId}
						checkIconPosition="right"
						isGrouped={false}
					/>
					<SelectComponent
						data={[]}
						clearable={false}
						isGrouped={false}
						setValue={() => {
						}}
						checkIconPosition="right"
						label="Select sub-category"
						placeholder="Select sub-category"
					/>
					<SelectComponent
						required
						data={[]}
						label="Item type"
						clearable={false}
						isGrouped={false}
						placeholder="Item type"
						setValue={() => {
						}}
						checkIconPosition="right"
					/>
					<SelectComponent
						data={[]}
						label="Tags"
						clearable={false}
						isGrouped={false}
						placeholder="Tags"
						setValue={() => {
						}}
						checkIconPosition="right"
					/>
					<SelectComponent
						data={[]}
						label="Add-ons"
						clearable={false}
						isGrouped={false}
						placeholder="Add-ons"
						setValue={() => {
						}}
						checkIconPosition="right"
					/>
				</SimpleGridComponent>
			</Fieldset>

			<SpaceComponent showHeight />

			<Fieldset legend={<TitleComponent title="Custom Arrtribute" order={5} />}>
				<SimpleGridComponent
					cols={{
						base: 1,
						sm: 2,
						md: 3,
						lg: 3,
						xl: 3,
					}}
				>
					{[1, 2, 3, 1, 2].map(() => getCustomAttribute())}
				</SimpleGridComponent>
			</Fieldset>

			<SpaceComponent showHeight />

			<GroupComponent justify="end">
				<ButtonComponent
					w={100}
					title="Save"
					loading={loading}
					onClick={handleSubmitItem}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AddItemModal;
