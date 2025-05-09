import { describe, it, expect } from "bun:test";
import { sortList } from "../../../src/logic/log_note/sortList";
import { OutputFile, SortOption } from "../../../src/types";
import { File } from "../../../src/interfaces/File";

describe("sortList should sort items correctly", () => {
	// Create test files with expected stats
	const files: OutputFile[] = [
		{
			file: {
				path: "c.md",
				basename: "c",
				stat: { mtime: 3000, ctime: 2 },
			} as File,
			path: "c.md",
		},
		{
			file: {
				path: "a.md",
				basename: "a",
				stat: { mtime: 1000, ctime: 5 },
			} as File,
			path: "a.md",
		},
		{
			file: {
				path: "b.md",
				basename: "b",
				stat: { mtime: 2000, ctime: 1 },
			} as File,
			path: "b.md",
		},
	];

	it("should return items unchanged when sort option is none", () => {
		const result = sortList(files, "none" as SortOption);
		// Map to paths for easier comparison
		const resultPaths = result.map((item) => item.path);
		expect(resultPaths).toEqual(["c.md", "a.md", "b.md"]);
	});

	it("should sort alphabetically by path", () => {
		const result = sortList(files, "alphabetical" as SortOption);
		const resultPaths = result.map((item) => item.path);
		expect(resultPaths).toEqual(["a.md", "b.md", "c.md"]);
	});

	it("should sort reverse alphabetically by path", () => {
		const result = sortList(files, "alphabetical-reverse" as SortOption);
		const resultPaths = result.map((item) => item.path);
		expect(resultPaths).toEqual(["c.md", "b.md", "a.md"]);
	});

	it("should sort by modification time ascending", () => {
		const result = sortList(files, "mtime" as SortOption);
		const resultPaths = result.map((item) => item.path);
		expect(resultPaths).toEqual(["a.md", "b.md", "c.md"]);
	});

	it("should sort by modification time descending", () => {
		const result = sortList(files, "mtime-reverse" as SortOption);
		const resultPaths = result.map((item) => item.path);
		expect(resultPaths).toEqual(["c.md", "b.md", "a.md"]);
	});

	it("should sort by creation time ascending", () => {
		const result = sortList(files, "ctime" as SortOption);
		const resultPaths = result.map((item) => item.path);
		expect(resultPaths).toEqual(["b.md", "c.md", "a.md"]);
	});

	it("should sort by creation time descending", () => {
		const result = sortList(files, "ctime-reverse" as SortOption);
		const resultPaths = result.map((item) => item.path);
		expect(resultPaths).toEqual(["a.md", "c.md", "b.md"]);
	});

	it("should handle deleted files with no file object", () => {
		const mixedFiles: OutputFile[] = [
			{
				file: null,
				path: "c.md",
			},
			{
				file: {
					path: "a.md",
					basename: "a",
					stat: { mtime: 1000, ctime: 1000 },
				} as File,
				path: "a.md",
			},
		];

		const result = sortList(mixedFiles, "mtime" as SortOption);
		const resultPaths = result.map((item) => item.path);
		expect(resultPaths).toEqual(["c.md", "a.md"]);
	});

	it("should handle deleted files with no file object when sorting by ctime", () => {
		const mixedFiles: OutputFile[] = [
			{
				file: null,
				path: "c.md",
			},
			{
				file: {
					path: "a.md",
					basename: "a",
					stat: { mtime: 1000, ctime: 1000 },
				} as File,
				path: "a.md",
			},
		];

		const result = sortList(mixedFiles, "ctime" as SortOption);
		const resultPaths = result.map((item) => item.path);
		expect(resultPaths).toEqual(["c.md", "a.md"]);
	});
});
