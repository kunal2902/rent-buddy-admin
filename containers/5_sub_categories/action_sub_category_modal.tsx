"use-client";

import { Dispatch, SetStateAction } from "react";
import { ButtonComponent, ModalComponent } from "@/components";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	handleActionSubCat: () => void;
	subCatType: string;
	isDisable: boolean;
}

const ActionSubCategoryModal = (props: Props) => {
    const { isOpen, onClose, handleActionSubCat, subCatType, isDisable } = props;

    return (
	<ModalComponent opened={isOpen} onClose={onClose} className="border-grey-800" title="Action sub category">
		Are you sure want to {isDisable === true && subCatType === "disable" ? "disable" : subCatType === "delete" ? "delete" : "enable"}this sub category?
		<div className="mt-1 flex items-center justify-end">
			<ButtonComponent size="md" variant="subtle" title="No" color="red" px={5} mr={5} onClick={onClose} />
			<ButtonComponent title="Yes" size="md" px={5} ml={5} onClick={handleActionSubCat} />
		</div>
	</ModalComponent>
    );
};

export default ActionSubCategoryModal;
