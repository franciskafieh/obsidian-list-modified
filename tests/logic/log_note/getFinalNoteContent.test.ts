import { describe, it, expect } from "bun:test";
import { getFinalNoteContent } from "../../../src/logic/log_note/getFinalNoteContent";
import { TestSettingsBuilder } from "../../stubs/TestSettingsBuilder";

import { removeDividers } from "../../../src/logic/log_note/removeDividers";
import { TestReplacementDictionary } from "../../stubs/TestReplacementDictionary";
import { TestFileConverter } from "../../stubs/TestFileConverter";
import { Settings } from "../../../src/interfaces/Settings";
import { TestVault } from "../../stubs/TestVault";

// no complicated tests since this function already has its inner function calls tested in other files

function getTestFinalNoteContent(currentContent: string, settings: Settings) {
	return getFinalNoteContent(
		currentContent,
		settings,
		new TestReplacementDictionary(),
		new TestFileConverter(),
		new TestVault(),
	);
}

describe("final note content should be correct", () => {
	it("should return nothing if no file content", () => {
		expect(
			getTestFinalNoteContent("", new TestSettingsBuilder().build()),
		).toEqual("");
	});

	it("should not change anything if there are no trackedFiles", () => {
		expect(
			getTestFinalNoteContent(
				"%% LIST MODIFIED %%\n%% END %%\nabc",
				new TestSettingsBuilder().build(),
			),
		).toEqual("%% LIST MODIFIED %%\n%% END %%\nabc");
	});

	it("should add content if tracked file and its divider exists", () => {
		expect(
			getTestFinalNoteContent(
				"%% LIST MODIFIED %%\n%% END %%\nabc",
				new TestSettingsBuilder()
					.setTrackedFiles([
						{
							path: "c.md",
							matchesCriteria: true,
							supposedList: "modified",
						},
					])
					.build(),
			),
		).toEqual("%% LIST MODIFIED %%\n- [[c]]\n%% END %%\nabc");
	});

	it("should add content and divider if divider should be auto-created", () => {
		expect(
			getTestFinalNoteContent(
				"abc",
				new TestSettingsBuilder()
					.setTrackedFiles([
						{
							path: "c.md",
							matchesCriteria: true,
							supposedList: "modified",
						},
					])
					.setAutoCreateModifiedDivider(true)
					.build(),
			),
		).toEqual("abc\n%% LIST MODIFIED %%\n- [[c]]\n%% END %%");
	});

	it("should add content and multiple dividers if dividers should be auto-created", () => {
		expect(
			getTestFinalNoteContent(
				"abc",
				new TestSettingsBuilder()
					.setTrackedFiles([
						{
							path: "modified.md",
							matchesCriteria: true,
							supposedList: "modified",
						},
						{
							path: "deleted.md",
							matchesCriteria: true,
							supposedList: "deleted",
						},
						{
							path: "created.md",
							matchesCriteria: true,
							supposedList: "created",
						},
					])
					.setAutoCreateModifiedDivider(true)
					.setAutoCreateDeletedDivider(true)
					.setAutoCreateCreatedDivider(true)
					.build(),
			),
		).toEqual(
			"abc\n%% LIST CREATED %%\n- [[created]]\n%% END %%\n%% LIST MODIFIED %%\n- [[modified]]\n%% END %%\n%% LIST DELETED %%\n- [[deleted]]\n%% END %%",
		);
	});

	it("should fill correct locations and expand or shrink divider sections where necessary", () => {
		expect(
			getTestFinalNoteContent(
				"abc\n%% LIST MODIFIED %%\nshould get bigger\n%% END %%\n\n\n%% LIST DELETED %%\nstuff\nshould get smaller\n%% END %%\n%% LIST CREATED %%\nshould stay same\n%% END %%\nabc",
				new TestSettingsBuilder()
					.setTrackedFiles([
						{
							path: "modified.md",
							matchesCriteria: true,
							supposedList: "modified",
						},
						{
							path: "modified2.md",
							matchesCriteria: true,
							supposedList: "modified",
						},
						{
							path: "deleted.md",
							matchesCriteria: true,
							supposedList: "deleted",
						},
						{
							path: "created.md",
							matchesCriteria: true,
							supposedList: "created",
						},
					])
					.setAutoCreateModifiedDivider(true)
					.setAutoCreateDeletedDivider(true)
					.setAutoCreateCreatedDivider(true)
					.build(),
			),
		).toEqual(
			"abc\n%% LIST MODIFIED %%\n- [[modified]]\n- [[modified2]]\n%% END %%\n\n\n%% LIST DELETED %%\n- [[deleted]]\n%% END %%\n%% LIST CREATED %%\n- [[created]]\n%% END %%\nabc",
		);
	});

	it("should not change anything if there is no divider ends", () => {
		expect(
			getTestFinalNoteContent(
				"start\n%% LIST MODIFIED %%\nabc",
				new TestSettingsBuilder()
					.setTrackedFiles([
						{
							path: "modified.md",
							matchesCriteria: true,
							supposedList: "modified",
						},
					])
					.build(),
			),
		).toEqual("start\n%% LIST MODIFIED %%\nabc");
	});
});
