import { useState } from "react";

export const useLoginContainer = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const onTextChange =
		(setState: React.Dispatch<React.SetStateAction<string>>) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setState(e.target.value);
		};

	return {
		email,
		onEmailChange: onTextChange(setEmail),
		password,
		onPasswordChange: onTextChange(setPassword),
	};
};
