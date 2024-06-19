import { CartItemModel, CartModel, ItemModel } from "@/models";
import { cartAtom, currencySign, logoutUser, upsertCartApi } from "@/utils";
import { useRecoilState } from "recoil";
import {
	ButtonComponent,
	CardComponent,
	CardSectionComponent,
	GroupComponent,
	ImageComponent,
	MantineProviderComponent,
	NumberInputComponent,
	SpoilerComponent,
	TextComponent,
} from "../mantine";
import { Minus, Plus } from "lucide-react";
import { centeredInputTheme } from "@/constants";
import { useRouter } from "next/navigation";

interface Props {
	cartItem: CartItemModel | undefined;
	item: ItemModel;
	isAddToCartApiBusy: boolean;
	toggleIsAddToCartApiBusy: (newState?: boolean) => void;
}

const ProductCard = (props: Props) => {
	const { cartItem, item, isAddToCartApiBusy, toggleIsAddToCartApiBusy } =
		props;

	const router = useRouter();
	const numberInputRef = useRef<NumberInputHandlers>(null);
	const [createCart, setCreateCart] = useState<boolean>(true);
	const [quantity, setQuantity] = useState<string | number>(0);
	const [itemIdToUpdate, setItemIdToUpdate] = useState<string | null>(null);
	console.log("createCart", createCart);
	const custId = useRecoilValue(customerAtom);
	const setCallCart = useSetRecoilState(callCartApiAtom);
	const [cart, setCart] = useRecoilState<CartModel | null>(cartAtom);

	const onAddClick = async () => {
		if (isAddToCartApiBusy) return;

		toggleIsAddToCartApiBusy(true);

		try {
			let prevCart: CartModel = cart;

			if (!prevCart) {
				const cartCreationResponse = await upsertCartApi(
					{},
					() => {},
					() => {},
					() => {
						logoutUser(router);
					},
				);

				if (
					cartCreationResponse &&
					typeof cartCreationResponse !== "string"
				) {
					setCart(cartCreationResponse);
					prevCart = cartCreationResponse;
				}
			}
		} catch (error) {
			toggleIsAddToCartApiBusy(false);
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
				// setAdd(false);
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
					text={`${item.name}`}
					bold
					className="text-justify"
				/>
			</GroupComponent>

			<SpoilerComponent maxHeight={45} showLabel="more" hideLabel="less">
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

						<MantineProviderComponent theme={centeredInputTheme}>
							<NumberInputComponent
								min={0}
								step={1}
								hideControls
								placeholder="0"
								setValue={(val: string | number) => {
									if (parseInt(val.toString(), 10) < 1) {
										// setAdd(false);
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
};
