"use client";

import { Plus } from "lucide-react";
import { Loader, LoadingOverlay, Pagination, Table } from "@mantine/core";
import { MdOutlineEdit } from "react-icons/md";
import { useDebouncedCallback } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { useTagsContainer } from "./hook";
import {
	ActionIconComponent, BoxComponent,
	ButtonComponent,
	CenterComponent,
	GroupComponent, PaperComponent,
	PopConfirmComponent,
	PopConfirmType,
	SelectComponent,
	SortButtonComponent,
	SortButtonComponentItemProps,
	TextComponent,
	TextInputComponent,
} from "@/components";
import AddTagModal from "./add_tag_modal";
import { TagModel } from "@/models";
import {
	appColorRGBA,
	deleteTagApi,
	disableTagApi, formatDate, getBackgroundColor, getSurfaceColor,
	getTagApi,
	mantineRadius, useThemeProvider
} from "@/utils";
import { TitleComponent } from "@/components/mantine/title_component";
import { sortItems, tagSearchItems } from "@/constants";

const TagsContainer = () => {
	const {
		isSidebarOpen,
		isCreateTagModalOpen,
		toggleCreateModalTagOpen,
	} = useTagsContainer();
	const { darkMode } = useThemeProvider();
	const [tagsList, setTagsList] = useState<TagModel[]>([]);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [tagId, setTagId] = useState("");
	const [tagName, setTagName] = useState<string>("");
	const [searchValue, setSearchValue] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [filter, setFilter] = useState<string | null>("tag_id");

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
		toggleCreateModalTagOpen();
	};

	const handleActionTag = async (id: string, tagType: string) => {
		if (tagType === "disable") {
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
					onConfirm={async () => handleActionTag(element.tag_id, "disable")}
				/>
			</Table.Td>
			<Table.Td w={110}>
				<GroupComponent>
					<PopConfirmComponent
						entityName="tag"
						actionName="delete"
						onConfirm={async () => handleActionTag(element.tag_id, "delete")}
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
						data={tagSearchItems("Tag Id", "tag_id")}
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

			{
				tagsList.length === 0 ?
					<LoadingOverlay
						mt={116}
						mr={12}
						ml={68}
						mb={12}
						zIndex={10}
						visible={tagsList.length === 0}
						overlayProps={{
							radius: mantineRadius,
							backgroundOpacity: 1,
							color: getSurfaceColor(darkMode).backgroundColor
						}}
						/> :
					<BoxComponent style={{ overflow: "hidden" }} className="mx-3">
						<BoxComponent mx="auto">
							<PaperComponent withBorder radius={mantineRadius}>
								<Table highlightOnHover>
									<Table.Thead>
										<Table.Tr>
											<Table.Th>Index</Table.Th>
											<Table.Th>Tag Id</Table.Th>
											<Table.Th>Name</Table.Th>
											<Table.Th>Created At</Table.Th>
											<Table.Th>Disable</Table.Th>
											<Table.Th>Action</Table.Th>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>{rows}</Table.Tbody>
								</Table>
							</PaperComponent>
							<CenterComponent>
								<Pagination
									mt={12}
									total={10}
									value={page}
									radius={mantineRadius}
									onChange={(pageNumber) => {
										setPage(pageNumber);
									}}
								/>
							</CenterComponent>
						</BoxComponent>
					</BoxComponent>

			}

			{isCreateTagModalOpen &&
			<AddTagModal
				tagId={tagId}
				setCallApi={setCallApi}
				initialTagValue={tagName}
				isOpen={isCreateTagModalOpen}
				onClose={toggleCreateModalTagOpen}
			/>
			}
		</main>
	);
};

export default TagsContainer;
