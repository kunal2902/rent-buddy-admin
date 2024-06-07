"use client";

import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";
import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import {
	ActionIconComponent,
	ButtonComponent,
	CheckboxComponent,
	FieldsetComponent,
	FileInputComponent,
	GroupComponent,
	ImageComponent,
	LoaderComponent,
	ModalComponent,
	MultiSelectComponent,
	NumberInputComponent,
	ScrollAreaComponent,
	SelectComponent,
	SimpleGridComponent,
	SpaceComponent,
	StackComponent,
	TextAreaInputComponent,
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
import { CustomAttributeModel } from "@/models";

interface Props {
	itemId: string;
	isOpen: boolean;
	onClose: () => void;
	initialItemName: string;
	setCallApi: Dispatch<SetStateAction<boolean>>;
}

interface AttributeState {
	value: string;
	checked: boolean;
}

const AddItemModal = (props: Props) => {
	const {
		isOpen,
		itemId,
		onClose,
		setCallApi,
		initialItemName,
	} = props;
	const router = useRouter();
	const isEditModal: boolean = initialItemName !== "";
	const [tagsList, setTagsList] = useState([]);
	const [tagsId, setTagsId] = useState<string[]>();
	const [categories, setCategories] = useState([]);
	const [addOnsList, setAddOnsList] = useState([]);
	const [images, setImages] = useState<string[]>([]);
	const [addOnsId, setAddOnsId] = useState<string[]>();
	const fileInputTriggerRef = useRef<HTMLButtonElement>(null);
	const [itemName, setItemName] = useState<string>(initialItemName);
	const [itemTypesList, setItemTypesList] = useState([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [categoryId, setCategoryId] = useState<string>("");
	const [itemTypeId, setItemTypeId] = useState<string>("");
	const [subCategoryList, setSubCategoryList] = useState([]);
	const [subCategoryId, setSubCategoryId] = useState<string>("");
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [inputError, setInputError] = useState<string | null>(null);
	const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
	const [customAttributesList, setCustomAttributesList] = useState<CustomAttributeModel[]>([]);
	const [attributesState, setAttributesState] = useState<Record<string, AttributeState>>({});

	useEffect(() => {
		const initialState = customAttributesList.reduce((acc, attr) => {
			acc[attr.custom_attribute_id] = {
				checked: false,
				value: attr.default_value,
			};
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
				logoutUser(router);
			}
		).then();

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
				logoutUser(router);
			}
		).then();

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
				logoutUser(router);
			}
		).then();

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
				logoutUser(router);
			}
		).then();

		getAttributeApi("",
			(data: any) => {
				setCustomAttributesList(data.custom_attributes);
			},
			() => {
			},
			() => {
				logoutUser(router);
			}
		).then();
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
					logoutUser(router);
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
			({
				custom_attribute_id: key,
				value: value.value,
			})), [attributesState]);

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
			<FieldsetComponent legend={<TitleComponent title="Product Information" order={5} />}>
				<StackComponent>
					<SimpleGridComponent
						cols={{
							sm: 2,
							md: 3,
							lg: 3,
							xl: 3,
							base: 1,
						}}
					>
						<TextInputComponent
							required
							title="Name"
							value={itemName}
							label="Item Name"
							error={inputError}
							setValue={setItemName}
							placeholder="Enter Item Name"
						/>
						<TextInputComponent
							value={itemName}
							title="Internal Name"
							label="Internal Name"
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
							value={itemName}
							error={inputError}
							title="Stock Quantity"
							label="Stock Quantity"
							setValue={() => {
							}}
							placeholder="Enter Item Name"
						/>
						<NumberInputComponent
							required
							title="Price"
							label="Price"
							value={itemName}
							error={inputError}
							setValue={() => {
							}}
							placeholder="Enter Item Name"
						/>
					</SimpleGridComponent>
					<GroupComponent grow>
						<TextAreaInputComponent
							required
							value={itemName}
							resize="vertical"
							error={inputError}
							setValue={setItemName}
							title="Short Dscription"
							label="Short Dscription"
							placeholder="Enter Item Name"
						/>
						<TextAreaInputComponent
							value={itemName}
							resize="vertical"
							title="Dscription"
							label="Dscription"
							setValue={setItemName}
							placeholder="Enter Item Name"
						/>
					</GroupComponent>
				</StackComponent>
			</FieldsetComponent>

			<SpaceComponent showHeight />

			<FieldsetComponent legend={<TitleComponent title="Images" order={5} />}>
				<ScrollAreaComponent
					h={200}
					w="100%"
					scrollbars="x"
				>
					<GroupComponent
						gap={10}
						w={(images.length + 1) * 170}
						maw={(images.length + 1) * 170}
					>
						<FileInputComponent
							required
							className="hidden"
							onChange={onFilePick}
							ref={fileInputTriggerRef}
							placeholder="Category icon"
							label="Please select category icon"
						/>
						{images.map((img, index) => (
							<StackComponent gap={10} h={180} mah={180} maw={160} w={160}>
								<ImageComponent
									w={160}
									h={140}
									src={img}
									mih={140}
									fit="cover"
								/>
								<GroupComponent
									h={30}
									gap={0}
									mah={30}
									justify="center">

									<ActionIconComponent
										h={30}
										w={30}
										mr={5}
										size="xs"
										color="red"
										onClick={() => handleRemoveImage(index)}
									>
										<MdOutlineDeleteForever size={18} />
									</ActionIconComponent>

									<ActionIconComponent
										h={30}
										w={30}
										ml={5}
										size="xs"
										onClick={() => handleReplaceImage(index)}
									>
										<MdOutlineEdit size={18} />
									</ActionIconComponent>
								</GroupComponent>
							</StackComponent>
						))}
						<StackComponent
							h={180}
							w={160}
							align="center"
							justify="center"
							onClick={onChooseIconClick}
							className="cursor-pointer border border-dashed flex flex-col items-center justify-center rounded-md border-primary-darker text-primary-darker"
						>
							<ImageIcon size={50} />
							<p className="text-center mt-0.5">Choose an Icon</p>
						</StackComponent>
					</GroupComponent>
				</ScrollAreaComponent>
			</FieldsetComponent>

			<SpaceComponent showHeight />

			<FieldsetComponent legend={<TitleComponent title="Other Arrtributes" order={5} />}>
				<SimpleGridComponent
					cols={{
						sm: 2,
						md: 3,
						lg: 3,
						xl: 3,
						base: 1,
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
							searchLoading && <LoaderComponent size={20} />
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
						value={tagsId}
						data={tagsList}
						clearable={false}
						placeholder="Tags"
						setValue={setTagsId}
						checkIconPosition="right"
					/>
					<MultiSelectComponent
						label="Add-ons"
						value={addOnsId}
						data={addOnsList}
						clearable={false}
						placeholder="Add-ons"
						setValue={setAddOnsId}
						checkIconPosition="right"
					/>
				</SimpleGridComponent>
			</FieldsetComponent>

			<SpaceComponent showHeight />

			<FieldsetComponent legend={<TitleComponent title="Custom Arrtribute" order={5} />}>
				<SimpleGridComponent
					cols={{
						sm: 2,
						md: 3,
						lg: 3,
						xl: 3,
						base: 1,
					}}
				>
					{customAttributesList.map((element, index) => (
						<GroupComponent align="start" key={index}>
							<CheckboxComponent
								mt={7}
								checked={
									attributesState[element.custom_attribute_id]?.checked || false}
								onChecked={() => handleCheckboxChange(element.custom_attribute_id)}
							/>
							<TextInputComponent
								title={element.name}
								label={element.name}
								className="flex-grow"
								placeholder="Enter Item Name"
								setValue={(value) =>
									handleInputChange(element.custom_attribute_id, value)}
								value={attributesState[element.custom_attribute_id]?.value || ""}
							/>
						</GroupComponent>
					))}
				</SimpleGridComponent>
			</FieldsetComponent>

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
