import { describe, it, expect } from "bun:test";
import { fillLineXToYWithContent } from "../../../src/logic/log_note/fillLineXToYWithContent";

describe("fillLineXToYWithContent should return a correctly filled array", () => {
	it("shoud delete lines if given blank content", () => {
		expect(
			fillLineXToYWithContent(
				["keep before", "lines", "a", "b", "c", "keep after"],
				1,
				4,
				[],
			).filled,
		).toEqual(["keep before", "keep after"]);
	});

	it("should replace current lines with content if no extra space required", () => {
		expect(
			fillLineXToYWithContent(["a", "b", "c"], 0, 1, ["d", "e"]).filled,
		).toEqual(["d", "e", "c"]);
	});

	it("should add lines if required by content length", () => {
		expect(
			fillLineXToYWithContent(["a", "b", "c"], 1, 1, ["x", "y", "z"])
				.filled,
		).toEqual(["a", "x", "y", "z", "c"]);
	});

	it("should not fill if lineX is -1", () => {
		expect(
			fillLineXToYWithContent(["a", "b", "c"], -1, 2, ["x", "y", "z"])
				.filled,
		).toEqual(["a", "b", "c"]);
	});

	it("should not fill if lineY is -1", () => {
		expect(
			fillLineXToYWithContent(["a", "b", "c"], 1, -1, ["x", "y", "z"])
				.filled,
		).toEqual(["a", "b", "c"]);
	});

	it("should not fill if lineX and lineY are both -1", () => {
		expect(
			fillLineXToYWithContent(["a", "b", "c"], -1, -1, ["x", "y", "z"])
				.filled,
		).toEqual(["a", "b", "c"]);
	});
});

describe("fillLineXToYWithContent should return the correct offset", () => {
	it("should return 0 if no lines are added or removed", () => {
		expect(
			fillLineXToYWithContent(["a", "b", "c"], 0, 1, ["d", "e"])
				.lineOffset,
		).toEqual(0);
	});

	it("should return the correct negative value if lines are removed", () => {
		expect(
			fillLineXToYWithContent(["a", "b", "c"], 0, 1, ["e"]).lineOffset,
		).toEqual(-1);
	});

	it("should return the correct positive value if lines are added", () => {
		expect(
			fillLineXToYWithContent(["a", "b", "c"], 0, 2, ["1", "2", "3", "4"])
				.lineOffset,
		).toEqual(1);
	});
});
