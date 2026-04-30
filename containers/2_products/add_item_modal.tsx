"use client";

import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdOutlineDeleteForever, MdOutlineEdit, MdOutlineImage } from "react-icons/md";
import { Text, Tooltip } from "@mantine/core";
import {
	ActionIconComponent,
	// eslint-disable-next-line no-mixed-spaces-and-tabs
	BoxComponent,
	ButtonComponent,
	GroupComponent, MainComponent,
	ModalComponent,
	NumberInputComponent, PaperComponent,
	SelectComponent,
	StackComponent,
	TextInputComponent,
} from "@/components";
import {
	getCategoryApi,
	logoutUser,
	upsertProductApi,
} from "@/utils";
import ShowNotification from "@/components/mantine/show_notification";

export interface InitialProductValue {
	product_id: string;
	sku: string;
	name: string;
	size: string;
	color: string;
	category_id: string;
	price: string | number;
	quantity: string | number;
	status: string;
	images: string[];
	category: { name: string };
}

interface ProductModalProps {
	onClose: () => void;
	initialProductValue: InitialProductValue;
	setCallApi: Dispatch<SetStateAction<boolean>>;
}

export const initialProductValue: InitialProductValue = {
	product_id: "",
	sku: "",
	name: "",
	size: "",
	color: "",
	category_id: "",
	price: "",
	quantity: "",
	status: "",
	images: [],
	category: { name: "" },
};

const STATUS_OPTIONS = [
	{ value: "available", label: "Available" },
	{ value: "out_of_stock", label: "Out of Stock" },
	{ value: "discontinued", label: "Discontinued" },
];

const MAX_IMAGES = 4;

