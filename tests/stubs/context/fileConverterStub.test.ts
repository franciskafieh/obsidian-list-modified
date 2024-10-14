import { beforeAll, describe, it, expect } from "bun:test";
import { getSingleFileWithPath } from "../fakeFiles";
import { TestFileConverter } from "./TestFileConverter";

let fileConverter: TestFileConverter;

beforeAll(() => {
	fileConverter = new TestFileConverter();
});

describe("file converter should work as expected", () => {
	it("should return file with path", () => {
		expect(fileConverter.fromPath("a.md")).toEqual(
			getSingleFileWithPath("a.md")
		);
	});
});
