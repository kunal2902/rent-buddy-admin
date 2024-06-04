"use client";

import React from "react";
import { GroupComponent, MainComponent, PageHeader } from "@/components";

const DashboardContainer = () => (
	<MainComponent>
		<GroupComponent className="m-3" align="center" justify="space-between">
			<PageHeader title="Dashboard" />
		</GroupComponent>
	</MainComponent>
);

export default DashboardContainer;
