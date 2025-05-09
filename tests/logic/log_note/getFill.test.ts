import { beforeEach, describe, it, expect } from "bun:test";
import { TestSettingsBuilder } from "../../stubs/context/TestSettingsBuilder";
import { getFill } from "../../../src/logic/log_note/getFill";
import { createTestContextWithSettings } from "../../stubs/context/testContextCreator";

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

describe("sorting should work as expected", () => {
	it("should not sort lists when sort option is set to none", () => {
		const settings = builder
			.setTrackedFiles([
				{
					path: "c.md",
					matchesCriteria: true,
					supposedList: "created",
				},
				{
					path: "a.md",
					matchesCriteria: true,
					supposedList: "created",
				},
				{
					path: "b.md",
					matchesCriteria: true,
					supposedList: "created",
				},
			])
			.setSortCreated("none")
			.build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context).created).toEqual(["c.md", "a.md", "b.md"]);
	});

	it("should sort lists alphabetically when sort option is set to alphabetical", () => {
		const settings = builder
			.setTrackedFiles([
				{
					path: "c.md",
					matchesCriteria: true,
					supposedList: "created",
				},
				{
					path: "a.md",
					matchesCriteria: true,
					supposedList: "created",
				},
				{
					path: "b.md",
					matchesCriteria: true,
					supposedList: "created",
				},
			])
			.setSortCreated("alphabetical")
			.build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context).created).toEqual(["a.md", "b.md", "c.md"]);
	});

	it("should sort lists reverse alphabetically when sort option is set to alphabetical-reverse", () => {
		const settings = builder
			.setTrackedFiles([
				{
					path: "c.md",
					matchesCriteria: true,
					supposedList: "created",
				},
				{
					path: "a.md",
					matchesCriteria: true,
					supposedList: "created",
				},
				{
					path: "b.md",
					matchesCriteria: true,
					supposedList: "created",
				},
			])
			.setSortCreated("alphabetical-reverse")
			.build();

		const context = createTestContextWithSettings(settings);

		expect(getFill(context).created).toEqual(["c.md", "b.md", "a.md"]);
	});

	it("should apply different sorting for each list type", () => {
		const settings = builder
			.setTrackedFiles([
				{
					path: "c.md",
					matchesCriteria: true,
					supposedList: "created",
				},
				{
					path: "a.md",
					matchesCriteria: true,
					supposedList: "created",
				},
				{
					path: "z.md",
					matchesCriteria: true,
					supposedList: "modified",
				},
				{
					path: "x.md",
					matchesCriteria: true,
					supposedList: "modified",
				},
				{
					path: "j.md",
					matchesCriteria: true,
					supposedList: "deleted",
				},
				{
					path: "m.md",
					matchesCriteria: true,
					supposedList: "deleted",
				},
			])
			.setSortCreated("alphabetical")
			.setSortModified("alphabetical-reverse")
			.setSortDeleted("none")
			.build();

		const context = createTestContextWithSettings(settings);
		const result = getFill(context);

		expect(result.created).toEqual(["a.md", "c.md"]);
		expect(result.modified).toEqual(["z.md", "x.md"]);
		expect(result.deleted).toEqual(["j.md", "m.md"]);
	});
});
