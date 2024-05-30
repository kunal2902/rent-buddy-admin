import React from "react";
import { GroupComponent, TitleComponent } from "@/components";

export interface PageHeaderProps {
	title: string;
}

export const PageHeader = (props: PageHeaderProps) => (
	<GroupComponent className="m-3" align="center" justify="space-between">
		<TitleComponent title={props.title} />
	</GroupComponent>
);
