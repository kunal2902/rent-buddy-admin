import { SolidBtn, SolidBtnProps } from "@/components/elements";
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
			buttonProps: SolidBtnProps;
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
