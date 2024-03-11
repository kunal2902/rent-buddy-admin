import { useRouter } from "next/navigation";

export const useCreateCategoryScreen = () => {
	const router = useRouter();

	const onBackClick = () => {
		router.back();
	};

	return {
		onBackClick,
	};
};
