"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Switch, Table, Image } from "@mantine/core";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { useItemTypesContainer } from "./hook";
import { DashboardPageHeader } from "@/components";
import { ItemTypeModel } from "@/models";
import { deleteItemTypeApi, disableItemTypeApi, formatDate, getItemTypeApi, imageUrl } from "@/utils";
import ActionItemTypeModal from "./action_item_type_modal";
import AddItemTypeModal from "@/containers/3_item_types/add_item_type_modal";

const ItemTypesContainer = () => {
	const { isSidebarOpen,
		isCreateItemTypeModalOpen,
		toggleCreateItemTypeModalOpen,
	} = useItemTypesContainer();
	const [itemTypeList, setItemTypeList] = useState<ItemTypeModel[]>([]);
	const [callApi, setCallApi] = useState(true);
	const [itemTypeId, setItemTypeId] = useState<string>("");
	const [itemType, setItemType] = useState<string>("");
	const [itemTypeName, setItemTypeName] = useState<string>("");
	const [itemTypeImage, setItemTypeImage] = useState<string | undefined>("");
	const [isActionItemTypeModalOpen, setIsActionItemTypeModalOpen] = useState<boolean>(false);

	useEffect(() => {
		if (callApi) {
			getItemTypeApi((data: any) => {
				setItemTypeList(data.itemTypes);
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}).then();
		}
	}, [callApi]);

	const handleOpenModal = (id: string, type: string) => {
		setItemTypeId(id);
		setItemType(type);
		setIsActionItemTypeModalOpen(true);
	};

	const handleActionItemType = () => {
		if (itemType === "disable") {
			disableItemTypeApi(itemTypeId, () => {
			setCallApi(true);
			setIsActionItemTypeModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		} else {
			deleteItemTypeApi(itemTypeId, () => {
			setCallApi(true);
			setIsActionItemTypeModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		}
	};

	const handleUpsertItemTypeModal = (id: string, name: string, image: string | undefined, type: string) => {
		setItemTypeId(id);
		setItemTypeName(name);
		setItemTypeImage(image);
		setItemTypeId(id);
		toggleCreateItemTypeModalOpen();
		setItemType(type);
	};

	const rows = itemTypeList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.item_type_id}</Table.Td>
			<Table.Td>
				<Image
					radius="md"
					h={50}
					w="auto"
					src={`${imageUrl}/${element.icon}`}
				/>
			</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td>
				<Switch
					checked={element.is_disabled === true}
					onClick={() => handleOpenModal(element.item_type_id, "disable")}
				/>
			</Table.Td>
			<Table.Td>
				<div className="flex">
					<IoTrashOutline color="red" size={25} style={{ marginRight: "10px" }} onClick={() => handleOpenModal(element.item_type_id, "delete")} />
					<FaRegEdit color="rgba(108, 210, 213, 1)" size={25} onClick={() => handleUpsertItemTypeModal(element.item_type_id, element.name, element.icon, "Edit")} />
				</div>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-16"
			}`}
		>
			<DashboardPageHeader
				heading="Item Types"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "New Item Type",
					titleClassName: "sm:flex hidden",
					onClick: () => handleUpsertItemTypeModal("", "", "", "Add"),
					className: "rounded-md w-fit text-grey-100 text-sm",
					children: <Plus className="sm:mr-2 mr-0" size={20} />,
				}}
			/>

			<Table striped highlightOnHover withTableBorder>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Index</Table.Th>
						<Table.Th>Item type Id</Table.Th>
						<Table.Th>Icon</Table.Th>
						<Table.Th>Name</Table.Th>
						<Table.Th>Created at</Table.Th>
						<Table.Th>Disable</Table.Th>
						<Table.Th>Action</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>

			<AddItemTypeModal
				isOpen={isCreateItemTypeModalOpen}
				onClose={toggleCreateItemTypeModalOpen}
				setCallApi={setCallApi}
				itemType={itemType}
				name={itemTypeName}
				id={itemTypeId}
				image={itemTypeImage}
			/>

			<ActionItemTypeModal
				isOpen={isActionItemTypeModalOpen}
				onClose={() => {
					setIsActionItemTypeModalOpen(false);
					setItemType("");
					setItemTypeImage("");
					setItemTypeName("");
					setItemTypeId("");
				}}
				setCallApi={setCallApi}
				handleActionItemType={handleActionItemType}
				itemType={itemType}
			/>

		</main>
	);
};

export default ItemTypesContainer;
