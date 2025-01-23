"use client";

import { SearchIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { useDebouncedCallback } from "@mantine/hooks";
import { IoMdClose } from "react-icons/io";
import {
	BoxComponent,
	ChipComponent,
	ChipGroupComponent,
	GroupComponent, LoaderComponent,
	ScrollAreaComponent,
	SimpleGridComponent,
	SpaceComponent,
	TextComponent,
	TextInputComponent,
} from "@/components";
import { cartItemsAtom, getCategoryApi, getItemApi, getSubCategoryApi, logoutUser, toggleBooleanState } from "@/utils";
import { CartItemModel, CategoryModel, ItemModel } from "@/models";
import { ProductCard } from "./pos_product_card";

export interface Categories {
	categoryName: string;
}

export const PosProductSection = () => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [subCategories, setSubCategories] = useState([]);
	const [itemList, setItemList] = useState<ItemModel[]>([]);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [catValue, setCatValue] = useState<string | string[]>("");
	const [subCatValue, setSubCatValue] = useState<string | string[]>("");
	const [addSubCartItem, setAddSubCartItem] = useState<string | null>(null);
	const [categoriesList, setCategoriesList] = useState<CategoryModel[]>([]);
	const [cartItemIndexes, setCartItemIndexes] = useState<Map<string, number>>(
		new Map()
	);
	const [isAddToCartApiBusy, setIsAddToCartApiBusy] =
		useState<boolean>(false);
	const currentQueryRef = useRef(searchQuery);

	const cartItems = useRecoilValue<Array<CartItemModel>>(cartItemsAtom);

	useEffect(() => {
		if (searchQuery === "") {
			getCategoryApi(
				"",
				(data: any) => {
					setCategoriesList(data.categories);
				},
				() => {
				},
				() => {
					logoutUser(router);
				}
			).then();
		}
	}, [router, searchQuery]);

	const initState = async () => {
		getItemApi(
			"page_size=100",
			(data: any) => {
				setItemList(data.items);
			},
			() => {
			},
			() => {
				logoutUser(router);
			}
		);
	};

	useEffect(() => {
		const updatedCartItemIndexes = new Map<string, number>();

		cartItems.forEach((cartItem, index) => {
			updatedCartItemIndexes.set(cartItem.item_id, index);
		});

		setCartItemIndexes(updatedCartItemIndexes);
	}, [cartItems]);

	const fetchSubCategories = useCallback(
		(value: string) => {
			if (value !== "") {
				getSubCategoryApi(
					`filter_type=category&filter_query=${value}`,
					(data: any) => {
						setSubCategories(data.sub_categories);
					},
					() => {
					},
					() => {
						logoutUser(router);
					}
				).then();
			}
		},
		[router]
	);

	useEffect(() => {
		if (catValue) {
			catState().then();
		}
	}, [catValue]);

	useEffect(() => {
		if (subCatValue) {
			subCatState().then();
		}
	}, [subCatValue]);

	const catState = async () => {
		getItemApi(
			`filter_type=category&filter_query=${catValue}`,
			(data: any) => {
				setItemList(data.items);
			},
			() => {},
			() => {
				logoutUser(router);
			}
		).then();
	};

	const subCatState = async () => {
		getItemApi(
			`filter_type=sub_category&filter_query=${subCatValue}`,
			(data: any) => {
				setItemList(data.items);
			},
			() => {},
			() => {
				logoutUser(router);
			}
		).then();
	};

	const handleCategoryChange = (val: string | string[]) => {
		setCatValue(val as string);
		setSubCategories([]);
		fetchSubCategories(val as string);
	};

	useEffect(() => {
		currentQueryRef.current = searchQuery;
		if (searchQuery) {
			handleSearch(searchQuery);
		} else {
			setSearchLoading(false);
			initState().then();
		}
	}, [searchQuery]);

	const handleSearch = useDebouncedCallback(async (q: string) => {
		if (q === currentQueryRef.current) {
			setSearchLoading(true);
			getItemApi(
				`filter_type=name&filter_query=${q}`,
				(data: any) => {
					setItemList(data.items);
					setCategoriesList([]);
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
	}, 500);

	return (
		<div
			className="w-[70%] max-h-screen overflow-hidden"
			style={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<BoxComponent h={40} className="px-3 mt-1">
				<GroupComponent justify="space-between">
					<TextComponent text="Categories" bold size="xl" />
					<TextInputComponent
						w={400}
						value={searchQuery}
						setValue={setSearchQuery}
						placeholder="Search your product here"
						leftSection={<SearchIcon size={16} />}
						rightSection={
							searchLoading ?
								<LoaderComponent /> :
								searchQuery ?
									<IoMdClose
										size={20}
										onClick={() => setSearchQuery("")}
									/> :
									undefined
						}
					/>
				</GroupComponent>
			</BoxComponent>
			{/*<ScrollAreaComponent*/}
			{/*	h={160}*/}
			{/*	style={{ overflowX: "auto", overflowY: "hidden", whiteSpace: "nowrap" }}*/}
			{/*>*/}
			{/*	<BoxComponent className="px-3 mt-3" h={30}>*/}
			{/*		<ChipGroupComponent value={catValue} onChange={handleCategoryChange}>*/}
			{/*			<ChipComponent value="" style={{ display: "inline-block", marginRight: "8px" }}>*/}
			{/*				All items*/}
			{/*			</ChipComponent>*/}
			{/*			{categoriesList.map((item: any) => (*/}
			{/*				<ChipComponent*/}
			{/*					key={item.category_id}*/}
			{/*					value={item.category_id}*/}
			{/*					style={{ display: "inline-block", marginRight: "8px" }}*/}
			{/*				>*/}
			{/*					{item.name}*/}
			{/*				</ChipComponent>*/}
			{/*			))}*/}
			{/*		</ChipGroupComponent>*/}
			{/*	</BoxComponent>*/}
			{/*</ScrollAreaComponent>*/}
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
					<TextComponent text="Sub-categories" bold size="xl" />
					<SpaceComponent showHeight />
					<ChipGroupComponent
						value={subCatValue}
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
					flexGrow: 1,
					// height:
					// 	subCategories.length > 0
					// 		? "calc(100vh - 250px)"
					// 		: "calc(100vh - 173px)",
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
					{/* {itemList.map((item, index) => (
						// <ProductCard
						// 	key={item.item_id}
						// 	index={index + 1}
						// 	item={item}
						// 	cartItem={
						// 		cart.filter(
						// 			(c_item) => c_item.item_id === item.item_id,
						// 		)[0]
						// 	}
						// />
					))} */}
					{itemList.map((item) => (
						<ProductCard
							key={item.item_id}
							item={item}
							cartItem={
								cartItemIndexes.get(item.item_id) !== undefined
									? cartItems[
									cartItemIndexes.get(item.item_id) ?? 0
										]
									: undefined
							}
							isAddToCartApiBusy={isAddToCartApiBusy}
							toggleIsAddToCartApiBusy={toggleBooleanState(
								setIsAddToCartApiBusy
							)}
							addSubCartItem={addSubCartItem}
							setAddSubCartItem={setAddSubCartItem}
						/>
					))}
				</SimpleGridComponent>
			</ScrollAreaComponent>
		</div>
	);
};

export default PosProductSection;
