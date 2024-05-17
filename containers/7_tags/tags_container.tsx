"use client";

import { Plus } from "lucide-react";
import { Center, Group, Loader, Pagination, Select } from "@mantine/core";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { Switch, Table, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTagsContainer } from "./hook";
import { DashboardPageHeader } from "@/components";
import AddTagModal from "./add_tag_modal";
import { TagModel } from "@/models";
import { deleteTagApi, disableTagApi, getTagApi } from "@/utils";
import ActionTagModal from "./action_tag_modal";
import { useDebouncedCallback } from "@mantine/hooks";

const TagsContainer = () => {
	const { isSidebarOpen, isCreateTagModalOpen, toggleCreateModalTagOpen } =
		useTagsContainer();
	const [tagsList, setTagsList] = useState<TagModel[]>([]);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [tagId, setTagId] = useState<string>("");
	const [tagType, setTagType] = useState<string>("");
	const [isDisable, setIsDisable] = useState<boolean>(true);
	const [tagName, setTagName] = useState<string>("");
	const [searchValue, setSearchValue] = useState("");
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [filter, setFilter] = useState("tag_id");
	const [isActionTagModalOpen, setIsActionTagModalOpen] =
		useState<boolean>(false);

	useEffect(() => {
		console.log("I am Called", callApi);
		// if (callApi) {
		getTagApi(
			`orderBy=${filter}&page=${page}&order=asc`,
			(data: any) => {
				setTagsList(data.tags);
				setCallApi(false);
			},
			() => {
				setCallApi(false);
			},
			() => {
				setCallApi(false);
			},
		).then();
		// }
	}, [filter, page]);

	const handleSearch = useDebouncedCallback(async (query: string) => {
		setLoading(true);
		getTagApi(
			`name=${searchValue}`,
			(data: any) => {
				setTagsList(data.tags);
				setCallApi(false);
			},
			() => {
				setCallApi(false);
			},
			() => {
				setCallApi(false);
			},
		).then();
		setLoading(false);
	}, 500);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.currentTarget.value);
		handleSearch(event.currentTarget.value);
	};

	const handleAddOpenModal = () => {
		setTagId("");
		setTagName("");
		toggleCreateModalTagOpen();
	};

	const handleOpenModal = (
		id: string,
		type: string,
		disableType: boolean,
	) => {
		setTagId(id);
		setTagType(type);
		setIsDisable(disableType);
		setIsActionTagModalOpen(true);
	};

	const handleActionTag = () => {
		if (tagType === "edit") {
			toggleCreateModalTagOpen();
			setIsActionTagModalOpen(false);
		} else if (tagType === "disable") {
			disableTagApi(
				tagId,
				() => {
					setCallApi(true);
					setIsActionTagModalOpen(false);
				},
				() => {
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				},
			);
		} else {
			deleteTagApi(
				tagId,
				() => {
					setCallApi(true);
					setIsActionTagModalOpen(false);
				},
				() => {
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				},
			);
		}
	};

	const rows = tagsList.map((element, index) => (
		<Table.Tr>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.tag_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>
				<Switch
					checked={element.is_disabled === true}
					onClick={() =>
						handleOpenModal(
							element.tag_id,
							"disable",
							element.is_disabled,
						)
					}
				/>
			</Table.Td>
			<Table.Td>
				<div className="flex">
					<IoTrashOutline
						color="red"
						size={25}
						style={{ marginRight: "10px" }}
						onClick={() =>
							handleOpenModal(
								element.tag_id,
								"delete",
								element.is_disabled,
							)
						}
					/>
					<FaRegEdit
						color="rgba(108, 210, 213, 1)"
						size={25}
						onClick={() => {
							handleOpenModal(
								element.tag_id,
								"edit",
								element.is_disabled,
							);
							setTagName(element.name);
							setTagId(element.tag_id);
						}}
					/>
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
					onClick: handleAddOpenModal,
					className: "rounded-md w-fit text-grey-100 text-sm",
					children: <Plus size={20} className="sm:mr-2 mr-0" />,
				}}
			/>
			<Group grow>
				<TextInput
					placeholder="Enter Tag Name"
					value={searchValue}
					onChange={handleChange}
					rightSection={loading && <Loader size={20} />}
				/>
				<Select
					placeholder="Order By"
					searchable
					data={["Name", "Tag Id"]}
					onSearchChange={(value) => {
						if (value == "Name") {
							setFilter("name");
						} else {
							setFilter("tag_id");
						}
					}}
				/>
			</Group>
			<Table striped highlightOnHover withTableBorder>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Sr No.</Table.Th>
						<Table.Th>Tag Id</Table.Th>
						<Table.Th>Name</Table.Th>
						<Table.Th>Disable</Table.Th>
						<Table.Th>Action</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
			<Center>
				<Pagination
					total={10}
					value={page}
					onChange={(pageNumber) => {
						setPage(pageNumber);
					}}
					mt="sm"
					radius="lg"
					color="teal"
				/>
			</Center>
			<AddTagModal
				isOpen={isCreateTagModalOpen}
				onClose={toggleCreateModalTagOpen}
				setCallApi={setCallApi}
				initialTagValue={tagName}
				tagId={tagId}
			/>

			<ActionTagModal
				isOpen={isActionTagModalOpen}
				onClose={() => setIsActionTagModalOpen(false)}
				setCallApi={setCallApi}
				handleActionTag={handleActionTag}
				tagAction={tagType}
			/>
		</main>
	);
};

export default TagsContainer;
