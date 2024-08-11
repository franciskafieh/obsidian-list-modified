import { describe, it, expect } from "bun:test";
import { getContentWithoutCreatedSection } from "../../../src/logic/log_note/getContentWithoutCreatedSection";

describe("created section should be deleted if it exists", () => {
	it("should delete created section", () => {
		expect(
			getContentWithoutCreatedSection(
				"a\n%% LIST CREATED %%\n- [[a]]\n%% END %%",
			),
		).toEqual("a\n");
	});

	it("should not change anything if there is no created section present", () => {
		expect(
			getContentWithoutCreatedSection(
				"a\n%% LIST MODIFIED %%\n- [[a]]\n%% END %%\n%% LIST CREATED %%",
			),
		).toEqual(
			"a\n%% LIST MODIFIED %%\n- [[a]]\n%% END %%\n%% LIST CREATED %%",
		);
	});
});
