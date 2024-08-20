import { beforeAll, describe, it, expect } from "bun:test";
import { TestReplacementDictionary } from "./TestReplacementDictionary";
import { getSingleFileWithPath } from "./fakeFiles";

let dict: TestReplacementDictionary;

beforeAll(() => {
	dict = new TestReplacementDictionary();
});

describe("built-in replacements should work as expected", () => {
	it("should return path of file if given a simple [[path]] template", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[path]]",
			getSingleFileWithPath("a/b/test.md"),
			{},
			"a/b/test.md",
		);

		expect(replacement).toBe("a/b/test.md");
	});

	it("multiple templates should work", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[path]] [[name]]",
			getSingleFileWithPath("a/b/test.md"),
			{},
			"a/b/test.md",
		);

		expect(replacement).toBe("a/b/test.md test");
	});

	it("templates should work with stuff around them", () => {
		const replacement = dict.getOutputPostReplacement(
			"a [[path]]b[[name]] c",
			getSingleFileWithPath("a/b/test.md"),
			{},
			"a/b/test.md",
		);

		expect(replacement).toBe("a a/b/test.mdbtest c");
	});
});

describe("frontmatter replacements should work as expected", () => {
	it("should return frontmatter property if given a [[f.]] template", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[f.name]]",
			getSingleFileWithPath("a/b/test.md"),
			{ name: "frontmatter name" },
			"a/b/test.md",
		);

		expect(replacement).toBe("frontmatter name");
	});

	it("should work with boolean property", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[f.check]]",
			getSingleFileWithPath("a/b/test.md"),
			{ check: false },
			"a/b/test.md",
		);

		expect(replacement).toBe("false");
	});

	it("should return comma separated list for arrays", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[f.list]]",
			getSingleFileWithPath("a/b/test.md"),
			{ list: ["a", "b"] },
			"a/b/test.md",
		);

		expect(replacement).toBe("a, b");
	});

	it("should return blank string if empty frontmatter", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[f.blank]]",
			getSingleFileWithPath("a/b/test.md"),
			{},
			"a/b/test.md",
		);

		expect(replacement).toBe("");
	});

	it("should return blank string if property is empty", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[f.blank]]",
			getSingleFileWithPath("a/b/test.md"),
			{ blank: null },
			"a/b/test.md",
		);

		expect(replacement).toBe("");
	});
});

describe("mix of frontmatter and built-in replacements should work", () => {
	it("should return distinct file ctime and frontmatter ctime", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[ctime]] [[f.ctime]]",
			getSingleFileWithPath("a/b/test.md"),
			{ ctime: 100 },
			"a/b/test.md",
		);

		expect(replacement).toBe("00:00:00 100");
	});
});
