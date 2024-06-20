"use client";

import { SearchIcon } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import {
	BoxComponent,
	ChipComponent,
	ChipGroupComponent,
	GroupComponent,
	ScrollAreaComponent,
	SimpleGridComponent,
	SpaceComponent,
	TextComponent,
	TextInputComponent,
} from "@/components";
import {
	cartItemsAtom,
	getCategoryApi,
	getItemApi,
	getSubCategoryApi,
	logoutUser,
	toggleBooleanState,
} from "@/utils";
import { CartItemModel, CategoryModel, ItemModel } from "@/models";
import { ProductCard } from "./pos_product_card";

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
	const cartItems = useRecoilValue<Array<CartItemModel>>(cartItemsAtom);
	const [cartItemIndexes, setCartItemIndexes] = useState<Map<string, number>>(
		new Map(),
	);
	const [isAddToCartApiBusy, setIsAddToCartApiBusy] =
		useState<boolean>(false);

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

	useEffect(() => {
		const updatedCartItemIndexes = new Map<string, number>();
		console.log("cartItems", cartItems);

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
<<<<<<< HEAD
											cartItemIndexes.get(item.item_id) ?? 0
=======
									cartItemIndexes.get(item.item_id) ?? 0
>>>>>>> sanjay-dev
										]
									: undefined
							}
							isAddToCartApiBusy={isAddToCartApiBusy}
							toggleIsAddToCartApiBusy={toggleBooleanState(
								setIsAddToCartApiBusy,
							)}
						/>
					))}
				</SimpleGridComponent>
			</ScrollAreaComponent>
		</div>
	);
};

export default PosProductSection;
