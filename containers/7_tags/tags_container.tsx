"use client";

import { Table } from "@mantine/core";
import { MdOutlineEdit } from "react-icons/md";
import { useDebouncedCallback } from "@mantine/hooks";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ActionIconComponent,
	BoxComponent,
	CenterComponent,
	DashboardPageHeader,
	GroupComponent,
	LoadingOverlayComponent,
	MainComponent,
	NoDataFound,
	PaginationComponent,
	PaperComponent,
	PopConfirmComponent,
	PopConfirmType,
	SortButtonComponentItemProps,
} from "@/components";
import AddTagModal from "./add_tag_modal";
import { TagModel } from "@/models";
import { deleteTagApi, disableTagApi, formatDate, getTagApi, logoutUser } from "@/utils";
import ShowNotification from "@/components/mantine/show_notification";

const TagsContainer = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(15);
	const [tagId, setTagId] = useState<string>("");
	const [tagName, setTagName] = useState<string>("");
	const [callApi, setCallApi] = useState<boolean>(true);
	const [total, setTotal] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const [filter, setFilter] = useState<string>("name");
	const [orderBy, setOrderBy] = useState<string>("tag_id");
	const [order, setOrder] = useState<string>("asc");
	const [tagsList, setTagsList] = useState<TagModel[]>([]);
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const currentQueryRef = useRef(searchValue);

	useEffect(() => {
		initState().then();
	}, [filter, page, callApi, orderBy, order]);

	useEffect(() => {
		currentQueryRef.current = searchValue;
	}, [searchValue]);

	const initState = async () => {
		setLoading(true);
		await getTagApi(
			`filter_type=${filter}&filter_query=${searchValue}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setTagsList(data.tags);
				setTotal(data.tags_count);
				setLoading(false);
			},
			() => {
				setLoading(false);
			},
			() => {
				setLoading(false);
				logoutUser(router);
			}
		);
	};

	useEffect(() => {
		if (searchValue) {
			handleSearch(searchValue);
		} else {
			setSearchLoading(false);
			initState().then();
		}
	}, [searchValue]);

	const handleSearch = useDebouncedCallback(async (q: string) => {
		if (q === currentQueryRef.current) {
			setSearchLoading(true);
			getTagApi(
				`filter_type=${filter}&filter_query=${q}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
				(data: any) => {
					setTagsList(data.tags);
					setSearchLoading(false);
				},
				() => {
					setSearchLoading(false);
				},
				() => {
					setSearchLoading(false);
					logoutUser(router);
				}
			).then();
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
					setCallApi(val => !val);
					ShowNotification("Success", "success");
				},
				(err) => {
					setCallApi(val => !val);
					ShowNotification(err.error, "error");
				},
				() => {
					setCallApi(val => !val);
					logoutUser(router);
				}
			);
		} else {
			await deleteTagApi(
				id,
				() => {
					setCallApi(val => !val);
					ShowNotification("Success", "success");
				},
				(err) => {
					setCallApi(val => !val);
					ShowNotification(err.error, "error");
				},
				() => {
					setCallApi(val => !val);
					logoutUser(router);
				}
			);
		}
	};

	const columns = [
		"Index",
		"Tag Id",
		"Name",
		"Created At",
		"Created By",
		"Disable",
		"Action",
	];

	const rows = tagsList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.tag_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td>{element.created_by.name}</Table.Td>
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
		<MainComponent>
			<DashboardPageHeader
				total={total}
				title="Tags"
				filter={filter}
				idLabel="Tag Id"
				idVariable="tag_id"
				setFilter={setFilter}
				buttonTitle="Add Tag"
				loading={searchLoading}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				onClick={() => handleAddOpenModal("", "")}
				setOption={(option) => setFilter(option.value)}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					setOrderBy(selected.value);
					setOrder(selected.direction);
				}}
			/>

			{
				loading ?
					<LoadingOverlayComponent /> :
					tagsList.length === 0 ?
						<NoDataFound /> :
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
										onChange={setPage}
										total={Math.ceil(total / 15)}
									/>
								</CenterComponent>
							</BoxComponent>
						</BoxComponent>
			}

			{openAddModal &&
				<AddTagModal
					tagId={tagId}
					isOpen={openAddModal}
					setCallApi={setCallApi}
					initialTagValue={tagName}
					onClose={() => setOpenAddModal(false)}
				/>
			}
		</MainComponent>
	);
};

export default TagsContainer;
