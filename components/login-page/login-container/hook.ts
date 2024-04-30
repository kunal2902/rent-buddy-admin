import { useState } from "react";

export const useLoginContainer = () => {
	const [email, setEmail] = useState<string>("simon@admin.com");
	const [password, setPassword] = useState<string>("bulai002");
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

	const onTextChange =
		(setState: React.Dispatch<React.SetStateAction<string>>) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setState(e.target.value);
		};

	const toggleBooleanState =
		(setState: React.Dispatch<React.SetStateAction<boolean>>) => () => {
			setState((prev) => !prev);
		};

	return {
		email,
		onEmailChange: onTextChange(setEmail),
		password,
		onPasswordChange: onTextChange(setPassword),
		isPasswordVisible,
		togglePasswordVisibility: toggleBooleanState(setIsPasswordVisible),
	};
};
