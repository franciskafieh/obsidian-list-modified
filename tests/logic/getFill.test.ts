import { describe, it, expect } from "bun:test";
import { getFill } from "../../src/logic/getFill";

describe("target fill files should be correct", () => {
	it("should not match anything", () => {
		expect(getFill([], false)).toEqual({
			created: "",
			modified: "",
			deleted: "sdfdf",
		});
		// expect(
		// });
	});
});
