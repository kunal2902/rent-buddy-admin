"use client";

import React from "react";
import { appLogoHeight, appLogoWidth, appName, dashboardRoute, getSurfaceColor, useThemeProvider } from "@/utils";
import { ButtonComponent, ImageComponent, StackComponent, TextComponent, TitleComponent } from "@/components";
import NotFoundHero from "@/public/illustrations/404.png";
import Logo from "@/public/images/logo.png";

export const NotFoundComponent = () => {
	const { darkMode } = useThemeProvider();

	return (
		<StackComponent
			p={32}
			align="center"
			className="w-96 sm:max-w-[420px] rounded-lg"
			style={getSurfaceColor(darkMode)}
		>
			<ImageComponent
				src={Logo.src}
				w={appLogoWidth}
				h={appLogoHeight}
			/>

			<TitleComponent title={appName} order={3} />

			<TitleComponent title="Page not found!" order={1} />

			<TextComponent
				c="dimmed"
				ta="center"
				text="Sorry, we couldn&apos;t find the page you’re looking for.
				Perhaps you’ve mistyped the URL?
				Be sure to check your spelling."
			/>

			<ImageComponent
				w={400}
				h={300}
				src={NotFoundHero.src}
			/>

			<ButtonComponent
				mt={10}
				title="Go to Home"
				href={dashboardRoute}
			/>
		</StackComponent>
	);
};
