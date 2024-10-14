import { beforeEach, describe, it, expect } from "bun:test";
import { TestSettingsBuilder } from "../../stubs/context/TestSettingsBuilder";
import { getFill } from "../../../src/logic/log_note/getFill";
import { TestReplacementDictionary } from "../../stubs/context/TestReplacementDictionary";
import { TestFileConverter } from "../../stubs/context/TestFileConverter";
import { TestVault } from "../../stubs/context/TestVault";
import { TestContext } from "../../stubs/context/TestContext";
import { TestFileMetadataCacheProvider } from "../../stubs/context/TestFileMetadataCacheProvider";
import { createTestContextWithSettings } from "../../stubs/context/testContextCreator";
import { TrackedFile } from "../../../src/types";

// ** NOTE: Only tests whether files given in lists are correct. Therefore, output format
// is always set to [[path]]. For format testing, see replacementDictionaryStub tests
// *EXCEPTION: this file tests separate vs single output format

let builder: TestSettingsBuilder;

beforeEach(() => {
	builder = new TestSettingsBuilder();
	builder.setOutputFormat("[[path]]");
});

describe("getFill should return the correct sorted lists", () => {
	it("should return empty arrays if no trackedfiles provided", () => {
		const settings = builder.build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context)).toEqual({
			created: [],
			modified: [],
			deleted: [],
		});
	});

	it("should return empty arrays if no trackedfiles match criteria", () => {
		const settings = builder
			.setTrackedFiles([
				{
					path: "a.md",
					matchesCriteria: false,
					supposedList: "created",
				},
				{
					path: "b.md",
					matchesCriteria: false,
					supposedList: "deleted",
				},
				{
					path: "c.md",
					matchesCriteria: false,
					supposedList: "modified",
				},
			])
			.build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context)).toEqual({
			created: [],
			modified: [],
			deleted: [],
		});
	});

	it("should sort files into correct lists", () => {
		const settings = builder
			.setTrackedFiles([
				{
					path: "a.md",
					matchesCriteria: true,
					supposedList: "created",
				},
				{
					path: "b.md",
					matchesCriteria: true,
					supposedList: "deleted",
				},
				{
					path: "c.md",
					matchesCriteria: true,
					supposedList: "modified",
				},
				{
					path: "d.md",
					matchesCriteria: true,
					supposedList: "modified",
				},
			])
			.build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context)).toEqual({
			created: ["a.md"],
			modified: ["c.md", "d.md"],
			deleted: ["b.md"],
		});
	});

	it("should honour combine created/modified boolean flag", () => {
		const settings = builder
			.setCombineCreatedAndModified(true)
			.setTrackedFiles([
				{
					path: "a.md",
					matchesCriteria: true,
					supposedList: "created",
				},
				{
					path: "c.md",
					matchesCriteria: true,
					supposedList: "modified",
				},
			])
			.build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context)).toEqual({
			created: [],
			modified: ["a.md", "c.md"],
			deleted: [],
		});
	});
});

describe("separated vs combined output formats should be respected depending on toggle", () => {
	it("should use combined output format if toggle is turned off (default)", () => {
		const settings = builder
			.setTrackedFiles([
				{
					path: "a.md",
					matchesCriteria: true,
					supposedList: "modified",
				},
			])
			.setOutputFormat("[[path]]")
			.build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context)).toEqual({
			created: [],
			modified: ["a.md"],
			deleted: [],
		});
	});

	it("should use separate output format if toggle is turned on", () => {
		const settings = builder
			.setTrackedFiles([
				{
					path: "a.md",
					matchesCriteria: true,
					supposedList: "modified",
				},
			])
			.setSeparateOutputFormats(true)
			.setModifiedFormat("a+[[path]]")
			.build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context)).toEqual({
			created: [],
			modified: ["a+a.md"],
			deleted: [],
		});
	});

	it("should use proper output format for each list if toggle is turned on", () => {
		const settings = builder
			.setTrackedFiles([
				{
					path: "a.md",
					matchesCriteria: true,
					supposedList: "created",
				},
				{
					path: "b.md",
					matchesCriteria: true,
					supposedList: "modified",
				},
				{
					path: "c.md",
					matchesCriteria: true,
					supposedList: "deleted",
				},
			])
			.setSeparateOutputFormats(true)
			.setCreatedFormat("create: [[path]]")
			.setModifiedFormat("mod: [[path]]")
			.setDeletedFormat("del: [[path]]")
			.build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context)).toEqual({
			created: ["create: a.md"],
			modified: ["mod: b.md"],
			deleted: ["del: c.md"],
		});
	});
});

