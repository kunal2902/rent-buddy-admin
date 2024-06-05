"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Badge, SimpleGrid } from "@mantine/core";
import { useRouter } from "next/navigation";
import { CardComponent, GroupComponent, MainComponent, PageHeader, TextComponent } from "@/components";
import { StackComponent } from "@/components/mantine/stack_component";
import { appColor, getDashboardApi, logoutUser } from "@/utils";
import { dashboardConstants } from "@/constants";
import { DashboardModel } from "@/models";

const DashboardContainer = () => {
	const router = useRouter();
	const [data, setData] = useState<Array<DashboardModel>>([]);

	useEffect(() => {
		getDashboardApi("", (result) => {
				const tempList: Array<DashboardModel> = [];
				Object.keys(result).forEach((key) => {
					tempList.push({ key, value: result[key] });
				});
				setData(tempList);
			}, () => {
			}, () => {
				logoutUser(router);
			}
		).then();
	}, []);

	return (
		<MainComponent>
			<GroupComponent className="m-3" align="center" justify="space-between">
				<PageHeader title="Dashboard" />
			</GroupComponent>

			<SimpleGrid
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
						// @ts-ignore
						const { Icon, title } = dashboardConstants[key.key];
						console.log("Rendering card for key:", key.key, "with title:", title);
						return (
							<CardComponent shadow="sm" padding="lg" key={key.key}>
								<StackComponent>
									<GroupComponent mt="md" mb="xs">
										<Icon />
										<TextComponent fw={700} size="xl" text={title} />
									</GroupComponent>
									<GroupComponent justify="end">
										<Badge
											color={appColor}
											size="xl"
											circle
										>
											{key.value}
										</Badge>
									</GroupComponent>
								</StackComponent>
							</CardComponent>
						);
					})
				}

			</SimpleGrid>
		</MainComponent>
	);
};

export default DashboardContainer;
