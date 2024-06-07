"use client";

import { Minus, Plus, SearchIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Box, Card, Chip, NumberInputHandlers, Spoiler } from "@mantine/core";
import { useRouter } from "next/navigation";
import {
	ButtonComponent,
	CardComponent,
	ChipComponent,
	GroupComponent,
	ImageComponent,
	MantineProviderComponent,
	ScrollAreaComponent,
	SimpleGridComponent,
	SpaceComponent,
	TextComponent,
	TextInputComponent,
} from "@/components";
import { currencySign, getCategoryApi, getSubCategoryApi, logoutUser } from "@/utils";
import { NumberInputComponent } from "@/components/mantine/number_input_component";
import { centeredInputTheme } from "@/constants";
import { CategoryModel } from "@/models";

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
	console.log(catValue);
	useEffect(() => {
		getCategoryApi("",
			(data: any) => {
				setCategoriesList(data.categories);
			},
			() => {
			},
			() => {
				logoutUser(router);
			}
		).then();
	}, []);

	const fetchSubCategories = (value: string) => {
		if (value !== "") {
			getSubCategoryApi(`filter_type=category&filter_query=${value}`,
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
	};

	function handleCategoryChange(val: string | string[]) {
			setCatValue(val as string);
			setSubCategories([]);
			fetchSubCategories(val as string);
	}

	return (
		<div className="w-[70%] max-h-screen overflow-hidden">
			<Box h={40} className="px-3 mt-1">
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
			</Box>
			<Box h={30} className="px-3 mt-3">
				<Chip.Group
					value={catValue}
					onChange={handleCategoryChange}>
					<GroupComponent justify="start">
						<ChipComponent value="">All items</ChipComponent>
						{categoriesList.map((item: any) => (
							<ChipComponent value={item.category_id}>{item.name}</ChipComponent>
						))}
					</GroupComponent>
				</Chip.Group>
			</Box>

			{subCategories.length > 0 && (
				<Box h={70} className="px-3 mt-1">
					<TextComponent text="Categories" bold size="xl" />
					<SpaceComponent showHeight />
					<Chip.Group value={catSubValue} onChange={(val) => setSubCatValue(val)}>
						<GroupComponent justify="start">
							<ChipComponent value="">All items</ChipComponent>
							{subCategories.map((item: any) => (
								<ChipComponent
									value={item.sub_category_id}
								>
									{item.name}
								</ChipComponent>
							))}
						</GroupComponent>
					</Chip.Group>
				</Box>
			)}
			<ScrollAreaComponent
				style={{
					display: "grid",
					height: subCategories.length > 0 ? "calc(100vh - 250px)" : "calc(100vh - 173px)",
				}}
				className="my-3">
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
					<ProductCard index={1} />
					<ProductCard index={2} />
					<ProductCard index={3} />
					<ProductCard index={4} />
					<ProductCard index={5} />
					<ProductCard index={6} />
					<ProductCard index={7} />
					<ProductCard index={8} />
					<ProductCard index={9} />
					<ProductCard index={10} />
					<ProductCard index={11} />
					<ProductCard index={12} />
					<ProductCard index={13} />
					<ProductCard index={14} />
					<ProductCard index={15} />
					<ProductCard index={16} />
					<ProductCard index={17} />
					<ProductCard index={18} />
					<ProductCard index={19} />
					<ProductCard index={21} />
					<ProductCard index={22} />
					<ProductCard index={23} />
				</SimpleGridComponent>
			</ScrollAreaComponent>
		</div>
	);
};

// @ts-ignore
const ProductCard = ({ index }) => {
	const [add, setAdd] = useState(false);
	const [quantity, setQuantity] = useState<string | number>(1);
	const numberInputRef = useRef<NumberInputHandlers>(null);
	return (
		<CardComponent shadow="sm" padding="sm" radius="md" withBorder>
			<Card.Section>
				<ImageComponent
					h={150}
					fit="fill"
					src={`https://source.unsplash.com/random/150x100?food,eat,dinner&sig=${index}`}
				/>
			</Card.Section>

			<GroupComponent justify="space-between" mt="md" mb="xs">
				<TextComponent text={`Product Name ${index}`} bold className="text-justify" />
			</GroupComponent>

			<Spoiler maxHeight={45} showLabel="more" hideLabel="less">
				<TextComponent
					size="sm"
					c="dimmed"
					className="text-justify"
					text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
			</Spoiler>

			<GroupComponent justify="space-between" mt="md">
				<TextComponent
					bold
					size="xl"
					text={`${currencySign} ${110 * parseInt(quantity.toString(), 10)}`}
					c="green"
					className="text-justify" />

				{!add ?
					<ButtonComponent
						w="50%"
						h={40}
						onClick={() => {
							setAdd(true);
						}}
					>
						Add
					</ButtonComponent>
					:
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
							onClick={() => numberInputRef.current?.decrement()}
						>
							<Minus size={16} />
						</ButtonComponent>

						<MantineProviderComponent theme={centeredInputTheme}>
							<NumberInputComponent
								min={0}
								step={1}
								hideControls
								placeholder="0"
								onChange={(val: string | number) => {
									if (parseInt(val.toString(), 10) < 1) {
										setAdd(false);
									} else {
										setQuantity(val);
									}
								}}
								value={quantity}
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
							onClick={() => numberInputRef.current?.increment()}
						>
							<Plus size={16} />
						</ButtonComponent>
					</div>
				}
			</GroupComponent>

		</CardComponent>
	);
};
