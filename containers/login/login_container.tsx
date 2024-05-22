"use client";

import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useState } from "react";
import {
	loginApi,
	crmJwtConstant,
	emailConstant,
	nameConstant,
	roleIdConstant,
	userIdConstant,
	userNameConstant, cookieOptions,
} from "@/utils";
import {
	TextInputComponent,
	PasswordInputComponent, ButtonComponent,
} from "@/components";

const LoginContainer = () => {
	const [email, setEmail] = useState<string>("simon@admin.com");
	const [password, setPassword] = useState<string>("bulai002");
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	const router = useRouter();

	const handleLogin = async (event: { preventDefault: () => void }) => {
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
					if (result.code === 200) {
						setCookie(crmJwtConstant, result.data.authToken, cookieOptions);
						setCookie(userIdConstant, result.data.user.user_id, cookieOptions);
						setCookie(nameConstant, result.data.user.name, cookieOptions);
						setCookie(emailConstant, result.data.user.email, cookieOptions);
						setCookie(userNameConstant, result.data.user.username, cookieOptions);
						setCookie(roleIdConstant, result.data.user.role_id, cookieOptions);
						router.replace("/");
					} else {
						console.log({ result });
						console.log("Error");
					}
				},
				(err: any) => {
					toast.error(err);
				}
			);
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return (
		<form onSubmit={handleLogin}>
			<div
				className="w-full sm:max-w-[420px] flex flex-col bg-light-background-paper rounded-xl px-12 py-10 shadow-md shadow-grey-500/40">
				<h1 className="text-2xl font-semibold text-light-primary-text">
					Sign in to NCA
				</h1>

				<div className="w-full flex text-sm mt-4">
					<p className="text-grey-800">Don&apos;t have an account?</p>
					<Link href="#" className="ml-1">
						<p className="underline text-primary-main">
							Get Started
						</p>
					</Link>
				</div>

				<hr className="mt-5 border-t border-t-grey-400" />

				<TextInputComponent
					mt={6}
					label="Email"
					value={email}
					variant="filled"
					setValue={setEmail}
					placeholder="abc@gmail.com"
				/>

				<PasswordInputComponent
					mt={6}
					label="Password"
					value={password}
					placeholder="******"
					setValue={setPassword}
					visible={isPasswordVisible}
					onVisibilityChange={setIsPasswordVisible}
				/>

				<div className="w-full flex justify-end">
					<Link href="#">
						<p className="text-sm mt-6 hover:underline text-primary-main font-public-sans fade-transition">
							Forgot Password?
						</p>
					</Link>
				</div>

				<ButtonComponent
					mt={6}
					py={3}
					title="Login"
					onClick={handleLogin}
					titleClassName="font-medium"
				/>
			</div>
		</form>
	);
};

export default LoginContainer;
