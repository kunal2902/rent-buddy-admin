"use client";

import { SolidBtn, TextInput } from "@/components/elements";
import { useLoginContainer } from "./hook";

const LoginContainer = () => {
	const { email, onEmailChange, password, onPasswordChange } =
		useLoginContainer();

	return (
		<div className="w-full sm:max-w-[450px] flex flex-col bg-light-background-paper rounded-xl px-9 py-10 shadow-md shadow-grey-500/40">
			<h1 className="text-2xl font-semibold text-light-primary-text">
				Sign in to NCA
			</h1>

			<hr className="mt-5 border-t border-t-grey-400" />

			<TextInput
				title="Email"
				value={email}
				onChange={onEmailChange}
				className="mt-5"
				placeholder="abc@gmail.com"
			/>

			<TextInput
				title="Password"
				value={password}
				onChange={onPasswordChange}
				className="mt-5"
				placeholder="******"
			/>

			<SolidBtn
				title="Login"
				className="mt-5 py-3 rounded-lg"
				titleClassName="font-medium"
			/>
		</div>
	);
};

export default LoginContainer;
