import { moment } from "obsidian";
import { File } from "../../src/interfaces/File";
import { ReplacementDictionary } from "../../src/interfaces/ReplacementDictionary";

export class TestReplacementDictionary extends ReplacementDictionary {
	replacements = [
		{ template: "path", replaceWith: (file: File) => file.path },
		{
			template: "link",
			replaceWith: (file: File) => `[[${file.basename}]]`,
		},
		{ template: "name", replaceWith: (file: File) => file.basename },
		{
			template: "tags",
			replaceWith: (file: File) => "#tags not implemented for tests",
		},
		{
			template: "ctime",
			replaceWith: (file: File) =>
				moment(file.stat.ctime).format("HH:mm:ss"),
		},
		{
			template: "mtime",
			replaceWith: (file: File) =>
				moment(file.stat.mtime).format("HH:mm:ss"),
		},
	];
}
