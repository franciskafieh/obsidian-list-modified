import { ReplacementDictionary } from "../../../interfaces/context/ReplacementDictionary";
import { File } from "../../../interfaces/File";
import { TFile, moment } from "obsidian";
import { getLogNote } from "../../log_note/logNote";
import { getPlugin, getSettings } from "../../settings/settings";
import { FileMetadataCacheProvider } from "../../../interfaces/context/FileMetadataCacheProvider";
import { file } from "bun";

export class ObsidianReplacementDictionary extends ReplacementDictionary {
	replacements = [
		{ template: "path", replaceWith: (file: File) => file.path },
		{
			template: "link",
			replaceWith: (file: File) =>
				getPlugin().app.fileManager.generateMarkdownLink(
					file as TFile,
					getLogNote()?.path || ""
				),
		},
		{ template: "name", replaceWith: (file: File) => file.basename },
		{
			template: "tags",
			replaceWith: (
				file: File,
				fileMetadataCacheProvider: FileMetadataCacheProvider
			) => getTags(file, fileMetadataCacheProvider),
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
		{
			template: "uri",
			replaceWith: (file: File) =>
				// @ts-ignore - getObsidianUrl undocumented
				`[${file.basename}](${getPlugin().app.getObsidianUrl(file)})`,
		},
	];
}

function getTags(
	file: File,
	fileMetadataCacheProvider: FileMetadataCacheProvider
) {
	const tags = fileMetadataCacheProvider.getAllTagsFromFile(file);
	if (!tags) return "";
	return tags.map((tag) => "\\" + tag).join(", ");
}
