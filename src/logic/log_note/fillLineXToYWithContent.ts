export function fillLineXToYWithContent(
	originalText: string[],
	lineX: number,
	lineY: number,
	content: string[],
) {
	// placeholder does not exist or does not have ending
	if (lineX === -1 || lineY === -1) {
		return originalText;
	}

	// normal array up to lineX
	const before = originalText.slice(0, lineX);
	// normal array from lineY to the end
	const after = originalText.slice(lineY + 1);

	const combined = [...before, ...content, ...after];
	return combined;
}