export const AddProductModal = (props: ProductModalProps) => {
	// eslint-disable-next-line @typescript-eslint/no-shadow
	const { onClose, setCallApi, initialProductValue } = props;
	const router = useRouter();

	const isEdit = !!initialProductValue.product_id;
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);

	const [sku, setSku] = useState(initialProductValue.sku);
	const [name, setName] = useState(initialProductValue.name);
	const [size, setSize] = useState(initialProductValue.size);
	const [color, setColor] = useState(initialProductValue.color);
	const [categoryId, setCategoryId] = useState(initialProductValue.category_id);
	const [price, setPrice] = useState<string | number>(initialProductValue.price);
	const [quantity, setQuantity] = useState<string | number>(initialProductValue.quantity);
	const [status, setStatus] = useState(initialProductValue.status);
	const [removedImages, setRemovedImages] = useState<string[]>([]);
	const [images, setImages] = useState<{ file: File | null; previewURL: string }[]>(
		initialProductValue.images?.map(url => ({ file: null, previewURL: url })) ?? []
	);

	const [nameError, setNameError] = useState<string | null>(null);

	useEffect(() => {
		getCategoryApi(
			"",
			(data: any) => {
				setCategories(
					data.categories.map((c: { category_id: string; name: string }) => ({
						value: c.category_id,
						label: c.name,
					}))
				);
			},
			() => {},
			() => logoutUser(router)
		);
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);
		if (!files.length) return;
		const newImages = files.map(f => ({ file: f, previewURL: URL.createObjectURL(f) }));
		if (replaceIndex !== null) {
			setImages(prev => {
				const updated = [...prev];
				// eslint-disable-next-line prefer-destructuring
				updated[replaceIndex] = newImages[0];
				return [...updated, ...newImages.slice(1)];
			});
			setReplaceIndex(null);
		} else {
			setImages(prev => [...prev, ...newImages].slice(0, MAX_IMAGES));
		}
		e.target.value = "";
	};

	const handleRemoveImage = (index: number, url: string) => {
		setImages(prev => prev.filter((_, i) => i !== index));
		if (url && !url.startsWith("blob:")) {
			setRemovedImages(prev => [...prev, url]);
		}
	};

	const handleReplaceImage = (index: number) => {
		setReplaceIndex(index);
		fileInputRef.current?.click();
	};

	const handleDiscard = () => {
		setSku(initialProductValue.sku);
		setName(initialProductValue.name);
		setSize(initialProductValue.size);
		setColor(initialProductValue.color);
		setCategoryId(initialProductValue.category_id);
		setPrice(initialProductValue.price);
		setQuantity(initialProductValue.quantity);
		setStatus(initialProductValue.status);
		setImages(initialProductValue.images?.map(url => ({ file: null, previewURL: url })) ?? []);
		setRemovedImages([]);
		setNameError(null);
	};

	const handleSubmit = async () => {
		if (!name.trim()) { setNameError("Product name is required"); return; }
		setNameError(null);
		setLoading(true);

		const body = new FormData();
		body.append("id", initialProductValue.product_id ?? "");
		body.append("sku", sku);
		body.append("name", name);
		body.append("size", String(size));
		body.append("color", color);
		body.append("category_id", categoryId);
		body.append("price", String(price));
		body.append("quantity", String(quantity));
		body.append("status", status);
		images.forEach(img => {
			if (img.file instanceof File) body.append("image_files_added", img.file);
			else if (img.previewURL) body.append("image_files_added", img.previewURL);
		});
		if (isEdit && removedImages.length > 0) {
			body.append("images_deleted", JSON.stringify(removedImages));
		}

		try {
			await upsertProductApi(
				body,
				() => { onClose(); setCallApi(v => !v); ShowNotification("Success", "success"); setLoading(false); },
				(msg: any) => { ShowNotification(msg.error ?? msg, "error"); setLoading(false); },
				() => { logoutUser(router); }
			);
		} catch { setLoading(false); }
	};

	// ── Photo slot renderer ──────────────────────────────────────
	const renderPhotoSlots = () => {
		const slots = Array.from({ length: MAX_IMAGES });
		return slots.map((_, i) => {
			const img = images[i];
			return (
				<BoxComponent
					key={i}
					style={{
						width: "calc(50% - 6px)",
						aspectRatio: "1",
						borderRadius: 10,
						border: "1.5px dashed #d1d5db",
						backgroundColor: img ? "#f9fafb" : "#f3f4f6",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
						overflow: "hidden",
						cursor: img ? "default" : "pointer",
					}}
					onClick={!img ? () => fileInputRef.current?.click() : undefined}
				>
					{img ? (
						<>
							{/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
							<img
								src={img.previewURL}
								alt={`Photo ${i + 1}`}
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
							/>
							{/* Overlay controls */}
							<div
								style={{
									position: "absolute",
inset: 0,
									backgroundColor: "rgba(0,0,0,0.35)",
									display: "flex",
alignItems: "center",
									justifyContent: "center",
gap: 8,
									opacity: 0,
transition: "opacity 0.2s",
								}}
								className="image-overlay"
								// eslint-disable-next-line no-return-assign
								onMouseEnter={e => e.currentTarget.style.opacity = "1"}
								// eslint-disable-next-line no-return-assign
								onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
							>
								<ActionIconComponent
									size="sm"
									color="white"
									variant="transparent"
									onClick={() => handleReplaceImage(i)}
								>
									<MdOutlineEdit size={16} />
								</ActionIconComponent>
								<ActionIconComponent
									size="sm"
									color="red"
									variant="transparent"
									onClick={() => handleRemoveImage(i, img.previewURL)}
								>
									<MdOutlineDeleteForever size={16} />
								</ActionIconComponent>
							</div>
						</>
					) : (
						<BoxComponent style={{ textAlign: "center", color: "#9ca3af" }}>
							<MdOutlineImage size={28} />
							<Text size="xs" mt={4}>Photo {i + 1}</Text>
						</BoxComponent>
					)}
				</BoxComponent>
			);
		});
	};

	// ── Product Information form fields ─────────────────────────
	const formFields = (
		<StackComponent gap={12}>
			<TextInputComponent
				label="SKU"
				value={sku}
				setValue={setSku}
				placeholder="Input no SKU"
				title="SKU"
			/>
			<TextInputComponent
				required
				label="Product Name"
				value={name}
				setValue={setName}
				placeholder="Input product name"
				title="Product Name"
				error={nameError}
			/>
			<GroupComponent grow gap={12}>
				<TextInputComponent
					label="Size"
					value={size}
					setValue={setSize}
					placeholder="Input Price"
					title="Size"
				/>
				<TextInputComponent
					label="Color"
					value={color}
					setValue={setColor}
					placeholder="Color"
					title="Color"
				/>
			</GroupComponent>
			<SelectComponent
				required
				label="Product Category"
				data={categories}
				value={categoryId}
				setValue={setCategoryId}
				placeholder="Select product category"
				clearable={false}
				checkIconPosition="right"
			/>
			<NumberInputComponent
				label="Price"
				value={price}
				setValue={setPrice}
				placeholder="Input Price"
				title="Price"
				min={0}
			/>
			<NumberInputComponent
				label="Quantity"
				value={quantity}
				setValue={setQuantity}
				placeholder="Input stock"
				title="Quantity"
				min={0}
			/>
			<SelectComponent
				label="Status Product"
				data={STATUS_OPTIONS}
				value={status}
				setValue={setStatus}
				placeholder="Select status product"
				clearable={false}
				checkIconPosition="right"
			/>
		</StackComponent>
	);

	// ── Image section ───────────────────────────────────────────
	const imageSection = (
		<BoxComponent>
			<Text size="xs" c="dimmed" mb={10}>
				<Text component="span" c="orange" fw={600}>Note: </Text>
				Format photos SVG, PNG, or JPG (Max size 4mb)
			</Text>
			<GroupComponent gap={12} wrap="wrap">
				{renderPhotoSlots()}
			</GroupComponent>
		</BoxComponent>
	);

	return (
		<>
			{/* Breadcrumb */}
			<BoxComponent mb={20} className="pt-4 pl-5">
				<GroupComponent align="flex-start">
					<Tooltip label="Back to Products" position="left">
						<ActionIconComponent
							size="lg"
							variant="subtle"
							onClick={onClose}
						>
							<MdArrowBack size={20} />
						</ActionIconComponent>
					</Tooltip>
					<BoxComponent>
						<Text fw={700} size="xl">Product</Text>
						<Text size="xs" c="dimmed">
							Dashboard &rsaquo; Product &rsaquo; Sneakers &rsaquo;{" "}
							<Text component="span" c="blue" fw={600}>
								{isEdit ? "Edit Product" : "Add Product"}
							</Text>
						</Text>
					</BoxComponent>
				</GroupComponent>
			</BoxComponent>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/svg+xml,image/png,image/jpeg"
				multiple
				style={{ display: "none" }}
				onChange={handleFileChange}
			/>

			{/* ── Desktop layout ── */}
			<BoxComponent visibleFrom="sm" className="px-6">
				<GroupComponent align="flex-start" gap={20} wrap="nowrap">
					{/* Left: Product Information */}
					<PaperComponent
						style={{ flex: 1, borderRadius: 12, padding: 24 }}
						>
						<Text fw={600} size="md" mb={4}>Product Information</Text>
						<Text size="xs" c="dimmed" mb={16}>
							Lorem ipsum dolor sit amet consectetur. Non ac nulla
							aliquam asnean in velit mattis.
						</Text>
						{formFields}
					</PaperComponent>

					{/* Right: Image Product */}
					<BoxComponent style={{ width: 280, flexShrink: 0 }}>
						<PaperComponent style={{ borderRadius: 12, padding: 24 }}>
							<Text fw={600} size="md" mb={16}>Image Product</Text>
							{imageSection}
						</PaperComponent>

						{/* Desktop action buttons */}
						<GroupComponent justify="flex-end" mt={16} gap={10}>
							{isEdit && (
							<ButtonComponent
								variant="default"
								onClick={handleDiscard}
									>
								Discard Changes
							</ButtonComponent>
								)}
							<ButtonComponent
								loading={loading}
								onClick={handleSubmit}
								>
								{isEdit ? "Save Changes" : "Save Product"}
							</ButtonComponent>
						</GroupComponent>
					</BoxComponent>
				</GroupComponent>
			</BoxComponent>

			{/* ── Mobile layout ── */}
			<BoxComponent hiddenFrom="sm">
				<PaperComponent style={{ borderRadius: 12, padding: 16, marginBottom: 16 }}>
					<Text fw={600} size="md" mb={4}>Product Information</Text>
					<Text size="xs" c="dimmed" mb={16}>
						Lorem ipsum dolor sit amet consectetur. Non ac nulla
						aliquam asnean in velit mattis.
					</Text>
					{formFields}
				</PaperComponent>

				<PaperComponent style={{ borderRadius: 12, padding: 16, marginBottom: 80 }}>
					<Text fw={600} size="md" mb={16}>Image Product</Text>
					{imageSection}
				</PaperComponent>

				{/* Mobile sticky footer button */}
				<BoxComponent
					style={{
							position: "fixed",
							bottom: 0,
left: 0,
right: 0,
							padding: "12px 16px",
							backgroundColor: "#fff",
							borderTop: "1px solid #e5e7eb",
							zIndex: 100,
						}}
					>
					<GroupComponent gap={10} justify="flex-end">
						{isEdit && (
						<ButtonComponent variant="default" onClick={handleDiscard}>
							Discard
						</ButtonComponent>
							)}
						<ButtonComponent
							loading={loading}
							onClick={handleSubmit}
							style={{ flex: isEdit ? undefined : 1 }}
							>
							{isEdit ? "Save Changes" : "Save Product"}
						</ButtonComponent>
					</GroupComponent>
				</BoxComponent>
			</BoxComponent>
		</>
	);
};
export default AddProductModal;
