import { beforeAll, describe, it, expect } from "bun:test";
import { TestReplacementDictionary } from "./stubs/TestReplacementDictionary";
import { getSingleFileWithPath } from "./stubs/fakeFiles";

let dict: TestReplacementDictionary;

beforeAll(() => {
	dict = new TestReplacementDictionary();
});

describe("replacements should work as expected", () => {
	it("should return path of file", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[path]]",
			getSingleFileWithPath("a/b/test.md"),
			"a/b/test.md",
		);

		expect(replacement).toBe("a/b/test.md");
	});
});
