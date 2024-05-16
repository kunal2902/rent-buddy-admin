"use client";

import { Plus } from "lucide-react";
import { Switch, Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { DashboardPageHeader } from "@/components";
import { useItemsContainer } from "./hook";
import { ItemTypeModel } from "@/models";
import { deleteItemApi, disableItemApi, formatDate, getItemApi } from "@/utils";
import ActionItemModal from "./action_item_modal";

const ItemsContainer = () => {
	const { isSidebarOpen } = useItemsContainer();
	const [itemList, setItemList] = useState<ItemTypeModel[]>([]);
	const [callApi, setCallApi] = useState(true);
	const [itemId, setItemId] = useState<string>("");
	const [itemType, setItemType] = useState<string>("");
	const [isDisable, setIsDisable] = useState<boolean>(true);
	const [isActionItemModalOpen, setIsActionItemModalOpen] = useState<boolean>(false);

	useEffect(() => {
		if (callApi) {
			getItemApi((data: any) => {
				setItemList(data.item);
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}).then();
		}
	}, [callApi]);

	const handleOpenModal = (id: string, type: string, disableType: boolean) => {
		setItemId(id);
		setItemType(type);
		setIsDisable(disableType);
		setIsActionItemModalOpen(true);
	};

	const handleActionItem = () => {
		if (itemType === "disable") {
			disableItemApi(itemId, () => {
			setCallApi(true);
			setIsActionItemModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		} else {
			deleteItemApi(itemId, () => {
			setCallApi(true);
			setIsActionItemModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		}
	};

	const rows = itemList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{element.item_id}</Table.Td>
			<Table.Td>{element.item_id}</Table.Td>
			<Table.Td>{element.icon}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td>
				<Switch
					checked={element.is_disabled === true}
					onClick={() => handleOpenModal(element.item_id, "disable", element.is_disabled)}
				/>
			</Table.Td>
			<Table.Td>
				<div className="flex">
					<IoTrashOutline color="red" size={25} style={{ marginRight: "10px" }} onClick={() => handleOpenModal(element.item_id, "delete", element.is_disabled)} />
					<FaRegEdit color="rgba(108, 210, 213, 1)" size={25} />
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
				heading="Items"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "New Item",
					titleClassName: "sm:flex hidden",
					className: "rounded-md w-fit text-grey-100 text-sm",
					children: <Plus className="sm:mr-2 mr-0" size={20} />,
				}}
			/>

			<Table striped highlightOnHover withTableBorder>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Index</Table.Th>
						<Table.Th>Sub category Id</Table.Th>
						<Table.Th>Icon</Table.Th>
						<Table.Th>Name</Table.Th>
						<Table.Th>Sub name</Table.Th>
						<Table.Th>Created at</Table.Th>
						<Table.Th>Disable</Table.Th>
						<Table.Th>Action</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>

			<ActionItemModal
				isOpen={isActionItemModalOpen}
				onClose={() => setIsActionItemModalOpen(false)}
				setCallApi={setCallApi}
				handleActionItem={handleActionItem}
				itemType={itemType}
				isDisable={isDisable}
			/>
		</main>
	);
};

export default ItemsContainer;
