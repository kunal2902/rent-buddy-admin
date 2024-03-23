"use client";

import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface Props {
	title: string;
	titleClassName?: string;
	className?: string;
	onClose: () => void;
	buttonClassName?: string;
}

const ModalHeader = (props: Props) => {
	const { title, titleClassName, className, onClose, buttonClassName } =
		props;

	return (
		<div
			className={twMerge(
				"w-full flex items-center justify-between font-public-sans",
				className
			)}
		>
			<h1
				className={twMerge(
					"text-xl font-medium flex-1",
					titleClassName
				)}
			>
				{title}
			</h1>

			<button
				className={twMerge(
					"text-light-secondary-text hover:text-light-primary-text ml-1 transition-none",
					buttonClassName
				)}
				onClick={onClose}
			>
				<X size={22} />
			</button>
		</div>
	);
};

export default ModalHeader;
