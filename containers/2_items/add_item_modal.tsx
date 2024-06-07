"use client";

import React, { Dispatch, SetStateAction, useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Checkbox, Fieldset, Loader, Stack } from "@mantine/core";
import { Image as ImageIcon } from "lucide-react";
import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import {
	ActionIconComponent,
	ButtonComponent,
	FileInputComponent,
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
import {
	getAddOnApi,
	getAttributeApi,
	getCategoryApi,
	getItemTypeApi,
	getSubCategoryApi,
	getTagApi,
	logoutUser,
	upsertItemApi,
} from "@/utils";
import { NumberInputComponent } from "@/components/mantine/number_input_component";
import { TextAreaInputComponent } from "@/components/mantine/textarea_input_component";
import { StackComponent } from "@/components/mantine/stack_component";
import { MultiSelectComponent } from "@/components/mantine/multi_select_component";
import { CustomAttributeModel } from "@/models";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialItemName: string;
	itemId: string;
}

interface AttributeState {
	checked: boolean;
	value: string;
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
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [categories, setCategories] = useState([]);
	const [subCategoryList, setSubCategoryList] = useState([]);
	const [itemTypesList, setItemTypesList] = useState([]);
	const [tagsList, setTagsList] = useState([]);
	const [addOnsList, setAddOnsList] = useState([]);
	const [categoryId, setCategoryId] = useState<string>("");
	const [subCategoryId, setSubCategoryId] = useState<string>("");
	const [itemTypeId, setItemTypeId] = useState<string>("");
	const [tagsId, setTagsId] = useState<string[]>();
	const [addOnsId, setAddOnsId] = useState<string[]>();
	const [images, setImages] = useState<string[]>([]);
	const [customAttributesList, setCustomAttributesList] = useState<CustomAttributeModel[]>([]);
	const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
	const fileInputTriggerRef = useRef<HTMLButtonElement>(null);
	const [attributesState, setAttributesState] = useState<Record<string, AttributeState>>({});

	useEffect(() => {
		const initialState = customAttributesList.reduce((acc, attr) => {
			acc[attr.custom_attribute_id] = { checked: false, value: attr.default_value };
			return acc;
		}, {} as Record<string, AttributeState>);
		setAttributesState(initialState);
	}, [customAttributesList]);

	useEffect(() => {
		if (itemName) {
			setInputError(null);
		}
		getCategoryApi("",
			(data: any) => {
				const formattedCategories = data.categories.map(
					(category: {
						category_id: string;
						name: string;
					}) => ({
						value: category.category_id,
						label: category.name,
					}));
				setCategories(formattedCategories);
			},
			() => {
			},
			() => {
			});
		getItemTypeApi("",
			(data: any) => {
				const formattedItemType = data.item_types.map(
					(itemType: {
						item_type_id: string;
						name: string;
					}) => ({
						value: itemType.item_type_id,
						label: itemType.name,
					}));
				setItemTypesList(formattedItemType);
			},
			() => {
			},
			() => {
			}
		);
		getTagApi("",
			(data: any) => {
				const formattedTags = data.tags.map(
					(tag: {
						tag_id: string;
						name: string;
					}) => ({
						value: tag.tag_id,
						label: tag.name,
					}));
				setTagsList(formattedTags);
			},
			() => {
			},
			() => {
			}
		);
		getAddOnApi("",
			(data: any) => {
				const formattedAddOns = data.add_ons.map(
					(addOn: {
						add_on_id: string;
						name: string;
					}) => ({
						value: addOn.add_on_id,
						label: addOn.name,
					}));
				setAddOnsList(formattedAddOns);
			},
			() => {
			},
			() => {
			}
		);
		getAttributeApi("",
			(data: any) => {
				setCustomAttributesList(data.custom_attributes);
			},
			() => {
			},
			() => {
			}
		);
	}, [itemName]);

	useEffect(() => {
		if (categoryId) {
			setSearchLoading(true);
			getSubCategoryApi(`filter_type=category&filter_query=${categoryId}`,
				(data: any) => {
					const formattedCategories = data.sub_categories.map(
						(subCategory: {
							sub_category_id: string;
							name: string;
						}) => ({
							value: subCategory.sub_category_id,
							label: subCategory.name,
						}));
					setSubCategoryList(formattedCategories);
					setSearchLoading(false);
				},
				() => {
					setSearchLoading(false);
				},
				() => {
					setSearchLoading(false);
				}
			).then();
		}
	}, [categoryId]);

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

	const onChooseIconClick = () => {
		if (fileInputTriggerRef.current) {
			fileInputTriggerRef.current.click();
		}
	};

