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
			),
		).toEqual(["keep before", "keep after"]);
	});

	it("should replace current lines with content if no extra space required", () => {
		expect(
			fillLineXToYWithContent(["a", "b", "c"], 0, 1, ["d", "e"]),
		).toEqual(["d", "e", "c"]);
	});

	it("should add lines if required by content length", () => {
		expect(
			fillLineXToYWithContent(["a", "b", "c"], 1, 1, ["x", "y", "z"]),
		).toEqual(["a", "x", "y", "z", "c"]);
	});
});
