import { beforeAll, describe, it, expect } from "bun:test";
import { getSingleFileWithPath } from "./stubs/fakeFiles";
import { TestFileConverter } from "./stubs/TestFileConverter";

let fileConverter: TestFileConverter;

beforeAll(() => {
	fileConverter = new TestFileConverter();
});

describe("file converter should work as expected", () => {
	it("should return file with path", () => {
		expect(fileConverter.fromPath("a.md")).toEqual(
			getSingleFileWithPath("a.md"),
		);
	});
});
