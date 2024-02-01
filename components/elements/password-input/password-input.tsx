"use client";

import { LucideIcon, Eye, EyeOff } from "lucide-react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface Props {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isPasswordVisible: boolean;
	togglePasswordVisibility: (
		e?: React.MouseEvent<HTMLButtonElement> | undefined
	) => void;
	title: string;
	VisibleIcon?: LucideIcon | IconType;
	InvisibleIcon?: LucideIcon | IconType;
	visibleIconSize?: number;
	visibleIconClassName?: string;
	invisibleIconSize?: number;
	invisibleIconClassName?: string;
	titleClassName?: string;
	className?: string;
	inputClassName?: string;
	inputDivClassName?: string;
	placeholder?: string;
}

const PasswordInput = (props: Props) => {
	const {
		value,
		onChange,
		isPasswordVisible,
		title,
		VisibleIcon,
		InvisibleIcon,
		visibleIconSize,
		visibleIconClassName,
		invisibleIconClassName,
		invisibleIconSize,
		inputClassName,
		className,
		titleClassName,
		inputDivClassName,
		placeholder,
		togglePasswordVisibility,
	} = props;

	return (
		<div className={twMerge("w-full flex flex-col", className)}>
			<p
				className={twMerge(
					"font-public-sans text-light-primary-text text-sm",
					titleClassName
				)}
			>
				{title}
			</p>

			<div
				className={twMerge(
					"relative mt-3 w-full flex",
					inputDivClassName
				)}
			>
				<input
					className={twMerge(
						"w-full pl-4 pr-8 border-2 border-grey-200 hover:border-gray-800 focus:border-primary-main py-3 rounded-lg outline-none text-lg font-base text-light-primary-text placeholder:text-light-secondary-text font-light",
						inputClassName
					)}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					type={isPasswordVisible ? "text" : "password"}
				/>

				<button
					className="absolute top-0.5 bottom-0.5 right-2.5"
					onClick={togglePasswordVisibility}
				>
					{isPasswordVisible ? (
						<>
							{VisibleIcon ? (
								<VisibleIcon
									size={visibleIconSize ?? 22}
									className={twMerge(
										"transition-none text-light-primary-text",
										visibleIconClassName
									)}
								/>
							) : (
								<EyeOff
									size={visibleIconSize ?? 22}
									className={twMerge(
										"transition-none text-light-primary-text",
										visibleIconClassName
									)}
								/>
							)}
						</>
					) : (
						<>
							{InvisibleIcon ? (
								<InvisibleIcon
									size={invisibleIconSize ?? 22}
									className={twMerge(
										"transition-none text-light-primary-text",
										invisibleIconClassName
									)}
								/>
							) : (
								<Eye
									size={invisibleIconSize ?? 22}
									className={twMerge(
										"transition-none text-light-primary-text",
										invisibleIconClassName
									)}
								/>
							)}
						</>
					)}
				</button>
			</div>
		</div>
	);
};

export default PasswordInput;
