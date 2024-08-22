import { beforeEach, describe, it, expect } from "bun:test";
import { TestSettingsBuilder } from "../../stubs/TestSettingsBuilder";
import { getFill } from "../../../src/logic/log_note/getFill";
import { TestReplacementDictionary } from "../../stubs/TestReplacementDictionary";
import { TestFileConverter } from "../../stubs/TestFileConverter";
import { TestVault } from "../../stubs/TestVault";

// ** NOTE: Only tests whether files given in lists are correct. Therefore, output format
// is always set to [[path]] and frontmatter cache is blank. For format testing, see replacementDictionaryStub tests
// Exception; also tests separate vs single output format

let builder: TestSettingsBuilder;

beforeEach(() => {
	builder = new TestSettingsBuilder();
	builder.setOutputFormat("[[path]]");
});

describe("getFill should return the correct sorted lists", () => {
	it("should return empty arrays if no trackedfiles provided", () => {
		const settings = builder.build();

		expect(
			getFill(
				settings,
				new TestReplacementDictionary(),
				{},
				new TestFileConverter(),
				new TestVault(),
			),
		).toEqual({ created: [], modified: [], deleted: [] });
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

		expect(
			getFill(
				settings,
				new TestReplacementDictionary(),
				{},
				new TestFileConverter(),
				new TestVault(),
			),
		).toEqual({ created: [], modified: [], deleted: [] });
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

		expect(
			getFill(
				settings,
				new TestReplacementDictionary(),
				{},
				new TestFileConverter(),
				new TestVault(),
			),
		).toEqual({
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

		expect(
			getFill(
				settings,
				new TestReplacementDictionary(),
				{},
				new TestFileConverter(),
				new TestVault(),
			),
		).toEqual({
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

		expect(
			getFill(
				settings,
				new TestReplacementDictionary(),
				{},
				new TestFileConverter(),
				new TestVault(),
			),
		).toEqual({
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

		expect(
			getFill(
				settings,
				new TestReplacementDictionary(),
				{},
				new TestFileConverter(),
				new TestVault(),
			),
		).toEqual({
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

		expect(
			getFill(
				settings,
				new TestReplacementDictionary(),
				{},
				new TestFileConverter(),
				new TestVault(),
			),
		).toEqual({
			created: ["create: a.md"],
			modified: ["mod: b.md"],
			deleted: ["del: c.md"],
		});
	});
});
