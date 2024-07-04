import {
	beforeEach,
	describe,
	it,
	expect,
	afterEach,
	beforeAll,
} from "bun:test";
import { TestSettingsBuilder } from "../../stubs/TestSettingsBuilder";
import { getFill } from "../../../src/logic/log_note/getFill";
import { TestReplacementDictionary } from "../../stubs/TestReplacementDictionary";
import { TestFileConverter } from "../../stubs/TestFileConverter";

// ** NOTE: Only tests whether files given in lists are correct. Therefore, output format
// is always set to [[path]]. For format testing, see replacementDictionaryStub tests
describe("getFill should return the correct sorted lists", () => {
	let builder: TestSettingsBuilder;

	beforeEach(() => {
		builder = new TestSettingsBuilder();
		builder.setOutputFormat("[[path]]");
	});

	it("should return empty arrays if no trackedfiles provided", () => {
		const settings = builder.build();

		expect(
			getFill(
				settings,
				new TestReplacementDictionary(),
				new TestFileConverter(),
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
				new TestFileConverter(),
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
				new TestFileConverter(),
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
				new TestFileConverter(),
			),
		).toEqual({
			created: [],
			modified: ["a.md", "c.md"],
			deleted: [],
		});
	});
});
