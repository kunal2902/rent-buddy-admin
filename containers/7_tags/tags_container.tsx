"use client";

import { Table } from "@mantine/core";
import { MdOutlineEdit } from "react-icons/md";
import { useDebouncedCallback } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import {
	ActionIconComponent,
	BoxComponent,
	CenterComponent,
	DashboardPageHeader,
	GroupComponent,
	LoadingOverlayComponent, PaginationComponent,
	PaperComponent,
	PopConfirmComponent,
	PopConfirmType,
	SortButtonComponentItemProps,
 MainComponent } from "@/components";
import AddTagModal from "./add_tag_modal";
import { TagModel } from "@/models";
<<<<<<< HEAD
import {
	appColorRGBA,
	deleteTagApi,
	disableTagApi, formatDate, getBackgroundColor, getSurfaceColor,
	getTagApi,
	mantineRadius, useThemeProvider,
} from "@/utils";
import { TitleComponent } from "@/components/mantine/title_component";
import { searchItems, sortItems } from "@/constants";
=======
import { deleteTagApi, disableTagApi, formatDate, getTagApi } from "@/utils";
>>>>>>> 3dc6be9c6b3086fb0ce2b6922831753edcae9c80

const TagsContainer = () => {
	const [tagId, setTagId] = useState("");
	const [page, setPage] = useState<number>(1);
	const [tagName, setTagName] = useState<string>("");
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const [tagsList, setTagsList] = useState<TagModel[]>([]);
	const [filter, setFilter] = useState<string | null>("tag_id");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);

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

	useEffect(() => {
		if (searchValue) {
			handleSearch(searchValue);
		}
	}, [searchValue]);

	const handleSearch = useDebouncedCallback(async (query: string) => {
		setLoading(true);
		if (query === "") {
			setCallApi(true);
			setLoading(false);
		} else {
			getTagApi(
				`name=${query}`,
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

	const handleAddOpenModal = (id: string, name: string) => {
		setTagId(id);
		setTagName(name);
		setOpenAddModal(true);
	};

	const handleAction = async (id: string, actionType: string) => {
		if (actionType === "disable") {
			await disableTagApi(
				id,
				() => {
					setCallApi(true);
				},
				() => {
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				}
			);
		} else {
			await deleteTagApi(
				id,
				() => {
					setCallApi(true);
				},
				() => {
					setCallApi(false);
				},
				() => {
					setCallApi(false);
				}
			);
		}
	};

	const columns = [
		"Index",
		"Tag Id",
		"Name",
		"Created At",
		"Disable",
		"Action",
	];

	const rows = tagsList.map((element, index) => (
		<Table.Tr>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.tag_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td w={60}>
				<PopConfirmComponent
					entityName="tag"
					type={PopConfirmType.switch}
					isDisabled={element.is_disabled}
					actionName={element.is_disabled ? "enable" : "disable"}
					onConfirm={async () => handleAction(element.tag_id, "disable")}
				/>
			</Table.Td>
			<Table.Td w={110}>
				<GroupComponent>
					<PopConfirmComponent
						entityName="tag"
						actionName="delete"
						onConfirm={async () => handleAction(element.tag_id, "delete")}
					/>
					<ActionIconComponent
						onClick={() => handleAddOpenModal(element.tag_id, element.name)}
						size="md">
						<MdOutlineEdit size={18} />
					</ActionIconComponent>
				</GroupComponent>
			</Table.Td>
		</Table.Tr>
	));

	return (
<<<<<<< HEAD
		<main
			className={`flex min-h-screen w-full flex-col pt-14 ${
				isSidebarOpen ? "lg:pl-64 pl-0" : "pl-14"
			}`}
			style={getBackgroundColor(darkMode)}
		>
			<GroupComponent className="m-3" align="center" justify="space-between">
				<TitleComponent title="Tags" />
				<GroupComponent>
					<SelectComponent
						placeholder="Searching In"
						searchable
						size="sm"
						data={searchItems("Tag Id", "tag_id")}
						setValue={setFilter}
						setOption={(option) => {
								setFilter(option.value);
							}}
						/>

					<TextInputComponent
						size="sm"
						value={searchValue}
						setValue={setSearchValue}
						placeholder="Search"
						rightSection={loading && <Loader size={20} />}
						/>

					<SortButtonComponent
						items={sortItems("tag_id")}
						onSelected={(selected: SortButtonComponentItemProps) => {
								console.log(selected.label);
							}}
						/>

					<ButtonComponent
						c={appColorRGBA}
						color={getSurfaceColor(darkMode).backgroundColor}
						onClick={() => handleAddOpenModal("", "")}
						>
						<Plus size={18} className="sm:mr-2 mr-0" />
						<TextComponent text="Add Tag" c={appColorRGBA} />
					</ButtonComponent>
				</GroupComponent>
			</GroupComponent>
=======
		<MainComponent>
			<DashboardPageHeader
				title="Tags"
				idLabel="Tag Id"
				loading={loading}
				idVariable="tag_id"
				setFilter={setFilter}
				buttonTitle="Add Tag"
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				setOption={(option) => {
					setFilter(option.value);
				}}
				onClick={() => handleAddOpenModal("", "")}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					console.log(selected.label);
				}}
			/>
>>>>>>> 3dc6be9c6b3086fb0ce2b6922831753edcae9c80

			{
				tagsList.length === 0 ?
					<LoadingOverlayComponent
						visible={tagsList.length === 0}
<<<<<<< HEAD
						overlayProps={{
							radius: mantineRadius,
							backgroundOpacity: 1,
							color: getSurfaceColor(darkMode).backgroundColor,
						}}
						/> :
=======
					/> :
>>>>>>> 3dc6be9c6b3086fb0ce2b6922831753edcae9c80
					<BoxComponent style={{ overflow: "hidden" }} className="mx-3">
						<BoxComponent mx="auto">
							<PaperComponent>
								<Table highlightOnHover>
									<Table.Thead>
										<Table.Tr>
											{columns.map((item) =>
												(<Table.Th key={item}>{item}</Table.Th>)
											)}
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>{rows}</Table.Tbody>
								</Table>
							</PaperComponent>
							<CenterComponent>
								<PaginationComponent
									value={page}
									total={10}
									onChange={setPage}
								/>
							</CenterComponent>
						</BoxComponent>
					</BoxComponent>
			}

<<<<<<< HEAD
			{isCreateTagModalOpen &&
=======
			{openAddModal &&
>>>>>>> 3dc6be9c6b3086fb0ce2b6922831753edcae9c80
				<AddTagModal
					tagId={tagId}
					setCallApi={setCallApi}
					initialTagValue={tagName}
<<<<<<< HEAD
					isOpen={isCreateTagModalOpen}
					onClose={toggleCreateModalTagOpen}
=======
					isOpen={openAddModal}
					onClose={() => {
						setOpenAddModal(false);
					}}
>>>>>>> 3dc6be9c6b3086fb0ce2b6922831753edcae9c80
				/>
			}
		</MainComponent>
	);
};

export default TagsContainer;
