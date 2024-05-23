"use client";

import { twMerge } from "tailwind-merge";
import { ButtonComponent, ButtonComponentProps, TitleComponent } from "@/components";

export type DashboardPageHeaderProps = {
	heading: string;
	className?: string;
	headingClassName?: string;
} & (
	| {
			button?: false;
	}
	| {
			button: true;
			buttonProps: ButtonComponentProps;
	}
);

export const DashboardPageHeader = (props: DashboardPageHeaderProps) => {
	const { button, heading, className, headingClassName } = props;

	return (
		<div
			className={twMerge(
				"flex w-full items-center justify-between font-public-sans px-2",
				className
			)}
		>
			<TitleComponent title={heading} />

			{button && (
				<ButtonComponent
					className={twMerge(
						"bg-grey-900 ml-2 w-fit text-grey-100",
						props.buttonProps.className
					)}
					{...props.buttonProps} />
			)}
		</div>
	);
};
