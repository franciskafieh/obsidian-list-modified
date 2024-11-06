export function fillLineXToYWithContent(
	originalText: string[],
	lineX: number,
	lineY: number,
	content: string[]
): { filled: string[]; lineOffset: number } {
	// placeholder does not exist or does not have ending
	if (lineX === -1 || lineY === -1) {
		return { filled: originalText, lineOffset: -1 };
	}

	// normal array up to lineX
	const before = originalText.slice(0, lineX);
	// normal array from lineY to the end
	const after = originalText.slice(lineY + 1);

	const filled = [...before, ...content, ...after];
	const lineOffset = filled.length - originalText.length;

	return { filled, lineOffset };
}
