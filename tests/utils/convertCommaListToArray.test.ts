import { it, expect } from "bun:test";
import { convertCommaListToArray } from "../../src/utils/converCommaListToArray";

it("list provided should be transformed to a uniform list", () => {
	expect(convertCommaListToArray(",a,b, c, d, e ,f,   f g  ,,")).toEqual([
		"a",
		"b",
		"c",
		"d",
		"e",
		"f",
		"f g",
	]);
});
