import { Notice, TFile, moment, getAllTags } from "obsidian";
import { getSettings } from "../io/settings";
import { getLogNote } from "../io/noteCache";

export function displayNotice(message: string) {
	new Notice("[Obsidian List Modified] " + message);
}

export function consoleWarn(message: string) {
	console.warn("[Obsidian List Modified] " + message);
}

export function getFormattedOutput(path: string): string {
	const file: TFile = app.vault.getAbstractFileByPath(path) as TFile;

	// for deleted section, etc where no metadata is stored
	if (!file) {
		return "- " + path;
	}

	return getSettings()
		.outputFormat.replace(
			"[[link]]",
			this.app.fileManager.generateMarkdownLink(
				file,
				getLogNote()?.path || ""
			)
		)
		.replace(/\[\[name]]/g, file.basename)
		.replace(
			/\[\[tags]]/g,
			(getAllTags(this.app.metadataCache.getFileCache(file)) || [""])
				.map((tag) => "\\" + tag)
				.join(", ")
		)
		.replace(/\[\[ctime]]/g, moment(file.stat.ctime).format("YYYY-MM-DD"));
}

export function getFormattedHeading(heading: string) {
	return getSettings().appendSpaceAfterHeadings
		? heading + "\n\n"
		: heading + "\n";
}
