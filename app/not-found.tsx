import Image from 'next/image';
import { AuthNavbar, ButtonComponent } from '@/components';
import NotFoundHero from '@/public/illustrations/404.png';

const NotFoundPage = () => (
	<>
		<AuthNavbar />
		<main className="w-full min-h-screen flex bg-gradient-to-r from-light-background-natural to-light-background-default flex-col items-center justify-center font-public-sans px-4 pt-8">
			<h1 className="text-3xl text-light-primary-text font-semibold">
				Sorry, page not found!
			</h1>

			<p className="w-full max-w-[450px] text-center mt-5 text-light-disabled-text font-light">
				Sorry, we couldn’t find the page you’re looking for.
				Perhaps you’ve mistyped the URL?
				Be sure to check your spelling.
			</p>

			<Image
				src={NotFoundHero.src}
				width={400}
				height={300}
				className="w-80 h-60 object-contain mt-10"
				alt="404 Image"
			/>

			<ButtonComponent
				className="w-fit px-5 py-3 mt-6 bg-primary-main hover:bg-primary-main/90"
				href="/"
				title="Go to Home"
			/>
		</main>
	</>
);

export default NotFoundPage;