describe("getFill should respect sort settings", () => {
	it("should sort by default 'first tracked' order if sort placeholder is empty", () => {
		const settings = builder
			.setTrackedFiles([
				{
					path: "first.md",
					matchesCriteria: true,
					supposedList: "modified",
				},
				{
					path: "second.md",
					matchesCriteria: true,
					supposedList: "modified",
				},
			])
			.build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context)).toEqual({
			created: [],
			modified: ["first.md", "second.md"],
			deleted: [],
		});
	});

	const alphaPaths = [
		{
			path: "a.md",
			matchesCriteria: true,
			supposedList: "modified",
		},
		{
			path: "c.md",
			matchesCriteria: true,
			supposedList: "modified",
		},
		{
			path: "d.md",
			matchesCriteria: true,
			supposedList: "modified",
		},
		{
			path: "b.md",
			matchesCriteria: true,
			supposedList: "modified",
		},
	];

	it("should sort alphabetically for ascending name built-in placeholder", () => {
		const settings = builder
			.setTrackedFiles(alphaPaths as TrackedFile[])
			.build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context)).toEqual({
			created: [],
			modified: ["a.md", "b.md", "c.md", "d.md"],
			deleted: [],
		});
	});

	it("should sort reverse-alphabetically for descending name built-in placeholder", () => {
		const settings = builder
			.setTrackedFiles(alphaPaths as TrackedFile[])
			.setSortOrder("desc")
			.build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context)).toEqual({
			created: [],
			modified: ["d.md", "c.md", "b.md", "a.md"],
			deleted: [],
		});
	});

	// todo way to inject mock ctime for test?
	const ctimePaths = [
		{
			path: "a.md",
			matchesCriteria: true,
			supposedList: "modified",
		},
		{
			path: "c.md",
			matchesCriteria: true,
			supposedList: "modified",
		},
		{
			path: "d.md",
			matchesCriteria: true,
			supposedList: "modified",
		},
		{
			path: "b.md",
			matchesCriteria: true,
			supposedList: "modified",
		},
	];

	it("should sort numerically for ascending ctime built-in placeholder", () => {
		const settings = builder.setTrackedFiles().build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context)).toEqual({
			created: [],
			modified: ["a.md", "b.md", "c.md", "d.md"],
			deleted: [],
		});
	});

	it("should sort reverse-numerically for descending ctime built-in placeholder", () => {
		const settings = builder.setTrackedFiles().build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context)).toEqual({
			created: [],
			modified: ["a.md", "b.md", "c.md", "d.md"],
			deleted: [],
		});
	});

	it("should work with alpha frontmatter", () => {
		// const settings = builder
		// 	.setTrackedFiles(alphaPaths as TrackedFile[])
		// 	.setSortOrder("desc")
		// 	.build();
		// const context = createTestContextWithSettings(settings);
		// expect(getFill(context)).toEqual({
		// 	created: [],
		// 	modified: ["d.md", "c.md", "b.md", "a.md"],
		// 	deleted: [],
		// });
	});

	it("should work with numerical frontmatter", () => {
		// const settings = builder
		// 	.setTrackedFiles(alphaPaths as TrackedFile[])
		// 	.setSortOrder("desc")
		// 	.build();
		// const context = createTestContextWithSettings(settings);
		// expect(getFill(context)).toEqual({
		// 	created: [],
		// 	modified: ["d.md", "c.md", "b.md", "a.md"],
		// 	deleted: [],
		// });
	});

	it("should not work with boolean frontmatter", () => {
		// const settings = builder
		// 	.setTrackedFiles(alphaPaths as TrackedFile[])
		// 	.setSortOrder("desc")
		// 	.build();
		// const context = createTestContextWithSettings(settings);
		// expect(getFill(context)).toEqual({
		// 	created: [],
		// 	modified: ["d.md", "c.md", "b.md", "a.md"],
		// 	deleted: [],
		// });
	});

	it("should not work with any sort of array (tags or frontmatter)", () => {
		// const settings = builder
		// 	.setTrackedFiles(alphaPaths as TrackedFile[])
		// 	.setSortOrder("desc")
		// 	.build();
		// const context = createTestContextWithSettings(settings);
		// expect(getFill(context)).toEqual({
		// 	created: [],
		// 	modified: ["d.md", "c.md", "b.md", "a.md"],
		// 	deleted: [],
		// });
	});
});
