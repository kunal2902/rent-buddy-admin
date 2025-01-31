"use client";

import React, { useEffect, useRef, useState } from "react";
import { Table } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { MdOutlineEdit } from "react-icons/md";
import { useRouter } from "next/navigation";
import {
	ActionIconComponent,
	BoxComponent,
	CenterComponent,
	DashboardPageHeader, GroupComponent,
	LoadingOverlayComponent,
	MainComponent,
	NoDataFound,
	PaginationComponent,
	PaperComponent, PopConfirmComponent, PopConfirmType,
	SortButtonComponentItemProps,
} from "@/components";
import { CustomerModel } from "@/models";
import {
	deleteCustomerApi,
	disableCustomerApi,
	formatDate, getCustomerApi,
	getUserId, logoutUser,
} from "@/utils";
import AddCustomerModal from "@/containers/9_customers/add_customer_modal";
import ShowNotification from "@/components/mantine/show_notification";
import { checkPermissions } from "@/components/custom/check_permission_entities";

const CustomersContainer = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const [customerId, setCustomerId] = useState("");
	const [order, setOrder] = useState<string>("asc");
	const [filter, setFilter] = useState<string>("name");
	const [pageSize, setPageSize] = useState<number>(15);
	const [callApi, setCallApi] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchValue, setSearchValue] = useState<string>("");
	const [orderBy, setOrderBy] = useState<string>("customer_id");
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);
	const [customerInitialName, setCustomerInitialName] = useState("");
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [customersList, setCustomersList] = useState<CustomerModel[]>([]);
	const [customerInitialPhoneNumber, setCustomerInitialPhoneNumber] = useState("");
	const [customerInitialAddress, setCustomerInitialAddress] = useState<string | undefined>("");
	const [customerInitialCity, setCustomerInitialCity] = useState<string | undefined>("");
	const [customerInitialState, setCustomerInitialState] = useState<string | undefined>("");
	const [customerInitialPinCode, setCustomerInitialPinCode] = useState<string | undefined>("");
	const [customerInitialEmail, setCustomerInitialEmail] = useState<string | undefined>();
	const currentQueryRef = useRef(searchValue);

	const canDeleteCustomer = checkPermissions("customer", ["delete"]);
	const canUpdateCustomer = checkPermissions("customer", ["update"]);
	const canCreateCustomer = checkPermissions("customer", ["create"]);
	const canDisableCustomer = checkPermissions("customer", ["disable"]);

	useEffect(() => {
		initState().then();
	}, [filter, page, callApi, orderBy, order]);

	useEffect(() => {
		currentQueryRef.current = searchValue;
	}, [searchValue]);

	const initState = async () => {
		setLoading(true);
		await getCustomerApi(
			`filter_type=${filter}&filter_query=${searchValue}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
			(data: any) => {
				setCustomersList(data.customers);
				setTotal(data.count);
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

	const handleSearch = useDebouncedCallback(async (query: string) => {
		if (query === currentQueryRef.current) {
			setSearchLoading(true);
			await getCustomerApi(
				`filter_type=${filter}&filter_query=${query}&orderBy=${orderBy}&page=${page}&order=${order}&page_size=${pageSize}&page_offset=${(page - 1) * pageSize}`,
				(data: any) => {
					setCustomersList(data.customers);
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

	const handleAddOpenModal = (
		id: string,
		name: string,
		phone: string,
		email?: string,
		address?: string,
		city?: string,
		state?: string,
		pinCode?: string,
	) => {
		setCustomerId(id);
		setCustomerInitialName(name);
		setCustomerInitialEmail(email);
		setCustomerInitialPhoneNumber(phone);
		setCustomerInitialAddress(address);
		setCustomerInitialCity(city);
		setCustomerInitialState(state);
		setCustomerInitialPinCode(pinCode);
		setOpenAddModal(true);
	};

	const handleAction = async (id: string, actionType: string) => {
		if (actionType === "disable") {
			await disableCustomerApi(
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
			await deleteCustomerApi(
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
		"Customer Id",
		"Name",
		"Email",
		"Phone",
		"Created By",
		"Created At",
		...(canDisableCustomer ? ["Disable"] : []),
		...(canUpdateCustomer && canDeleteCustomer ? ["Action"] : []),
	];

	const rows = customersList.map((element, index) => (
		<Table.Tr key={index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{element.customer_id}</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.email}</Table.Td>
			<Table.Td>{element.phone}</Table.Td>
			<Table.Td>{element.created_by_id}</Table.Td>
			<Table.Td>{formatDate(element.created_at)}</Table.Td>
			<Table.Td w={60}>
				{
					getUserId() !== element.customer_id && canDisableCustomer &&
					<PopConfirmComponent
						entityName="user"
						type={PopConfirmType.switch}
						isDisabled={element.is_disabled}
						actionName={element.is_disabled ? "enable" : "disable"}
						onConfirm={async () => handleAction(element.customer_id, "disable")}
					/>
				}
			</Table.Td>
			<Table.Td w={110}>
				<GroupComponent>
					{
						canDeleteCustomer &&
						<PopConfirmComponent
							entityName="user"
							actionName="delete"
							onConfirm={async () => handleAction(element.customer_id, "delete")}
						/>
					}
					{canUpdateCustomer &&
						<ActionIconComponent
							onClick={() => handleAddOpenModal(
								element.customer_id,
								element.name,
								element.phone,
								element.email,
								element.address,
								element.city,
								element.state,
								element.pinCode,
							)}
							size="md">
							<MdOutlineEdit size={18} />
						</ActionIconComponent>
					}
				</GroupComponent>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<MainComponent>
			<DashboardPageHeader
				total={total}
				title="Customers"
				filter={filter}
				idLabel="Customer Id"
				setFilter={setFilter}
				loading={searchLoading}
				idVariable="customer_id"
				buttonTitle="Add Customer"
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				showAddButton={canCreateCustomer}
				setOption={(option) => setFilter(option.value)}
				onClick={() => handleAddOpenModal("", "", "", "", "", "", "", "")}
				onSortSelected={(selected: SortButtonComponentItemProps) => {
					setOrderBy(selected.value);
					setOrder(selected.direction);
				}}
			/>

			{
				loading ?
					<LoadingOverlayComponent /> :
					customersList.length === 0 ?
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
				<AddCustomerModal
					customerId={customerId}
					isOpen={openAddModal}
					onClose={() => setOpenAddModal(false)}
					setCallApi={setCallApi}
					initialValueName={customerInitialName}
					initialValuePhoneNumber={customerInitialPhoneNumber}
					initialValueEmail={customerInitialEmail}
					initialValueAddress={customerInitialAddress}
					initialValueCity={customerInitialCity}
					initialValuePinCode={customerInitialPinCode}
					initialValueState={customerInitialState}
				/>
			}
		</MainComponent>
	);
};

export default CustomersContainer;
