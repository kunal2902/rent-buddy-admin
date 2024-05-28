"use client";

import React from "react";
import { GroupComponent, MainComponent, TitleComponent } from "@/components";
import { getName } from "@/utils";

const DashboardContainer = () => (
	<MainComponent>
		<GroupComponent className="m-3" align="center" justify="space-between">
			<TitleComponent title={`Hi, Welcome back, ${getName()}`} />
		</GroupComponent>
	</MainComponent>
);

export default DashboardContainer;
