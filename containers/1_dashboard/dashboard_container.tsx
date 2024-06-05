"use client";

import React from "react";
import { Badge, Button, Card, Group, Image, Table, Text } from "@mantine/core";
import {
	BoxComponent,
	CenterComponent,
	GroupComponent,
	MainComponent,
	NoDataFound,
	PageHeader, PaginationComponent,
	PaperComponent, SimpleGridComponent,
} from "@/components";
import { StackComponent } from "@/components/mantine/stack_component";

const DashboardContainer = () => (
	<MainComponent>
		<GroupComponent className="m-3" align="center" justify="space-between">
			<PageHeader title="Dashboard" />
			<BoxComponent style={{ overflow: "hidden" }} className="mx-3">
				<BoxComponent mx="auto">
					<GroupComponent grow>
						<StackComponent>
							<SimpleGridComponent
								cols={{
									base: 1,
									sm: 2,
									md: 3,
									lg: 3,
									xl: 3,
								}}
							>
								<Card shadow="sm" padding="lg" radius="md" withBorder>
									<Card.Section>

									</Card.Section>

									<Group justify="space-between" mt="md" mb="xs">
										<Text fw={500}>Norway Fjord Adventures</Text>
										<Badge color="pink">On Sale</Badge>
									</Group>

									<Text size="sm" c="dimmed">
										With Fjord Tours you can explore more
										of the magical fjord landscapes with tours and
										activities on and around the fjords of Norway
									</Text>

									<Button color="blue" fullWidth mt="md" radius="md">
										Book classic tour now
									</Button>
								</Card>
							</SimpleGridComponent>
						</StackComponent>
					</GroupComponent>
				</BoxComponent>
			</BoxComponent>
		</GroupComponent>
	</MainComponent>
);

export default DashboardContainer;