	const onFilePick = (files: File[] | File | null) => {
		if (Array.isArray(files)) {
			const newImages = files.map(file => URL.createObjectURL(file));
			if (replaceIndex !== null) {
				setImages(prevImages => {
					const updatedImages = [...prevImages];
					const [firstNewImage, ...restNewImages] = newImages;
					updatedImages[replaceIndex] = firstNewImage;
					return [...updatedImages, ...restNewImages];
				});
				setReplaceIndex(null);
			} else {
				setImages(prevImages => [...prevImages, ...newImages]);
			}
		} else if (files) {
			const newImage = URL.createObjectURL(files);
			if (replaceIndex !== null) {
				setImages(prevImages => {
					const updatedImages = [...prevImages];
					updatedImages[replaceIndex] = newImage;
					return updatedImages;
				});
				setReplaceIndex(null);
			} else {
				setImages(prevImages => [...prevImages, newImage]);
			}
		}
	};

	const handleRemoveImage = (index: number) => {
		setImages(prevImages => prevImages.filter((_, i) => i !== index));
	};

	const handleReplaceImage = (index: number) => {
		setReplaceIndex(index);
		if (fileInputTriggerRef.current) {
			fileInputTriggerRef.current.click();
		}
	};

	const handleCheckboxChange = (custom_attribute_id: string) => {
		setAttributesState(prevState => ({
			...prevState,
			[custom_attribute_id]: {
				...prevState[custom_attribute_id],
				checked: !prevState[custom_attribute_id]?.checked,
			},
		}));
	};

	const handleInputChange = (custom_attribute_id: string, value: string) => {
		setAttributesState(prevState => ({
			...prevState,
			[custom_attribute_id]: {
				...prevState[custom_attribute_id],
				value,
			},
		}));
	};

	const checkedAttributes = useMemo(() => Object.entries(attributesState)
			.filter(([, value]) => value.checked)
			.map(([key, value]) =>
				({ custom_attribute_id: key, value: value.value })), [attributesState]);

	useEffect(() => {
		console.log("Checked Attributes:", checkedAttributes);
	}, [checkedAttributes]);

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
							setValue={() => {}}
							placeholder="Enter Item Name"
						/>
						<NumberInputComponent
							required
							title="Price"
							label="Price"
							value={itemName}
							error={inputError}
							setValue={() => {}}
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
					w="100%"
					scrollbars="x"
				>
					<GroupComponent
						gap={10}
						maw={(images.length + 1) * 170}
						w={(images.length + 1) * 170}
					>
						<FileInputComponent
							required
							label="Please select category icon"
							placeholder="Category icon"
							className="hidden"
							onChange={onFilePick}
							ref={fileInputTriggerRef}
						/>
						{images.map((img, index) => (
							<Stack gap={10} h={180} mah={180} maw={160} w={160}>
								<ImageComponent
									src={img}
									fit="cover"
									w={160}
									h={140}
									mih={140}
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
										onClick={() => handleRemoveImage(index)}
									>
										<MdOutlineDeleteForever size={18} />
									</ActionIconComponent>

									<ActionIconComponent
										size="xs"
										h={30}
										w={30}
										ml={5}
										onClick={() => handleReplaceImage(index)}
									>
										<MdOutlineEdit size={18} />
									</ActionIconComponent>
								</GroupComponent>
							</Stack>
						))}
						<StackComponent
							onClick={onChooseIconClick}
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
						required
						data={categories}
						clearable={false}
						isGrouped={false}
						value={categoryId}
						label="Select category"
						setValue={setCategoryId}
						checkIconPosition="right"
						placeholder="Select category"
					/>
					<SelectComponent
						clearable={false}
						isGrouped={false}
						value={subCategoryId}
						data={subCategoryList}
						checkIconPosition="right"
						label="Select sub-category"
						setValue={setSubCategoryId}
						placeholder="Select sub-category"
						rightSection={
							searchLoading && <Loader size={20} />
						}
					/>
					<SelectComponent
						required
						label="Item type"
						clearable={false}
						isGrouped={false}
						value={itemTypeId}
						data={itemTypesList}
						placeholder="Item type"
						setValue={setItemTypeId}
						checkIconPosition="right"
					/>
					<MultiSelectComponent
						label="Tags"
						placeholder="Tags"
						data={tagsList}
						clearable={false}
						value={tagsId}
						setValue={setTagsId}
						checkIconPosition="right"
					/>
					<MultiSelectComponent
						label="Add-ons"
						placeholder="Add-ons"
						data={addOnsList}
						clearable={false}
						value={addOnsId}
						setValue={setAddOnsId}
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
					{customAttributesList.map((element, index) => (
						<GroupComponent align="start" key={index}>
							<Checkbox
								mt={7}
								checked={
								attributesState[element.custom_attribute_id]?.checked || false}
								onChange={() => handleCheckboxChange(element.custom_attribute_id)}
							/>
							<TextInputComponent
								className="flex-grow"
								title={element.name}
								label={element.name}
								value={attributesState[element.custom_attribute_id]?.value || ""}
								setValue={(value) =>
									handleInputChange(element.custom_attribute_id, value)}
								placeholder="Enter Item Name"
							/>
						</GroupComponent>
					))}
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
