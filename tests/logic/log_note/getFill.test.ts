import { beforeEach, describe, it, expect } from "bun:test";
import { TestSettingsBuilder } from "../../stubs/TestSettingsBuilder";
import { getFill } from "../../../src/logic/log_note/getFill";
import { TestReplacementDictionary } from "../../stubs/TestReplacementDictionary";
import { TestFileConverter } from "../../stubs/TestFileConverter";

let builder: TestSettingsBuilder;

beforeEach(() => {
	builder = new TestSettingsBuilder();
	builder.setOutputFormat("[[path]]");
});

// ** NOTE: Only tests whether files given in lists are correct. Therefore, output format
// is always set to [[path]]. For format testing, see replacementDictionaryStub tests
describe("getFill should return the correct sorted lists", () => {
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
			.addTrackedFile({
				path: "a.md",
				matchesCriteria: false,
				supposedList: "created",
			})
			.build();

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
			.addTrackedFile({
				path: "a.md",
				matchesCriteria: true,
				supposedList: "created",
			})
			.build();

		expect(
			getFill(
				settings,
				new TestReplacementDictionary(),
				new TestFileConverter(),
			),
		).toEqual({ created: [], modified: [], deleted: [] });
	});
});

// test repkacement dict and file coverter

// 	// test combined modified and created bool flag

// 	it("should check if criteria is matched", () => {
// 		const stub = [
// 			{
// 				path: "a",
// 				supposedList: "created" as ListType, // TODO - why does this need explicit type cast
// 				matchesCriteria: false,
// 			},
// 			{
// 				path: "b",
// 				supposedList: "created" as ListType,
// 				matchesCriteria: true,
// 			},
// 		];

// 		expect(getFill(stub, false).created).toEqual(["b"]);
// 	});

// 	it("should sort into correct lists", () => {
// 		const stub = [
// 			{
// 				path: "a",
// 				supposedList: "created" as ListType,
// 				matchesCriteria: true,
// 			},
// 			{
// 				path: "b",
// 				supposedList: "modified" as ListType,
// 				matchesCriteria: true,
// 			},
// 			{
// 				path: "c",
// 				supposedList: "deleted" as ListType,
// 				matchesCriteria: true,
// 			},
// 			{
// 				path: "d",
// 				supposedList: "deleted" as ListType,
// 				matchesCriteria: true,
// 			},
// 		];

// 		expect(getFill(stub, false)).toEqual({
// 			created: ["a"],
// 			modified: ["b"],
// 			deleted: ["c", "d"],
// 		});
// 	});

// 	it("should combine created and modified if boolean flag is true", () => {
// 		const stub = [
// 			{
// 				path: "a",
// 				supposedList: "created" as ListType,
// 				matchesCriteria: true,
// 			},
// 			{
// 				path: "b",
// 				supposedList: "modified" as ListType,
// 				matchesCriteria: true,
// 			},
// 		];

// 		expect(getFill(stub, true)).toEqual({
// 			created: [],
// 			modified: ["a", "b"],
// 			deleted: [],
// 		});
// 	});
// });
