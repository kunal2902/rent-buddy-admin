"use client";

import { Minus, Plus, SearchIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import {
	Card,
	Chip,
	createTheme,
	Input,
	MantineProvider,
	NumberInputHandlers,
} from "@mantine/core";
import Image from "next/image";
import {
	ButtonComponent,
	CardComponent,
	ChipComponent,
	GroupComponent, ImageComponent, ScrollAreaComponent,
	SimpleGridComponent,
	TextComponent,
	TextInputComponent,
} from "@/components";
import { currenySign } from "@/utils";
import { NumberInputComponent } from "@/components/mantine/number_input_component";

const theme = createTheme({
	components: {
		Input: Input.extend({
			// @ts-ignore
			vars: () => ({ input: { "--input-text-align": "center" } }),
		}),
	},
});

export interface Categories {
	categoryName: string;
}

export const PosProductSection = () => (
	<div className="w-full max-h-screen overflow-hidden">
		<GroupComponent justify="space-between" className="mx-3 mt-1">
			<TextComponent text="Categories" bold size="xl" />
			<TextInputComponent
				w={400}
				placeholder="Search your product here"
				leftSection={<SearchIcon size={16} />}
			/>
		</GroupComponent>
		<Chip.Group defaultValue="1">
			<GroupComponent justify="start" className="mx-3 mt-3">
				<ChipComponent value="1">All items</ChipComponent>
				<ChipComponent value="2">Pizza</ChipComponent>
				<ChipComponent value="3">Burger</ChipComponent>
				<ChipComponent value="4">Fries</ChipComponent>
				<ChipComponent value="5">Burger</ChipComponent>
				<ChipComponent value="6">Meals</ChipComponent>
				<ChipComponent value="7">Pasta</ChipComponent>
				<ChipComponent value="8">Non-veg</ChipComponent>
				<ChipComponent value="9">Burger</ChipComponent>
				<ChipComponent value="10">Meals</ChipComponent>
			</GroupComponent>
		</Chip.Group>
		<ScrollAreaComponent style={{ display: "grid", height: "80vh" }}>
			<SimpleGridComponent cols={4} className="m-3">
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

// @ts-ignore
const ProductCard = ({ index }) => {
	const [add, setAdd] = useState(false);
	const [quantity, setQuantity] = useState<string | number>(1);
	const numberInputRef = useRef<NumberInputHandlers>(null);
	return (
		<CardComponent shadow="sm" padding="md" radius="md" withBorder>
			<Card.Section>
				<ImageComponent
					w={150}
					h={100}
					src={`https://source.unsplash.com/random/150x100?food,eat,dinner&sig=${index}`}
				/>
			</Card.Section>

			<GroupComponent justify="space-between" mt="md" mb="xs">
				<TextComponent text={`Norway Fjord Adventures ${index}`} bold className="text-justify" />
			</GroupComponent>

			<TextComponent
				size="sm"
				c="dimmed"
				text="With Fjord Tours you can explore more of the magical fjord landscapes with tours." />

			<GroupComponent justify="space-between" mt="md">
				<TextComponent
					bold
					size="xl"
					text={`${currenySign} ${110 * parseInt(quantity.toString(), 10)}`}
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
								borderRadius: "20px 0 0 20px",
							}}
							px={5}
							onClick={() => numberInputRef.current?.decrement()}
						>
							<Minus size={16} />
						</ButtonComponent>

						<MantineProvider theme={theme}>
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
						</MantineProvider>

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
								borderRadius: "0 20px 20px 0",
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
