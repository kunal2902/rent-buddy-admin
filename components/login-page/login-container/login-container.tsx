"use client";

import { PasswordInput, SolidBtn, TextInput } from "@/components/elements";
import { useLoginContainer } from "./hook";
import Link from "next/link";
import { login } from "@/utils/api-utils/network-utils";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LoginContainer = () => {
	const {
		email,
		onEmailChange,
		password,
		onPasswordChange,
		isPasswordVisible,
		togglePasswordVisibility,
	} = useLoginContainer();
	const router = useRouter();
	console.log("routr", router);

	const handleLogin = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		const body = {
			email: email,
			password: password,
		};
		try {
			await login(
				body.email,
				body.password,
				(data: any) => {
					localStorage.setItem("crm_token", data.data.authToken);
					sessionStorage.setItem("crm_token", data.data.authToken);
					router.push("/");
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
			<div className="w-full sm:max-w-[420px] flex flex-col bg-light-background-paper rounded-xl px-9 py-10 shadow-md shadow-grey-500/40">
				<h1 className="text-2xl font-semibold text-light-primary-text">
					Sign in to NCA
				</h1>

				<div className="w-full flex text-sm mt-4">
					<p className="text-grey-800">{"Don't have an account?"}</p>
					<Link href="#" className="ml-1">
						<p className="underline text-primary-main">
							Get Started
						</p>
					</Link>
				</div>

				<hr className="mt-5 border-t border-t-grey-400" />

				<TextInput
					title="Email"
					value={email}
					onChange={onEmailChange}
					className="mt-6"
					placeholder="abc@gmail.com"
					inputClassName="border-2"
				/>

				<PasswordInput
					title="Password"
					value={password}
					onChange={onPasswordChange}
					className="mt-6"
					placeholder="******"
					isPasswordVisible={isPasswordVisible}
					togglePasswordVisibility={togglePasswordVisibility}
					visibleIconSize={20}
					invisibleIconSize={20}
					inputClassName="border-2"
				/>

				<div className="w-full flex justify-end">
					<Link href="#">
						<p className="text-sm mt-6 hover:underline text-primary-main font-public-sans fade-transition">
							Forgot Password?
						</p>
					</Link>
				</div>

				<SolidBtn
					title="Login"
					className="mt-6 py-3 rounded-lg"
					titleClassName="font-medium"
				/>
			</div>
		</form>
	);
};

export default LoginContainer;
