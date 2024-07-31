import { describe, it, expect } from "bun:test";
import { getDividerPositions } from "../../../src/logic/log_note/getDividerPositions";

describe("dividers should be matched as expected", () => {
	it("should not match anything", () => {
		const noDividers = Array.of(
			"sdfsdfds",
			"sdfsdfsdf",
			"%%LIST MODIFIED",
			"%% LIST MODIFIED",
			"%% LIST MODIFIED %% d",
		);

		expect(getDividerPositions(noDividers)).toEqual({
			created: { start: -1, end: -1 },
			modified: { start: -1, end: -1 },
			deleted: { start: -1, end: -1 },
		});
	});

	it("should match modified divider without end", () => {
		const modified = Array.of(
			"asfsdf",
			"nsfaadf",
			"%% LIST MODIFIED %%",
			"dsfsdf",
			"etc",
		);

		expect(getDividerPositions(modified)).toEqual({
			created: { start: -1, end: -1 },
			modified: { start: 2, end: -1 },
			deleted: { start: -1, end: -1 },
		});
	});

	it("should match deleted and created dividers and ends", () => {
		const modified = Array.of(
			"%% LIST DELETED %%",
			"dsfsdfs",
			"%% END %%",
			"etc",
			"%% LIST CREATED %%",
			"%% END %% a",
			"%% END",
			"%% END %%",
		);

		expect(getDividerPositions(modified)).toEqual({
			created: { start: 4, end: 7 },
			modified: { start: -1, end: -1 },
			deleted: { start: 0, end: 2 },
		});
	});
});
