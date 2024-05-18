"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch, Table } from "@mantine/core";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { useAddOnsContainer } from "./hook";
import { DashboardPageHeader } from "@/components";
import AddAddOnModal from "./add_add_on_modal";
import { AddOnModel } from "@/models";
import { addOnsName, deleteAddOnApi, disableAddOnApi, formatDate, getAddOnApi } from "@/utils";
import ActionAddOnModal from "./action_add_on_modal";

const AddOnsContainer = () => {
	const {
		isSidebarOpen,
		isCreateAddOnModalOpen,
		toggleCreateAddOnModalOpen,
	} = useAddOnsContainer();

	const [addOnList, setAddOnList] = useState<AddOnModel[]>([]);
	const [callApi, setCallApi] = useState(true);
	const [addOnId, setAddOnId] = useState<string>("");
	const [addOnType, setAddOnType] = useState<string>("");
	const [isDisable, setIsDisable] = useState<boolean>(true);
	const [isActionAddOneModalOpen, setIsActionAddOneModalOpen] =
		useState<boolean>(false);

	useEffect(() => {
		if (callApi) {
			getAddOnApi((data: any) => {
				setAddOnList(data.addOns);
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}).then();
		}
	}, [callApi]);

	const handleOpenModal = (id: string, type: string, disableType: boolean) => {
		setAddOnId(id);
		setAddOnType(type);
		setIsDisable(disableType);
		setIsActionAddOneModalOpen(true);
	};

	const handleActionAddOn = () => {
		if (addOnType === "edit") {
			toggleCreateAddOnModalOpen();
			setIsActionAddOneModalOpen(false);
		} else if (addOnType === "disable") {
			disableAddOnApi(addOnId, () => {
			setCallApi(true);
			setIsActionAddOneModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		} else {
			deleteAddOnApi(addOnId, () => {
			setCallApi(true);
			setIsActionAddOneModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		}
	};

	const rows = addOnList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.add_on_id}</Table.Td>
			<Table.Td>{element.icon}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.price}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td>
				<Switch
					checked={element.is_disabled === true}
					onClick={() => handleOpenModal(element.add_on_id, "disable", element.is_disabled)}
				/>
			</Table.Td>
			<Table.Td>
				<div className="flex">
					<IoTrashOutline color="red" size={25} style={{ marginRight: "10px" }} onClick={() => handleOpenModal(element.add_on_id, "delete", element.is_disabled)} />
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
				heading="Add Ons"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "New Add On",
					titleClassName: "sm:flex hidden",
					onClick: toggleCreateAddOnModalOpen,
					className: "rounded-md w-fit text-grey-100 text-sm",
					children: <Plus size={20} className="sm:mr-2 mr-0" />,
				}}
			/>

			<Table striped highlightOnHover withTableBorder>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Index</Table.Th>
						<Table.Th>Add on Id</Table.Th>
						<Table.Th>Icon</Table.Th>
						<Table.Th>Name</Table.Th>
						<Table.Th>Price</Table.Th>
						<Table.Th>Created at</Table.Th>
						<Table.Th>Disable</Table.Th>
						<Table.Th>Action</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>

			<AddAddOnModal
				isOpen={isCreateAddOnModalOpen}
				onClose={toggleCreateAddOnModalOpen}
				setCallApi={setCallApi}
			/>

			<ActionAddOnModal
				isOpen={isActionAddOneModalOpen}
				onClose={() => setIsActionAddOneModalOpen(false)}
				setCallApi={setCallApi}
				handleActionAddOn={handleActionAddOn}
				addOnType={addOnType}
				isDisable={isDisable}
			/>

		</main>
	);
};

export default AddOnsContainer;
