import React from "react";
import { MainNavbar, MainSidebar } from "@/components";
import { ActivityLogsContainer } from "@/containers";

const ActivityLogs = () => (
	<>
		<MainNavbar />
		<MainSidebar />
		<ActivityLogsContainer />
	</>
);

export default ActivityLogs;
