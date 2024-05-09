import { useState } from "react";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import { getTagApi, onTextInputChange, sidebarStateAtom, toggleBooleanState } from "@/utils";

export const useTagsContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);
	const [isCreateTagModalOpen, setIsCreateTagModalOpen] =
		useState<boolean>(false);

	return {
		isSidebarOpen,
		isCreateTagModalOpen,
		toggleCreateModalTagOpen: toggleBooleanState(setIsCreateTagModalOpen),
	};
};

export const useCreateTagModal = () => {
	const [tagName, setTagName] = useState<string>("");

	const hanldeTag = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		const body = {
			tag: tagName,
		};
		try {
			await getTagApi(
				body.tag,
				(result: any) => {
					if (result.code === 200) {
						console.log("success");
						toast.success("Tag name added");
					} else {
						console.log({ result });
						console.log("Error");
					}
				},
				() => {},
				() => {}
			);
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return {
		tagName,
		onTagNameChange: onTextInputChange(setTagName),
	};
};
