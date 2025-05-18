import { describe, it, expect } from "bun:test";
import { getDividerPositions } from "../../../src/logic/log_note/getDividerPositions";

describe("dividers should be matched as expected", () => {
	it("should not match anything", () => {
		const noDividers = [
			"sdfsdfds",
			"sdfsdfsdf",
			"%%LIST MODIFIED",
			"%% LIST MODIFIED",
			"%% LIST MODIFIED %% d",
		];

		expect(getDividerPositions(noDividers)).toEqual({
			created: { start: -1, end: -1 },
			modified: { start: -1, end: -1 },
			deleted: { start: -1, end: -1 },
		});
	});

	it("should match modified divider without end", () => {
		const modified = [
			"asfsdf",
			"nsfaadf",
			"%% LIST MODIFIED %%",
			"dsfsdf",
			"etc",
		];

		expect(getDividerPositions(modified)).toEqual({
			created: { start: -1, end: -1 },
			modified: { start: 2, end: -1 },
			deleted: { start: -1, end: -1 },
		});
	});

	it("should match deleted and created dividers and ends", () => {
		const mix = [
			"%% LIST DELETED %%",
			"dsfsdfs",
			"%% END %%",
			"etc",
			"%% LIST CREATED %%",
			"%% END %% a",
			"%% END",
			"%% END %%",
		];

		expect(getDividerPositions(mix)).toEqual({
			created: { start: 4, end: 7 },
			modified: { start: -1, end: -1 },
			deleted: { start: 0, end: 2 },
		});
	});

	it("should match last start pos if duplicated", () => {
		const duplicateStartPos = [
			"%% LIST DELETED %%",
			"%% LIST DELETED %%",
			"%% LIST DELETED %%",
			"%% END %%",
		];

		expect(getDividerPositions(duplicateStartPos).deleted).toEqual({
			start: 2,
			end: 3,
		});
	});

	it("should match first end pos if duplicated", () => {
		const duplicateEndPos = [
			"%% LIST DELETED %%",
			"%% END %%",
			"%% END %%",
		];

		expect(getDividerPositions(duplicateEndPos).deleted).toEqual({
			start: 0,
			end: 1,
		});
	});

	it("should match with leading and trailing whitespace", () => {
		const dividersWithWhitespace = ["  %% LIST DELETED %%", "%% END %%  "];

		expect(getDividerPositions(dividersWithWhitespace).deleted).toEqual({
			start: 0,
			end: 1,
		});
	});

	it("should handle modified before created order", () => {
		const modifiedFirst = [
			"%% LIST MODIFIED %%",
			"%% END %%",
			"%% LIST CREATED %%",
			"%% END %%",
			"%% LIST DELETED %%",
			"%% END %%",
		];

		expect(getDividerPositions(modifiedFirst)).toEqual({
			modified: { start: 0, end: 1 },
			created: { start: 2, end: 3 },
			deleted: { start: 4, end: 5 },
		});
	});
});
