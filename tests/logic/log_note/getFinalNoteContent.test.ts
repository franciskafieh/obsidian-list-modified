import { describe, it, expect } from "bun:test";
import { getFinalNoteContent } from "../../../src/logic/log_note/getFinalNoteContent";
import { TestSettingsBuilder } from "../../stubs/TestSettingsBuilder";

// describe("tmp", () => {
// 	it("aaaa", () => {
// 		expect(getFinalNoteContent("", new TestSettingsBuilder().build(), new TestReplacementDictionary(), {})).toEqual("");
// 	});
