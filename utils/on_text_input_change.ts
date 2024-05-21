import React from "react";

export const onTextInputChange =
	(setState: React.Dispatch<React.SetStateAction<string>>) =>
		(e: string) =>
			setState(e.target.value);
