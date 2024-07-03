import { ReplacementDictionary } from "../../interfaces/ReplacementDictionary";
import { File } from "../../interfaces/File";
import { TFile, getAllTags, moment } from "obsidian";
import { getLogNote } from "../log_note/logNote";
import { getPlugin, getSettings } from "../settings/settings";

export class ObsidianReplacementDictionary extends ReplacementDictionary {
	replacements = [
		{ template: "path", replaceWith: (file: File) => file.path },
		{
			template: "link",
			replaceWith: (file: File) =>
				getPlugin().app.fileManager.generateMarkdownLink(
					file as TFile,
					getLogNote()?.path || "",
				),
		},
		{ template: "name", replaceWith: (file: File) => file.basename },
		{
			template: "tags",
			replaceWith: (file: File) => getTags(file),
		},
		{
			template: "ctime",
			replaceWith: (file: File) =>
				moment(file.stat.ctime).format(getSettings().timeFormat),
		},
		{
			template: "mtime",
			replaceWith: (file: File) =>
				moment(file.stat.mtime).format(getSettings().timeFormat),
		},
	];
}

function getTags(file: File) {
	const cache = getPlugin().app.metadataCache.getFileCache(file as TFile);
	if (!cache) return "";
	const tags = getAllTags(cache);
	if (!tags) return "";
	return tags.map((tag) => "\\" + tag).join(", ");
}
