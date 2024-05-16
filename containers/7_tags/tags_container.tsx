"use client";

import { Plus } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { Switch, Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTagsContainer } from "./hook";
import { DashboardPageHeader } from "@/components";
import AddTagModal from "./add_tag_modal";
import { TagModel } from "@/models";
import { deleteTagApi, disableTagApi, getTagApi } from "@/utils";
import ActionTagModal from "./action_tag_modal";

const TagsContainer = () => {
	const { isSidebarOpen,
			isCreateTagModalOpen,
			toggleCreateModalTagOpen,
		} = useTagsContainer();
	const [tagsList, setTagsList] = useState<TagModel[]>([]);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [tagId, setTagId] = useState<string>("");
	const [tagType, setTagType] = useState<string>("");
	const [isDisable, setIsDisable] = useState<boolean>(true);
	const [isActionTagModalOpen, setIsActionTagModalOpen] = useState<boolean>(false);

	useEffect(() => {
		if (callApi) {
			getTagApi((data: any) => {
				setTagsList(data.tags);
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}, () => {
				setCallApi(false);
			}).then();
		}
	}, [callApi]);

	const handleOpenModal = (id: string, type: string, disableType: boolean) => {
		setTagId(id);
		setTagType(type);
		setIsDisable(disableType);
		setIsActionTagModalOpen(true);
	};

	const handleActionTag = () => {
		if (tagType === "disable") {
			disableTagApi(tagId, () => {
			setCallApi(true);
			setIsActionTagModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		} else {
			deleteTagApi(tagId, () => {
			setCallApi(true);
			setIsActionTagModalOpen(false);
		}, () => {
			setCallApi(false);
		}, () => {
			setCallApi(false);
		});
		}
	};

	const rows = tagsList.map((element) => (
		<Table.Tr>
			{/* <Table.Td>{element.tag_id}</Table.Td> */}
			<Table.Td>{element.tag_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>
				<Switch
					checked={element.is_disabled}
					onClick={() => handleOpenModal(element.tag_id, "disable", element.is_disabled)}
				/>
			</Table.Td>
			<Table.Td>
				<div className="flex">
					<IoTrashOutline color="red" size={25} style={{ marginRight: "10px" }} onClick={() => handleOpenModal(element.tag_id, "delete", element.is_disabled)} />
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
				heading="Tags"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
				button
				buttonProps={{
					title: "New Tag",
					titleClassName: "sm:flex hidden",
					onClick: toggleCreateModalTagOpen,
					className: "rounded-md w-fit text-grey-100 text-sm",
					children: <Plus size={20} className="sm:mr-2 mr-0" />,
				}}
			/>

			<Table striped highlightOnHover withTableBorder>
				<Table.Thead>
					<Table.Tr>
						{/* <Table.Th>Sr No.</Table.Th> */}
						<Table.Th>Tag Id</Table.Th>
						<Table.Th>Name</Table.Th>
						<Table.Th>Disable</Table.Th>
						<Table.Th>Action</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>

			<AddTagModal
				isOpen={isCreateTagModalOpen}
				onClose={toggleCreateModalTagOpen}
				setCallApi={setCallApi}
			/>

			<ActionTagModal
				isOpen={isActionTagModalOpen}
				onClose={() => setIsActionTagModalOpen(false)}
				setCallApi={setCallApi}
				handleActionTag={handleActionTag}
				tagType={tagType}
				isDisable={isDisable}
			/>
		</main>
	);
};

export default TagsContainer;
