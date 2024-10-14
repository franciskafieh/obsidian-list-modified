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

	// improve this maybe? need a way to inject this into file converter without having to re-write all the tests
	it("should return file with ctime if special name", () => {
		expect(fileConverter.fromPath("ctime-10.md")?.stat.ctime).toBe(10);
	});
});
