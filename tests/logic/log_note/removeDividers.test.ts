import { describe, it, expect } from "bun:test";
import { removeDividers } from "../../../src/logic/log_note/removeDividers";

describe("dividers should be removed as expected", () => {
	it("should not remove anything if no dividers", () => {
		const noDividers =
			"sdfsdfds\n" +
			"%%LIST MODIFIED\n" +
			"%% LIST MODIFIED\n" +
			"%% LIST MODIFIED %% d\n";

		expect(removeDividers(noDividers)).toEqual(noDividers);
	});

	it("should remove all present divider lines", () => {
		const mixed =
			"%% sdfsdfds %%\n" +
			"%%LIST MODIFIED\n" +
			"%% LIST DELETED %%\n" +
			"%% LIST CREATED %%\n" +
			"%% LIST MODIFIED %%\n" +
			"%% END %%\n" +
			"a";

		expect(removeDividers(mixed)).toEqual(
			"%% sdfsdfds %%\n" + "%%LIST MODIFIED\n" + "a",
		);
	});
});
