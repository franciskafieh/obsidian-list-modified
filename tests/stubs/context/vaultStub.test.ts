import { describe, it, expect } from "bun:test";
import { TestVault } from "./TestVault";
import { getSingleFileWithPath } from "../fakeFiles";

describe("stub vault should work as expected", () => {
	it("should return file from path", () => {
		expect(new TestVault().getFileByPath("a.md")).toEqual(
			getSingleFileWithPath("a.md")
		);
	});
});
