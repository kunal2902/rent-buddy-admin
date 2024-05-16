"use-client";

import { Dispatch, SetStateAction } from "react";
import { ButtonComponent, ModalComponent } from "@/components";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	handleActionCustomAttribute: () => void;
	customAttributeType: string;
	isDisable: boolean;
}

const ActionCustomAttributeModal = (props: Props) => {
    const { isOpen, onClose, handleActionCustomAttribute, customAttributeType, isDisable } = props;

    return (
	<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="Action custom attribute">
		Are you sure want to {isDisable === true && customAttributeType === "disable" ? "disable" : customAttributeType === "delete" ? "delete" : "enable"} this custom attribute?
		<div className="mt-1 flex items-center justify-end">
			<ButtonComponent size="md" variant="subtle" title="No" color="red" px={5} mr={5} onClick={onClose} />
			<ButtonComponent title="Yes" size="md" px={5} ml={5} onClick={handleActionCustomAttribute} />
		</div>
	</ModalComponent>
    );
};

export default ActionCustomAttributeModal;
