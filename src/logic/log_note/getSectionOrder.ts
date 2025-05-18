import { ListType } from "../../types";

export function getSectionOrder(
	dividerPositions: Record<ListType, { start: number; end: number }>
): ListType[] {
	// filter out sections with invalid positions and sort by start pos
	return Object.entries(dividerPositions)
		.filter(([_, pos]) => pos.start !== -1 && pos.end !== -1)
		.map(([type, pos]) => ({
			type: type as ListType,
			start: pos.start,
		}))
		.sort((a, b) => a.start - b.start)
		.map((s) => s.type);
}
