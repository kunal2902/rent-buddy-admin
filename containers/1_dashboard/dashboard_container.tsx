"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	BadgeComponent,
	CardComponent,
	GroupComponent,
	LoadingOverlayComponent,
	MainComponent,
	NoDataFound,
	PageHeader,
	SimpleGridComponent,
	StackComponent,
	TitleComponent,
} from "@/components";
import { getDashboardApi, logoutUser } from "@/utils";
import { dashboardConstants } from "@/constants";
import { DashboardModel } from "@/models";

const DashboardContainer = () => {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(true);
	const [data, setData] = useState<Array<DashboardModel>>([]);

	useEffect(() => {
		getDashboardApi(
			"",
			(result) => {
				const tempList: Array<DashboardModel> = [];
				Object.keys(result).forEach((key) => {
					tempList.push({
						key,
						value: result[key],
					});
				});
				setData(tempList);
			},
			() => {
			},
			() => {
				logoutUser(router);
			}
		).then(() => {
			setLoading(false);
		});
	}, []);

	return (
		<MainComponent>
			<GroupComponent className="m-3" align="center" justify="space-between">
				<PageHeader title="Dashboard" />
			</GroupComponent>
			{
				loading ?
					<LoadingOverlayComponent /> :
					data.length === 0 ?
						<NoDataFound /> :
						<SimpleGridComponent
							cols={{
								base: 1,
								sm: 2,
								md: 3,
								lg: 5,
								xl: 5,
							}}
							className="mx-3">
							{
								data.map((key): ReactNode => {
									const {
										Icon,
										title,
									} = dashboardConstants[key.key];
									return (
										<CardComponent shadow="sm" key={key.key}>
											<StackComponent>
												<GroupComponent mb="xs">
													<Icon />
													<TitleComponent fw={700} size="xl" title={title} />
												</GroupComponent>
												<GroupComponent justify="end">
													<BadgeComponent size="xl">
														<TitleComponent
															mx={10}
															my={15}
															fw={600}
															c="white"
															size={22}
															title={key.value}
														/>
													</BadgeComponent>
												</GroupComponent>
											</StackComponent>
										</CardComponent>
									);
								})
							}
						</SimpleGridComponent>
			}
		</MainComponent>
	);
};

export default DashboardContainer;
