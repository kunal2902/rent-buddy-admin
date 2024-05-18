"use client";

import { Plus } from "lucide-react";
import { Switch, Table } from "@mantine/core";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useSubCategoriesContainer } from "./hook";
import { DashboardPageHeader } from "@/components";
import { SubCategoryModel } from "@/models";
import { deleteSubCategoryApi, disableSubCategoryApi, formatDate, getSubCategoryApi } from "@/utils";
import CreateSubCategoryModal from "./add_sub_category_modal";
import ActionSubCategoryModal from "./action_sub_category_modal";

const SubCategoriesContainer = () => {
	const {
		isSidebarOpen,
		isCreateSubCategoryModalOpen,
		toggleCreateSubCategoryModalOpen,
	} = useSubCategoriesContainer();

	const [subCategoryList, setSubCategoryList] = useState<SubCategoryModel[]>(
		[],
	);
	const [callApi, setCallApi] = useState(true);
	const [subCatId, setSubCatId] = useState<string>("");
	const [subCatType, setSubCatType] = useState<string>("");
	const [isDisable, setIsDisable] = useState<boolean>(true);
	const [isActionSubCatModalOpen, setIsActionSubCatModalOpen] = useState<boolean>(false);

	useEffect(() => {
		if (callApi) {
			getSubCategoryApi((data: any) => {
				setSubCategoryList(data.subCategories);
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}).then();
		}
	}, [callApi]);

	const handleOpenModal = (id: string, type: string, disableType: boolean) => {
		setSubCatId(id);
		setSubCatType(type);
		setIsDisable(disableType);
		setIsActionSubCatModalOpen(true);
	};

		const handleActionSubCat = () => {
		if (subCatType === "disable") {
			disableSubCategoryApi(subCatId, () => {
			setCallApi(true);
			setIsActionSubCatModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		} else {
			deleteSubCategoryApi(subCatId, () => {
			setCallApi(true);
			setIsActionSubCatModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		}
	};

	const rows = subCategoryList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.sub_category_id}</Table.Td>
			<Table.Td>{element.icon}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td>
				<Switch
					checked={element.is_disabled === true}
					onClick={() => handleOpenModal(element.sub_category_id, "disable", element.is_disabled)}
				/>
			</Table.Td>
			<Table.Td>
				<div className="flex">
					<IoTrashOutline color="red" size={25} style={{ marginRight: "10px" }} onClick={() => handleOpenModal(element.category_id, "delete", element.is_disabled)} />
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
				heading="Sub Categories"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "New Sub Category",
					titleClassName: "sm:flex hidden",
					onClick: toggleCreateSubCategoryModalOpen,
					className: "rounded-md w-fit text-grey-100 text-sm",
					children: <Plus size={20} className="mr-0" />,
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

			<CreateSubCategoryModal
				isOpen={isCreateSubCategoryModalOpen}
				onClose={toggleCreateSubCategoryModalOpen}
				setCallApi={setCallApi}
			/>

			<ActionSubCategoryModal
				isOpen={isActionSubCatModalOpen}
				onClose={() => setIsActionSubCatModalOpen(false)}
				setCallApi={setCallApi}
				handleActionSubCat={handleActionSubCat}
				subCatType={subCatType}
				isDisable={isDisable}
			/>

		</main>
	);
};

export default SubCategoriesContainer;
