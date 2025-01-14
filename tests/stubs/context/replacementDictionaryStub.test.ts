import { describe, it, expect } from "bun:test";
import { TestReplacementDictionary } from "./TestReplacementDictionary";
import { getSingleFileWithPath } from "../fakeFiles";
import { TestFileMetadataCacheProvider } from "./TestFileMetadataCacheProvider";

let dict: TestReplacementDictionary;

describe("built-in replacements should work as expected", () => {
	it("should return path of file if given a simple [[path]] template", () => {
		dict = new TestReplacementDictionary();

		const replacement = dict.getOutputPostReplacement(
			"[[path]]",
			getSingleFileWithPath("a/b/test.md"),
			new TestFileMetadataCacheProvider(),
			"a/b/test.md"
		);

		expect(replacement).toBe("a/b/test.md");
	});

	it("tag templates and stubbed cache should work", () => {
		dict = new TestReplacementDictionary();

		const replacement = dict.getOutputPostReplacement(
			"[[tags]]",
			getSingleFileWithPath("a/b/test.md"),
			new TestFileMetadataCacheProvider(["tag", "here"]),
			"a/b/test.md"
		);

		expect(replacement).toBe("tag, here");
	});

	it("multiple templates should work", () => {
		dict = new TestReplacementDictionary();

		const replacement = dict.getOutputPostReplacement(
			"[[path]] [[name]]",
			getSingleFileWithPath("a/b/test.md"),
			new TestFileMetadataCacheProvider(),
			"a/b/test.md"
		);

		expect(replacement).toBe("a/b/test.md test");
	});

	it("templates should work with stuff around them", () => {
		dict = new TestReplacementDictionary();

		const replacement = dict.getOutputPostReplacement(
			"a [[path]]b[[name]] c",
			getSingleFileWithPath("a/b/test.md"),
			new TestFileMetadataCacheProvider(),
			"a/b/test.md"
		);

		expect(replacement).toBe("a a/b/test.mdbtest c");
	});
});

describe("frontmatter replacements should work as expected", () => {
	it("should return frontmatter property if given a [[f.]] template", () => {
		dict = new TestReplacementDictionary();

		const replacement = dict.getOutputPostReplacement(
			"[[f.name]]",
			getSingleFileWithPath("a/b/test.md"),
			new TestFileMetadataCacheProvider([], { name: "frontmatter name" }),
			"a/b/test.md"
		);

		expect(replacement).toBe("frontmatter name");
	});

	it("should work with boolean property", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[f.check]]",
			getSingleFileWithPath("a/b/test.md"),
			new TestFileMetadataCacheProvider([], { check: false }),
			"a/b/test.md"
		);

		expect(replacement).toBe("false");
	});

	it("should return comma separated list for arrays", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[f.list]]",
			getSingleFileWithPath("a/b/test.md"),
			new TestFileMetadataCacheProvider([], { list: ["a", "b"] }),
			"a/b/test.md"
		);

		expect(replacement).toBe("a, b");
	});

	it("should return blank string if empty frontmatter", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[f.blank]]",
			getSingleFileWithPath("a/b/test.md"),
			new TestFileMetadataCacheProvider([], {}),
			"a/b/test.md"
		);

		expect(replacement).toBe("");
	});

	it("should return blank string if property is empty", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[f.blank]]",
			getSingleFileWithPath("a/b/test.md"),
			new TestFileMetadataCacheProvider([], { blank: "" }),
			"a/b/test.md"
		);

		expect(replacement).toBe("");
	});
});

describe("mix of frontmatter and built-in replacements should work", () => {
	it("should return distinct file ctime and frontmatter ctime", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[ctime]] [[f.ctime]]",
			getSingleFileWithPath("a/b/test.md"),
			new TestFileMetadataCacheProvider([], { ctime: 100 }),
			"a/b/test.md"
		);

		expect(replacement).toBe("00:00:00 100");
	});
});

describe("templates should work with deleted files", () => {
	it("should return path of file if given [[path]], [[name]], or [[link]] templates", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[path]] [[name]] [[link]]",
			null,
			new TestFileMetadataCacheProvider(),
			"file.md"
		);

		expect(replacement).toBe("file.md file.md file.md");
	});

	it("other built-in templates should be removed", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[ctime]][[mtime]][[tags]]",
			null,
			new TestFileMetadataCacheProvider(),
			"file.md"
		);

		expect(replacement).toBe("");
	});

	it("all frontmatter property templates should be removed", () => {
		const replacement = dict.getOutputPostReplacement(
			"[[f.a]][[f.time]][[f.c]]",
			null,
			new TestFileMetadataCacheProvider(),
			"file.md"
		);

		expect(replacement).toBe("");
	});
});
