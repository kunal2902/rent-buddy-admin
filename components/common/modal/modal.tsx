import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { SolidBtn, SolidBtnProps } from "@/components/elements";
import { twMerge } from "tailwind-merge";

const Modal = ({ className, children }: any) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<SolidBtn
					className={twMerge("bg-grey-900 ml-2 w-fit text-grey-100")}
					title="Open Modal"
				/>
			</DialogTrigger>
			<DialogContent className={className}>
				{children}
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently
						delete your account and remove your data from our
						servers.
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default Modal;
