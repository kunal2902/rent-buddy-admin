"use client";

import { Minus, Plus, SearchIcon } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { NumberInputHandlers } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import {
	BoxComponent,
	ButtonComponent,
	CardComponent,
	CardSectionComponent,
	ChipComponent,
	ChipGroupComponent,
	GroupComponent,
	ImageComponent,
	MantineProviderComponent,
	NumberInputComponent,
	ScrollAreaComponent,
	SimpleGridComponent,
	SpaceComponent,
	SpoilerComponent,
	TextComponent,
	TextInputComponent,
} from "@/components";
import {
	callCartApiAtom,
	cartAtom,
	cartIdAtom,
	currencySign,
	customerAtom,
	deleteCartApi,
	getCategoryApi,
	getItemApi,
	getSubCategoryApi,
	logoutUser,
	upsertCartApi,
} from "@/utils";
import { centeredInputTheme } from "@/constants";
import { CartItemModel, CategoryModel, ItemModel } from "@/models";

export interface Categories {
	categoryName: string;
}

export const PosProductSection = () => {
	const router = useRouter();
	const [catValue, setCatValue] = useState<string | string[]>("");
	const [catSubValue, setSubCatValue] = useState<string | string[]>("");
	const [subCategories, setSubCategories] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [categoriesList, setCategoriesList] = useState<CategoryModel[]>([]);
	const [itemList, setItemList] = useState<ItemModel[]>([]);
	const [cart, setCart] = useRecoilState<Array<CartItemModel>>(cartAtom);

	useEffect(() => {
		getCategoryApi(
			"",
			(data: any) => {
				setCategoriesList(data.categories);
			},
			() => {},
			() => {
				logoutUser(router);
			},
		).then();

		getItemApi(
			"page_size=100",
			(data: any) => {
				setItemList(data.items);
			},
			() => {},
			() => {
				logoutUser(router);
			},
		);
	}, [router]);

	const fetchSubCategories = useCallback(
		(value: string) => {
			if (value !== "") {
				getSubCategoryApi(
					`filter_type=category&filter_query=${value}`,
					(data: any) => {
						setSubCategories(data.sub_categories);
					},
					() => {},
					() => {
						logoutUser(router);
					},
				).then();
			}
		},
		[router],
	);

	const handleCategoryChange = (val: string | string[]) => {
		setCatValue(val as string);
		setSubCategories([]);
		fetchSubCategories(val as string);
	};

	return (
		<div className="w-[70%] max-h-screen overflow-hidden">
			<BoxComponent h={40} className="px-3 mt-1">
				<GroupComponent justify="space-between">
					<TextComponent text="Categories" bold size="xl" />
					<TextInputComponent
						w={400}
						value={searchQuery}
						setValue={setSearchQuery}
						placeholder="Search your product here"
						leftSection={<SearchIcon size={16} />}
					/>
				</GroupComponent>
			</BoxComponent>
			<BoxComponent h={30} className="px-3 mt-3">
				<ChipGroupComponent
					value={catValue}
					onChange={handleCategoryChange}
				>
					<GroupComponent justify="start">
						<ChipComponent value="">All items</ChipComponent>
						{categoriesList.map((item: any) => (
							<ChipComponent
								key={item.category_id}
								value={item.category_id}
							>
								{item.name}
							</ChipComponent>
						))}
					</GroupComponent>
				</ChipGroupComponent>
			</BoxComponent>

			{subCategories.length > 0 && (
				<BoxComponent h={70} className="px-3 mt-1">
					<TextComponent text="Categories" bold size="xl" />
					<SpaceComponent showHeight />
					<ChipGroupComponent
						value={catSubValue}
						onChange={(val) => setSubCatValue(val)}
					>
						<GroupComponent justify="start">
							<ChipComponent value="">All items</ChipComponent>
							{subCategories.map((item: any) => (
								<ChipComponent
									key={item.sub_category_id}
									value={item.sub_category_id}
								>
									{item.name}
								</ChipComponent>
							))}
						</GroupComponent>
					</ChipGroupComponent>
				</BoxComponent>
			)}
			<ScrollAreaComponent
				style={{
					display: "grid",
					height:
						subCategories.length > 0
							? "calc(100vh - 250px)"
							: "calc(100vh - 173px)",
				}}
				className="my-3"
			>
				<SimpleGridComponent
					className="mx-3"
					cols={{
						base: 1,
						sm: 2,
						md: 3,
						lg: 4,
						xl: 4,
					}}
				>
					{itemList.map((item, index) => (
						<ProductCard
							key={item.item_id}
							index={index + 1}
							item={item}
							cartItem={
								cart.filter(
									(c_item) => c_item.item_id === item.item_id,
								)[0]
							}
						/>
					))}
				</SimpleGridComponent>
			</ScrollAreaComponent>
		</div>
	);
};

