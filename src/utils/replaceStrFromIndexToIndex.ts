export function replaceStrFromIndexToIndex(
	input: string,
	start: number,
	end: number,
	replaceWith: string,
) {
	const output =
		input.substring(0, start) + replaceWith + input.substring(end + 1);

	return {
		string: output,
		offset: output.length - input.length,
	};
}
