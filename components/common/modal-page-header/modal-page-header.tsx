"use client";

import { SolidBtn, type SolidBtnProps } from "@/components/elements";
import { twMerge } from "tailwind-merge";

type Props = (
	| {
			leftButton?: false;
	  }
	| {
			leftButton: true;
			leftButtonProps: SolidBtnProps;
	  }
) &
	(
		| {
				rightButton?: false;
		  }
		| {
				rightButton: true;
				rightButtonProps: SolidBtnProps;
		  }
	) & {
		className?: string;
	};

const ModalPageHeader = (props: Props) => {
	const { leftButton, rightButton, className } = props;

	return (
		<div
			className={twMerge(
				`w-full flex px-5 items-center ${
					rightButton && !leftButton
						? "justify-end"
						: "justify-between"
				} pt-2`,
				className
			)}
		>
			{leftButton && <SolidBtn {...props.leftButtonProps} />}

			{rightButton && <SolidBtn {...props.rightButtonProps} />}
		</div>
	);
};

export default ModalPageHeader;
