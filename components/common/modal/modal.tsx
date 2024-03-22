import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { PointerDownOutSideEvent } from "@/types/events";
import { twMerge } from "tailwind-merge";

interface Props {
	children: React.ReactNode;
	className?: string;
	overlayClassName?: string;
	isOpen: boolean;
	onClose: () => void;
	onEscapeKeyDown?: () => void;
	onOverlayClick?: (e: PointerDownOutSideEvent) => void;
}

const Modal = (props: Props) => {
	const {
		children,
		className,
		isOpen,
		onClose,
		onEscapeKeyDown,
		onOverlayClick,
		overlayClassName,
	} = props;

	const onDefaultEscapeKeyDown = () => true;
	const onDefaultOverlayClick = () => {};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogOverlay
				className={twMerge(
					"bg-light-background-paper/70 px-3",
					overlayClassName
				)}
			/>
			<DialogContent
				className={twMerge("w-screen", className)}
				onEscapeKeyDown={onEscapeKeyDown ?? onDefaultEscapeKeyDown}
				onPointerDownOutside={onOverlayClick ?? onDefaultOverlayClick}
			>
				{children}
			</DialogContent>
		</Dialog>
	);
};

export default Modal;
