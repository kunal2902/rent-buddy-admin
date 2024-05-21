"use client";

import { Plus } from "lucide-react";
import { Box, Loader, Pagination, Switch, Table } from "@mantine/core";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { useDebouncedCallback } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import { useTagsContainer } from "./hook";
import {
	ButtonComponent,
	CenterComponent,
	GroupComponent,
	SelectComponent,
	SortButtonComponent,
	SortButtonComponentItemProps,
	SortItemDirection,
	TextComponent,
	TextInputComponent,
} from "@/components";
import AddTagModal from "./add_tag_modal";
import { TagModel } from "@/models";
import { deleteTagApi, disableTagApi, getTagApi } from "@/utils";
import ActionTagModal from "./action_tag_modal";
import { TitleComponent } from "@/components/mantine/title_component";

const TagsContainer = () => {
	const { isSidebarOpen, isCreateTagModalOpen, toggleCreateModalTagOpen } =
		useTagsContainer();
	const [tagsList, setTagsList] = useState<TagModel[]>([]);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [tagId, setTagId] = useState<string>("");
	const [tagType, setTagType] = useState<string>("");
	const [isDisable, setIsDisable] = useState<boolean>(true);
	const [tagName, setTagName] = useState<string>("");
	const [searchValue, setSearchValue] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [filter, setFilter] = useState<string>("tag_id");
	const [isActionTagModalOpen, setIsActionTagModalOpen] =
		useState<boolean>(false);

	useEffect(() => {
		if (callApi) {
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
				}
			).then();
		}
	}, [filter, page, callApi]);

	const handleSearch = useDebouncedCallback(async (query: string) => {
		setLoading(true);
		if (searchValue === "") {
			setCallApi(true);
			setLoading(false);
		} else {
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
				}
			).then();
			setLoading(false);
		}
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
		disableType: boolean
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
				}
			).then();
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
				}
			).then();
		}
	};

	const rows = tagsList.map((element, index) => (
		<Table.Tr>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.tag_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>
				<Switch
					checked={element.is_disabled}
					onClick={() =>
						handleOpenModal(
							element.tag_id,
							"disable",
							element.is_disabled
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
								element.is_disabled
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
								element.is_disabled
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
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-14"
			}`}
		>

			<GroupComponent className="mx-3 my-2" align="center" justify="space-between">
				<TitleComponent title="Tags" />
				<GroupComponent>
					<SelectComponent
						placeholder="Searching In"
						searchable
						size="sm"
						defaultValue={filter}
						data={["Name", "Tag Id"]}
						onSearchChange={(value) => {
							if (value === "Name") {
								setFilter("name");
							} else {
								setFilter("tag_id");
							}
						}}
					/>
					<TextInputComponent
						size="sm"
						value={searchValue}
						onChange={handleChange}
						placeholder="Search"
						rightSection={loading && <Loader size={20} />}
					/>

					<SortButtonComponent
						items={
							[
								{
									id: 1,
									label: "Id - ascending",
									icon: GoSortAsc,
									direction: SortItemDirection.ascending,
								},
								{
									id: 2,
									label: "Id - descending",
									icon: GoSortDesc,
									direction: SortItemDirection.descending,
								},
								{
									id: 3,
									label: "Name - ascending",
									icon: GoSortAsc,
									direction: SortItemDirection.ascending,
								},
								{
									id: 4,
									label: "Name - descending",
									icon: GoSortDesc,
									direction: SortItemDirection.descending,
								},
								{
									id: 5,
									label: "Date - ascending",
									icon: GoSortAsc,
									direction: SortItemDirection.ascending,
								},
								{
									id: 6,
									label: "Date - descending",
									icon: GoSortDesc,
									direction: SortItemDirection.descending,
								},
							]
						}
						onSelected={(selected: SortButtonComponentItemProps) => {
							console.log(selected.label);
						}}
					/>

					<ButtonComponent
						variant="light"
						onClick={handleAddOpenModal}
					>
						<Plus size={20} className="sm:mr-2 mr-0" />
						<TextComponent text="Add Tag" />
					</ButtonComponent>
				</GroupComponent>

			</GroupComponent>

			<Box style={{ overflow: "hidden" }} className="mx-3">
				<Box mx="auto">
					<Table striped highlightOnHover withTableBorder>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Index</Table.Th>
								<Table.Th>Tag Id</Table.Th>
								<Table.Th>Name</Table.Th>
								<Table.Th>Disable</Table.Th>
								<Table.Th>Action</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>{rows}</Table.Tbody>
					</Table>
					<CenterComponent>
						<Pagination
							total={10}
							value={page}
							onChange={(pageNumber) => {
								setPage(pageNumber);
							}}
							mt="sm"
							radius="lg"
						/>
					</CenterComponent>
				</Box>
			</Box>

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
