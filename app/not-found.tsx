import { NotFoundComponent } from "@/components";
import { getBackgroundColor, getDarkMode } from "@/utils";

const NotFoundPage = () => (
	<>
		<main
			className="w-full min-h-screen flex flex-col items-center justify-center font-public-sans px-4 pt-8"
			style={getBackgroundColor(getDarkMode() === "dark")}>
			<NotFoundComponent />
		</main>
	</>
);

export default NotFoundPage;
