import { it, expect, describe } from "bun:test";
import { replaceStrFromIndexToIndex } from "../../src/utils/replaceStrFromIndexToIndex";

describe("replaceStrFromIndexToIndex should replace properly", () => {
	it("should work with empty characters", () => {
		expect(replaceStrFromIndexToIndex("abc", 0, 1, "").string).toBe("c");
	});

	it("should work with strings that shorten the end word", () => {
		expect(replaceStrFromIndexToIndex("abc", 0, 1, "z").string).toBe("zc");
	});

	it("should work with strings that lengthen the end word", () => {
		expect(replaceStrFromIndexToIndex("abc", 0, 0, "xyz").string).toBe(
			"xyzbc",
		);
	});

	it("should work in the middle of a word", () => {
		expect(replaceStrFromIndexToIndex("abcd", 1, 2, "xyz").string).toBe(
			"axyzd",
		);
	});

	it("should work at the end of a word", () => {
		expect(replaceStrFromIndexToIndex("abc", 2, 2, "xyz").string).toBe(
			"abxyz",
		);
	});
});

describe("replaceStrFromIndexToIndex should return the correct offset", () => {
	it("should return 0 if no change", () => {
		expect(replaceStrFromIndexToIndex("abc", 0, 0, "x").offset).toBe(0);
	});

	it("should return negative if word is shortened", () => {
		expect(replaceStrFromIndexToIndex("abc", 0, 1, "z").offset).toBe(-1);
	});

	it("should return positive if word is lengthened", () => {
		expect(replaceStrFromIndexToIndex("abc", 0, 1, "xyz").offset).toBe(1);
	});
});
