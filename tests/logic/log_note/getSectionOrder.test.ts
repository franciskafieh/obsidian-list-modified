import { describe, it, expect } from "bun:test";
import { getSectionOrder } from "../../../src/logic/log_note/getSectionOrder";
import { ListType } from "../../../src/types";

describe("getSectionOrder", () => {
	it("should order sections by their start position", () => {
		const dividerPositions = {
			modified: { start: 10, end: 15 },
			created: { start: 5, end: 8 },
			deleted: { start: 20, end: 25 },
		};

		const result = getSectionOrder(dividerPositions);
		expect(result).toEqual(["created", "modified", "deleted"]);
	});

	it("should skip sections with invalid positions", () => {
		const dividerPositions = {
			modified: { start: 10, end: 15 },
			created: { start: -1, end: -1 },
			deleted: { start: 20, end: 25 },
		};

		const result = getSectionOrder(dividerPositions);
		expect(result).toEqual(["modified", "deleted"]);
	});

	it("should handle empty result when all positions are invalid", () => {
		const dividerPositions = {
			modified: { start: -1, end: -1 },
			created: { start: -1, end: -1 },
			deleted: { start: -1, end: -1 },
		};

		const result = getSectionOrder(dividerPositions);
		expect(result).toEqual([]);
	});
});
