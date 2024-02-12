import { SolidBtn } from "@/components/elements";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

type Props = {
	heading: string;
	className?: string;
	headingClassName?: string;
} & (
	| {
			button?: false;
	  }
	| {
			button: true;
			buttonProps: {
				className?: string;
				onClick?: (
					e?: React.MouseEvent<HTMLButtonElement> | undefined
				) => void;
				title: string;
				titleClassName?: string;
				LeftIcon?: LucideIcon | IconType;
				leftIconSize?: number;
				leftIconClassName?: string;
				RightIcon?: LucideIcon | IconType;
				rightIconSize?: number;
				rightIconClassName?: string;
			};
	  }
);

const DashboardPageHeader = (props: Props) => {
	const { button, heading, className, headingClassName } = props;

	return (
		<div
			className={twMerge(
				"flex w-full items-center justify-between font-public-sans px-2",
				className
			)}
		>
			<h1
				className={twMerge(
					"text-2xl font-semibold text-light-primary-text",
					headingClassName
				)}
			>
				{heading}
			</h1>

			{button && (
				<SolidBtn
					className={twMerge(
						"bg-grey-900 ml-2 w-fit text-grey-100",
						props.buttonProps.className
					)}
					{...props.buttonProps}
				/>
			)}
		</div>
	);
};

export default DashboardPageHeader;
