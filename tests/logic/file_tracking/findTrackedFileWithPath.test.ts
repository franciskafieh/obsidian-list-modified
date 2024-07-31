import { describe, it, expect } from "bun:test";
import { findTrackedFileWithPath } from "../../../src/logic/file_tracking/findTrackedFileWithPath";
import { TestSettingsBuilder } from "../../stubs/TestSettingsBuilder";
import { ListType } from "../../../src/types";

describe("findTrackedFileWithPath should find correct file in list", () => {
	it("should return undefined if does not match anything", () => {
		expect(
			findTrackedFileWithPath("a.md", new TestSettingsBuilder().build()),
		).toBeUndefined();
	});

	it("should return the correct file object if it exists", () => {
		const fileObj = {
			matchesCriteria: true,
			path: "a.md",
			supposedList: "created" as ListType,
		};
		expect(
			findTrackedFileWithPath(
				"a.md",
				new TestSettingsBuilder()
					.setTrackedFiles([
						{
							path: "",
							matchesCriteria: false,
							supposedList: "created" as ListType,
						},
						fileObj,
					])
					.build(),
			),
		).toEqual(fileObj);
	});
});