const ProductCard = React.memo(
	({
		index,
		item,
		cartItem,
	}: {
		index: number;
		item: ItemModel;
		cartItem: CartItemModel | undefined;
	}) => {
		const router = useRouter();
		// const [add, setAdd] = useState<boolean>(false);
		const numberInputRef = useRef<NumberInputHandlers>(null);
		const [createCart, setCreateCart] = useState<boolean>(true);
		const [quantity, setQuantity] = useState<string | number>(0);
		const [itemIdToUpdate, setItemIdToUpdate] = useState<string | null>(
			null,
		);
		console.log("createCart", createCart);
		const custId = useRecoilValue(customerAtom);
		const setCallCart = useSetRecoilState(callCartApiAtom);
		const [cartId, setCartId] = useRecoilState(cartIdAtom);
		// const [cart, setCart] = useRecoilState<Array<CartItemModel>>(cartAtom);

		// const [cartItem, setCartItem] = useState<CartItemModel | null>(null);

		// useEffect(() => {
		// 	// cart.forEach((c_item) => {
		// 	// 	if (c_item.item_id === item.item_id) {
		// 	// 		setCartItem(c_item);
		// 	// 	}
		// 	// });
		//
		// 	let found = false;
		//
		// 	for (const c_item of cart) {
		// 		if (c_item.item_id === item.item_id) {
		// 			found = true;
		// 			setCartItem(c_item);
		// 		}
		// 	}
		//
		// 	if (!found)setCartItem(null);
		// }, [cart]);

		const handleAddItem = () => {
			if (createCart) {
				upsertCartApi(
					{},
					(response: any) => {
						setCartId(response.cart.cart_id);
						handleAddButtonClick(item.item_id);
					},
					(message) => {
						toast.error(message);
					},
					() => {
						logoutUser(router);
					},
				);
			}
		};

		const handleAddButtonClick = (id: string) => {
			setQuantity((prevQuantity: any) => {
				const newQuantity = prevQuantity === 0 ? 1 : prevQuantity + 1;
				setItemIdToUpdate(id);
				return newQuantity;
			});
		};

		const handleMinusButtonClick = (id: string) => {
			setQuantity((prevQuantity: any) => {
				const newQuantity = prevQuantity - 1;
				if (newQuantity < 1) {
					setAdd(false);
				}
				setItemIdToUpdate(id);
				return newQuantity;
			});
		};

		return (
			<CardComponent shadow="sm" padding="sm" radius="md" withBorder>
				<CardSectionComponent>
					<ImageComponent h={150} fit="fill" src={item.images[0]} />
				</CardSectionComponent>

				<GroupComponent justify="space-between" mt="md" mb="xs">
					<TextComponent
						text={`${item.name} ${index}`}
						bold
						className="text-justify"
					/>
				</GroupComponent>

				<SpoilerComponent
					maxHeight={45}
					showLabel="more"
					hideLabel="less"
				>
					<TextComponent
						size="sm"
						c="dimmed"
						className="text-justify"
						text={item.short_description}
					/>
				</SpoilerComponent>

				<GroupComponent justify="space-between" mt="md">
					<TextComponent
						bold
						size="xl"
						text={`${currencySign} ${item.price}`}
						c="green"
						className="text-justify"
					/>

					{!cartItem ? (
						<ButtonComponent w="50%" h={40} onClick={handleAddItem}>
							Add
						</ButtonComponent>
					) : (
						<div className="w-[50%] h-[40px] rounded-[20px] flex bg-gray-200 justify-between items-center">
							<ButtonComponent
								style={{
									height: "40px",
									width: "30%",
									fontSize: 30,
									alignContent: "center",
									backgroundColor: "bg-gr",
									justifyContent: "center",
									display: "flex",
									border: "1px solid gray",
									borderRadius: "8px 0 0 8px",
								}}
								px={5}
								onClick={() => {
									handleMinusButtonClick(item.item_id);
									numberInputRef.current?.decrement();
								}}
							>
								<Minus size={16} />
							</ButtonComponent>

							<MantineProviderComponent
								theme={centeredInputTheme}
							>
								<NumberInputComponent
									min={0}
									step={1}
									hideControls
									placeholder="0"
									setValue={(val: string | number) => {
										if (parseInt(val.toString(), 10) < 1) {
											setAdd(false);
										} else {
											setQuantity(val);
										}
									}}
									value={cartItem.quantity}
									variant="unstyled"
									handlersRef={numberInputRef}
									style={{
										width: "40%",
										height: "38px",
										border: "none",
										display: "flex",
										fontWeight: "bold",
										backgroundColor: "white",
									}}
								/>
							</MantineProviderComponent>

							<ButtonComponent
								style={{
									height: "40px",
									width: "30%",
									fontSize: 30,
									alignContent: "center",
									backgroundColor: "bg-gr",
									justifyContent: "center",
									display: "flex",
									border: "1px solid gray",
									borderRadius: "0 8px 8px 0",
								}}
								px={5}
								onClick={() => {
									handleAddButtonClick(item.item_id);
									numberInputRef.current?.increment();
								}}
							>
								<Plus size={16} />
							</ButtonComponent>
						</div>
					)}
				</GroupComponent>
			</CardComponent>
		);
	},
);

export default PosProductSection;
