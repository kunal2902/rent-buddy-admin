"use client";

import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useState } from "react";
import { Fieldset } from "@mantine/core";
import {
	appLogoHeight,
	appLogoWidth,
	appName,
	cookieOptions,
	crmJwtConstant,
	emailConstant,
	getSurfaceColor,
	loginApi,
	mantineRadius,
	nameConstant,
	roleIdConstant,
	userIdConstant,
	userNameConstant,
	useThemeProvider,
} from "@/utils";
import {
	ButtonComponent,
	GroupComponent,
	ImageComponent,
	PasswordInputComponent,
	SpaceComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import Logo from "@/public/images/logo.png";
import { StackComponent } from "@/components/mantine/stack_component";

const LoginContainer = () => {
	const router = useRouter();
	const { darkMode } = useThemeProvider();
	const [loading, setLoading] = useState<boolean>(false);
	const [password, setPassword] = useState<string>("bulai002");
	const [email, setEmail] = useState<string>("simon@admin.com");
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

	const handleLogin = async (event: { preventDefault: () => void }) => {
		setLoading(true);
		event.preventDefault();
		const body = {
			email,
			password,
		};
		try {
			await loginApi(
				body.email,
				body.password,
				(result: any) => {
					setCookie(crmJwtConstant, result.data.authToken, cookieOptions);
					setCookie(userIdConstant, result.data.user.user_id, cookieOptions);
					setCookie(nameConstant, result.data.user.name, cookieOptions);
					setCookie(emailConstant, result.data.user.email, cookieOptions);
					setCookie(userNameConstant, result.data.user.username, cookieOptions);
					setCookie(roleIdConstant, result.data.user.role_id, cookieOptions);
					router.replace("/");
					setTimeout(() => {
						setLoading(false);
					}, 1500);
				},
				(err: any) => {
					setLoading(false);
					console.log(err.message);
					// toast.error(err);
				}
			);
		} catch (error) {
			setLoading(false);
			console.error("Login failed:", error);
		}
	};

	return (
		<form onSubmit={handleLogin}>
			<div
				className="w-96 sm:max-w-[420px] flex flex-col rounded-xl p-8 shadow-md shadow-grey-500/40"
				style={getSurfaceColor(darkMode)}
			>
				<StackComponent align="center">
					<ImageComponent
						src={Logo.src}
						w={appLogoWidth}
						h={appLogoHeight}
					/>
					<TitleComponent title={appName} order={3} />
				</StackComponent>

				<SpaceComponent showHeight />

				<Fieldset legend="Sign in to Continue" radius={mantineRadius}>

					<TextInputComponent
						mt={6}
						label="Email"
						value={email}
						setValue={setEmail}
						placeholder="abc@gmail.com"
					/>

					<SpaceComponent showHeight />

					<PasswordInputComponent
						mt={6}
						label="Password"
						value={password}
						placeholder="******"
						setValue={setPassword}
						visible={isPasswordVisible}
						onVisibilityChange={setIsPasswordVisible}
					/>

					<SpaceComponent showHeight />

				</Fieldset>

				<SpaceComponent showHeight />

				<GroupComponent justify="end">
					<ButtonComponent
						m={0}
						px={0}
						py={0}
						variant="subtle"
						onClick={() => {}}
						title="Forgot Password?" />
				</GroupComponent>

				<ButtonComponent
					title="Login"
					loading={loading}
					onClick={handleLogin}
				/>
			</div>
		</form>
	);
};

export default LoginContainer;
