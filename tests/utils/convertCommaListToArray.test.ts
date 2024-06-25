import { describe, expect } from "bun:test";
import { convertCommaListToArray } from "../../src/utils/converCommaListToArray";

describe("list provided by user in settings should convert as expected", () => {
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
