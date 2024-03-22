"use client";

import { Modal } from "@/components/common";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const CreateTagModal = (props: Props) => {
    const { isOpen, onClose } = props;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h1>Create A Tag</h1>
        </Modal>
    )
}

export default CreateTagModal;
