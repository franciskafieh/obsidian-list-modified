export function removeDividers(text: string): string {
	return text
		.split("\n")
		.filter((line) => !(line.startsWith("%% ") && line.endsWith(" %%")))
		.join("\n");
}
