"use client";

import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";
import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import { MultiSelectProps } from "@mantine/core";
import {
	ActionIconComponent,
	AvatarComponent, BoxComponent,
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
	TextComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import {
	appAccentColorRGBA,
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
	isOpen: boolean;
	onClose: () => void;
	initialItemValue: InitialItemValue;
	setCallApi: Dispatch<SetStateAction<boolean>>;
}

interface AttributeState {
	value: string;
	checked: boolean;
}

interface AddOn {
	icon: string;
	price: string;
	label: string;
}

interface AddOnData {
	[key: string]: AddOn;
}

interface InitialItemValue {
	item_id: string;
	category_id: string;
	sub_category_id: string;
	add_ons: string[];
	name: string;
	internal_name: string;
	description: string;
	short_description: string;
	sku: string;
	images: string[];
	item_tags: ItemTag[];
	custom_attributes: ItemCustomAttribute[];
	icon: string | null;
	price: string;
	stock_quantity: number;
	created_by_id: string;
	created_at: string;
	is_deleted: boolean;
	is_disabled: boolean;
	item_type_id: string;
	created_by: {
		name: string;
	};
	category: {
		name: string;
	};
	sub_category: {
		name: string;
	};
	type: {
		name: string;
	};
}

interface Tag {
	tag_id: string;
	name: string;
}

interface ItemTag {
	item_tag_id: string;
	item_id: string;
	tag_id: string;
	created_by_id: string;
	created_at: string;
	is_deleted: boolean;
	is_disabled: boolean;
	tag: Tag;
}

interface CustomAttribute {
	custom_attribute_id: string;
	name: string;
	type: string;
	created_by_id: string;
	created_at: string;
	is_deleted: boolean;
	is_disabled: boolean;
	default_value: string;
	is_tax: boolean;
	tax_type: string;
}

interface ItemCustomAttribute {
	item_custom_attribute_id: string;
	item_id: string;
	custom_attribute_id: string;
	attribute_value: string;
	created_by_id: string;
	created_at: string;
	is_deleted: boolean;
	is_disabled: boolean;
	custom_attribute: CustomAttribute;
}

const AddItemModal = (props: Props) => {
	const { isOpen, onClose, setCallApi, initialItemValue } = props;
	const router = useRouter();
	const isEditModal: boolean = initialItemValue.name !== "";
	const [sku, setSku] = useState<string>(initialItemValue.sku);
	const [tagsList, setTagsList] = useState([]);
	const [categories, setCategories] = useState([]);
	const [addOnsList, setAddOnsList] = useState([]);
	const [tagsId, setTagsId] = useState<string[]>(
		initialItemValue?.item_tags?.map(tagItem => tagItem?.tag?.tag_id)
	);
	const [longDesc, setLongDesc] = useState<string>(initialItemValue.description);
	const [addOnsId, setAddOnsId] = useState<string[]>(initialItemValue.add_ons);
	const fileInputTriggerRef = useRef<HTMLButtonElement>(null);
	const [shortDesc, setShortDesc] = useState<string>(initialItemValue.short_description);
	const [itemName, setItemName] = useState<string>(initialItemValue.name);
	const [itemTypesList, setItemTypesList] = useState([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [categoryId, setCategoryId] = useState<string>(initialItemValue.category_id);
	const [itemTypeId, setItemTypeId] = useState<string>(initialItemValue.item_type_id);
	const [subCategoryList, setSubCategoryList] = useState([]);
	const [addOnData, setAddOnData] = useState<AddOnData>({});
	const [subCategoryId, setSubCategoryId] = useState<string>(initialItemValue.sub_category_id);
	const [price, setPrice] = useState<string | number>(initialItemValue.price);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [itemInternalName, setItemInternalName] =
		useState<string>(initialItemValue.internal_name);
	const [inputError, setInputError] = useState<string | null>(null);
	const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
	const [stockQuantity, setStockQuantity]
		= useState<string | number>(initialItemValue.stock_quantity);
	const [images, setImages] = useState<{ file: File | null; previewURL: string }[]>(
		initialItemValue.images ? initialItemValue.images.map(imageURL =>
			({ file: null, previewURL: imageURL })) : []
	);
	const [customAttributesList, setCustomAttributesList] =
		useState<CustomAttribute[]>([]);
	const [attributesState, setAttributesState] = useState<
		Record<string, AttributeState>
	>({});
	const hasInitializedCustomAttributes = useRef(false);
	const [removedImages, setRemovedImages] = useState<string[]>([]);

	const initializeCustomAttributes = (list: any, initialValue: any) =>
		list.map((att2: { custom_attribute_id: any; default_value: any; }) => {
		const match = initialValue.custom_attributes?.find((att: { custom_attribute_id: any; }) =>
			att.custom_attribute_id === att2.custom_attribute_id
		);
		if (match && att2.default_value !== match.attribute_value) {
			return {
				...att2,
				default_value: match.attribute_value,
			};
		}
		return att2;
	});

	useEffect(() => {
		if (isEditModal && customAttributesList.length > 0 &&
			!hasInitializedCustomAttributes.current) {
			const new_arr = initializeCustomAttributes(customAttributesList, initialItemValue);
			setCustomAttributesList(new_arr);
			hasInitializedCustomAttributes.current = true;
		}
	}, [isEditModal, initialItemValue.custom_attributes, customAttributesList]);

	useEffect(() => {
		const initialState = customAttributesList.reduce((acc, attr2) => {
			const match = initialItemValue.custom_attributes.find(attr =>
				attr.custom_attribute_id === attr2.custom_attribute_id);
			acc[attr2.custom_attribute_id] = {
				checked: !!match,
				value: attr2.default_value,
			};
			return acc;
		}, {} as Record<string, { checked: boolean; value: string }>);
		setAttributesState(initialState);
	}, [customAttributesList]);

	useEffect(() => {
		if (itemName) {
			setInputError(null);
		}
		getCategoryApi(
			"",
			(data: any) => {
				const formattedCategories = data.categories.map(
					(category: { category_id: string; name: string }) => ({
						value: category.category_id,
						label: category.name,
					}),
				);
				setCategories(formattedCategories);
			},
			() => {},
			() => {
				logoutUser(router);
			},
		).then();

		getItemTypeApi(
			"",
			(data: any) => {
				const formattedItemType = data.item_types.map(
					(itemType: { item_type_id: string; name: string }) => ({
						value: itemType.item_type_id,
						label: itemType.name,
					}),
				);
				setItemTypesList(formattedItemType);
			},
			() => {},
			() => {
				logoutUser(router);
			},
		).then();

		getTagApi(
			"",
			(data: any) => {
				const formattedTags = data.tags.map(
					(tag: { tag_id: string; name: string }) => ({
						value: tag.tag_id,
						label: tag.name,
					}),
				);
				setTagsList(formattedTags);
			},
			() => {},
			() => {
				logoutUser(router);
			},
		).then();

		getAddOnApi(
			"",
			(data: any) => {
				const formattedAddOns = data.add_ons.map(
					(addOn: {
						icon: string;
						price: string;
						add_on_id: string;
						name: string;
					}) => ({
						value: addOn.add_on_id.toString(),
						label: addOn.name.toString(),
						icon: addOn.icon,
						price: addOn.price,
					}),
				);
				setAddOnsList(formattedAddOns);

				const tempAddOnData: AddOnData = {};
				data.add_ons.forEach(
					(addOn: {
						add_on_id: string;
						name: string;
						icon: string;
						price: string;
					}) => {
						tempAddOnData[addOn.add_on_id] = {
							icon: addOn.icon,
							price: addOn.price,
							label: addOn.name,
						};
					},
				);
				setAddOnData(tempAddOnData);
			},
			() => {},
			() => {
				logoutUser(router);
			},
		).then();

		getAttributeApi(
			"",
			(data: any) => {
				setCustomAttributesList(data.custom_attributes);
			},
			() => {},
			() => {
				logoutUser(router);
			},
		).then();
	}, [itemName]);

	useEffect(() => {
		if (categoryId) {
			setSearchLoading(true);
			getSubCategoryApi(
				`filter_type=category&filter_query=${categoryId}`,
				(data: any) => {
					const formattedCategories = data.sub_categories.map(
						(subCategory: {
							sub_category_id: string;
							name: string;
						}) => ({
							value: subCategory.sub_category_id,
							label: subCategory.name,
						}),
					);
					setSubCategoryList(formattedCategories);
					setSearchLoading(false);
				},
				() => {
					setSearchLoading(false);
				},
				() => {
					logoutUser(router);
					setSearchLoading(false);
				},
			).then();
		}
	}, [categoryId]);

	const handleSubmitItem = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!itemName) {
			setInputError("Please enter the name first");
		}
		setLoading(true);
		const itemBody = new FormData();
		itemBody.append("sku", sku);
		itemBody.append("id", initialItemValue.item_id || "");
		itemBody.append("name", itemName);
		itemBody.append("price", String(price));
		if (longDesc.trim()) itemBody.append("description", longDesc);
		itemBody.append("short_description", shortDesc);
		if (subCategoryId.trim()) itemBody.append("sub_category_id", subCategoryId);
		itemBody.append("category_id", categoryId);
		itemBody.append("item_type_id", itemTypeId);
		itemBody.append("tags", JSON.stringify(tagsId));
		if (itemInternalName.trim()) itemBody.append("internal_name", itemInternalName);
		itemBody.append("add_ons", JSON.stringify(addOnsId));
		itemBody.append("stock_quantity", String(stockQuantity));
		itemBody.append("attributes", JSON.stringify(checkedAttributes));
		images.forEach((image) => {
			if (image.file instanceof File) {
				itemBody.append("image_files_added", image.file);
			} else if (image.file === null && image.previewURL) {
				itemBody.append("image_files_added", image.previewURL);
			}
		});
		if (isEditModal) {
			if (removedImages.length > 0) {
				itemBody.append("images_deleted", JSON.stringify(removedImages));
			}
		}

		try {
			await upsertItemApi(
				itemBody,
				() => {
					onClose();
					setCallApi((val) => !val);
					setLoading(false);
				},
				(message: string) => {
					console.log(message);
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

	const onChooseIconClick = () => {
		if (fileInputTriggerRef.current) {
			fileInputTriggerRef.current.click();
		}
	};

	const createPreviewURL = (file: File): string => URL.createObjectURL(file);

	const onFilePick = (files: File[] | File | null) => {
		if (files) {
			const fileArray = Array.isArray(files) ? files : [files];

			const newImages = fileArray.map((file) => {
				const previewURL = createPreviewURL(file);
				return { file, previewURL };
			});

			if (replaceIndex !== null) {
				setImages((prevImages) => {
					const updatedImages = [...prevImages];
					const [firstNewImage, ...restNewImages] = newImages;
					updatedImages[replaceIndex] = firstNewImage;
					return [...updatedImages, ...restNewImages];
				});
				setReplaceIndex(null);
			} else {
				setImages((prevImages) => [...prevImages, ...newImages]);
			}
		}
	};

	const handleRemoveImage = (index: number, url: string) => {
		setImages((prevImages) => prevImages.filter((_, i) => i !== index));
		if (url && !url.startsWith("blob:")) {
			setRemovedImages((prevRemovedImages) => [...prevRemovedImages, url]);
		}
	};

	const handleReplaceImage = (index: number) => {
		setReplaceIndex(index);
		if (fileInputTriggerRef.current) {
			fileInputTriggerRef.current.click();
		}
	};

	const handleCheckboxChange = (custom_attribute_id: string) => {
		setAttributesState((prevState) => ({
			...prevState,
			[custom_attribute_id]: {
				...prevState[custom_attribute_id],
				checked: !prevState[custom_attribute_id]?.checked,
			},
		}));
	};

	const handleInputChange = (custom_attribute_id: string, value: string) => {
		setAttributesState((prevState) => ({
			...prevState,
			[custom_attribute_id]: {
				...prevState[custom_attribute_id],
				value,
			},
		}));
	};

	const checkedAttributes = useMemo(
		() =>
			Object.entries(attributesState)
				.filter(([, value]) => value.checked)
				.map(([key, value]) => ({
					attribute_id: key,
					value: value.value,
				})),
		[attributesState],
	);

	const renderMultiSelectOption: MultiSelectProps["renderOption"] = ({
		option,
	}) => (
		<GroupComponent gap="sm">
			<AvatarComponent
				src={addOnData[option.value]?.icon}
				size={36}
				radius="xl"
			/>
			<div>
				<TextComponent text={addOnData[option.value].label} />
				<TextComponent
					opacity={0.5}
					text={addOnData[option.value]?.price}
				/>
			</div>
		</GroupComponent>
	);

	return (
		<ModalComponent
			fullScreen
			opened={isOpen}
			onClose={onClose}
			title={
				<TitleComponent
					title={isEditModal ? "Edit Item" : "Add New Item"}
					// title="add"
				/>
			}
		>
			<FieldsetComponent
				legend={
					<TitleComponent title="Product Information" order={5} />
				}
			>
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
							value={itemInternalName}
							title="Internal Name"
							label="Internal Name"
							setValue={setItemInternalName}
							placeholder="Enter Internal Name"
						/>
						<TextInputComponent
							required
							title="SKU"
							label="SKU"
							value={sku}
							error={inputError}
							setValue={setSku}
							placeholder="Enter SKU"
						/>
						<NumberInputComponent
							required
							error={inputError}
							value={stockQuantity}
							title="Stock Quantity"
							label="Stock Quantity"
							setValue={setStockQuantity}
							placeholder="Enter Stock Quantity"
						/>
						<NumberInputComponent
							required
							title="Price"
							label="Price"
							value={price}
							error={inputError}
							setValue={setPrice}
							placeholder="Enter Price"
						/>
					</SimpleGridComponent>
					<GroupComponent grow>
						<TextAreaInputComponent
							required
							value={shortDesc}
							resize="vertical"
							error={inputError}
							setValue={setShortDesc}
							title="Short Description"
							label="Short Description"
							placeholder="Enter Short Description"
						/>
						<TextAreaInputComponent
							value={longDesc}
							resize="vertical"
							title="Description"
							label="Description"
							setValue={setLongDesc}
							placeholder="Enter Description"
						/>
					</GroupComponent>
				</StackComponent>
			</FieldsetComponent>

			<SpaceComponent showHeight />

			<FieldsetComponent
				legend={<TitleComponent title="Images" order={5} />}
			>
				<ScrollAreaComponent h={200} w="100%" scrollbars="x">
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
							<StackComponent
								gap={10}
								h={180}
								mah={180}
								maw={160}
								w={160}
							>
								<ImageComponent
									w={160}
									h={140}
									src={img.previewURL ? img.previewURL : img}
									mih={140}
									fit="cover"
								/>
								<GroupComponent
									h={30}
									gap={0}
									mah={30}
									justify="center"
								>
									<ActionIconComponent
										h={30}
										w={30}
										mr={5}
										size="xs"
										color="red"
										onClick={() => handleRemoveImage(index, img.previewURL ? img.previewURL : "")}
									>
										<MdOutlineDeleteForever size={18} />
									</ActionIconComponent>

									<ActionIconComponent
										h={30}
										w={30}
										ml={5}
										size="xs"
										onClick={() =>
											handleReplaceImage(index)
										}
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

			<FieldsetComponent
				legend={<TitleComponent title="Other Arrtributes" order={5} />}
			>
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
						value={categoryId}
						label="Select category"
						setValue={setCategoryId}
						checkIconPosition="right"
						placeholder="Select category"
					/>
					{subCategoryList.length > 0 && (
						<SelectComponent
							clearable={false}
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
					)}
					<SelectComponent
						required
						label="Item type"
						clearable={false}
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
						renderOption={renderMultiSelectOption}
					/>
				</SimpleGridComponent>
			</FieldsetComponent>

			<SpaceComponent showHeight />

			<FieldsetComponent
				legend={<TitleComponent title="Custom Arrtribute" order={5} />}
			>
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
									attributesState[element.custom_attribute_id]?.checked || false
								}
								onChecked={() =>
									handleCheckboxChange(
										element.custom_attribute_id,
									)
								}
							/>
							<TextInputComponent
								title={element.name}
								label={element.name}
								className="flex-grow"
								placeholder="Enter Item Name"
								setValue={(value) =>
									handleInputChange(
										element.custom_attribute_id,
										value,
									)
								}
								value={
									attributesState[element.custom_attribute_id]
										?.value || ""
								}
							/>
						</GroupComponent>
					))}
				</SimpleGridComponent>
			</FieldsetComponent>

			<SpaceComponent showHeight />

			<BoxComponent h={60} className="mt-3">
				<GroupComponent justify="end">
					<ButtonComponent
						title="Close"
						variant="subtle"
						color={appAccentColorRGBA}
						onClick={onClose}
						/>
					<ButtonComponent
						w={100}
						title="Save"
						loading={loading}
						onClick={handleSubmitItem}
						/>
				</GroupComponent>
			</BoxComponent>
		</ModalComponent>
	);
};

export default AddItemModal;
