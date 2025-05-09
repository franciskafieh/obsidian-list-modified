import { describe, it, expect } from "bun:test";
import fileMatchesCriteria from "../../../src/logic/file_tracking/fileMatchesCriteria";
import { TestSettingsBuilder } from "../../stubs/context/TestSettingsBuilder";
import { getSingleFileWithPath } from "../../stubs/fakeFiles";

describe("fileMatchesCriteria should correctly match tags", () => {
	it("should pass on tags if tags are null", () => {
		expect(
			fileMatchesCriteria(
				getSingleFileWithPath("a.md"),
				null,
				new TestSettingsBuilder().setTags("ignored").build()
			)
		).toBe(true);
	});

	it("should fail on tags if matching one", () => {
		expect(
			fileMatchesCriteria(
				getSingleFileWithPath("a.md"),
				["some", "tags", "ignored"],
				new TestSettingsBuilder().setTags(["a", "ignored"]).build()
			)
		).toBe(false);
	});
});

describe("fileMatchesCriteria should correctly match ignored name text", () => {
	it("should pass on name if not ignored", () => {
		expect(
			fileMatchesCriteria(
				getSingleFileWithPath("a.md"),
				[""],
				new TestSettingsBuilder().setIgnoredNameContains("abc").build()
			)
		).toBe(true);
	});

	it("should fail on name if matching one", () => {
		expect(
			fileMatchesCriteria(
				getSingleFileWithPath("abc.md"),
				[""],
				new TestSettingsBuilder().setIgnoredNameContains("abc").build()
			)
		).toBe(false);
	});

	it("should fail on name if matching one, combined with other text", () => {
		expect(
			fileMatchesCriteria(
				getSingleFileWithPath("a-abcaa.md"),
				[""],
				new TestSettingsBuilder().setIgnoredNameContains("abc").build()
			)
		).toBe(false);
	});
});

describe("fileMatchesCriteria should correctly match ignored folder/path", () => {
	it("should pass on folder if not ignored", () => {
		expect(
			fileMatchesCriteria(
				getSingleFileWithPath("pass-folder/file.md"),
				[""],
				new TestSettingsBuilder()
					.setExcludedFolders("fail-folder")
					.build()
			)
		).toBe(true);
	});

	it("should fail on folder if matching one", () => {
		expect(
			fileMatchesCriteria(
				getSingleFileWithPath("fail-folder/file.md"),
				[""],
				new TestSettingsBuilder()
					.setExcludedFolders("fail-folder")
					.build()
			)
		).toBe(false);
	});
});

describe("fileMatchesCriteria should correctly match ignored extension", () => {
	it("should pass on extension if none ignored", () => {
		expect(
			fileMatchesCriteria(
				getSingleFileWithPath("pass.md"),
				[""],
				new TestSettingsBuilder()
					.setExcludedExtensions("ignored")
					.build()
			)
		).toBe(true);
	});

	it("should fail on extension if matching one", () => {
		expect(
			fileMatchesCriteria(
				getSingleFileWithPath("fail.ignored"),
				[""],
				new TestSettingsBuilder()
					.setExcludedExtensions("ignored")
					.build()
			)
		).toBe(false);
	});

	it("should fail on extension if matching one, case insensitive", () => {
		expect(
			fileMatchesCriteria(
				getSingleFileWithPath("fail.ignored"),
				[""],
				new TestSettingsBuilder()
					.setExcludedExtensions("igNoRed")
					.build()
			)
		).toBe(false);
	});
});
