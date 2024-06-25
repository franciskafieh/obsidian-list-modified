export function convertCommaListToArray(input: string) {
	return input
		.split(",")
		.map((i) => i.trim())
		.filter((i) => i !== "");
}
