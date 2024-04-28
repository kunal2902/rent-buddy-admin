export const onSelectInputChange =
	<T = string>(setState: React.Dispatch<React.SetStateAction<T>>) =>
	(value: T) =>
		setState(value);
