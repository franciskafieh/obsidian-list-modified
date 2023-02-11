import { Notice, TFile, moment, getAllTags } from "obsidian";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import { getSettings } from "../io/settings";

export function displayNotice(message: string) {
	new Notice("[Obsidian List Modified] " + message);
}

export function consoleWarn(message: string) {
	console.warn("[Obsidian List Modified] " + message);
}

export function getFormattedOutput(path: string): string {
	const file: TFile = app.vault.getAbstractFileByPath(path) as TFile;

	return getSettings()
		.outputFormat.replace(
			"[[link]]",
			this.app.fileManager.generateMarkdownLink(
				file,
				getDailyNote(moment(), getAllDailyNotes()).path
			)
		)
		.replace(/\[\[name]]/g, file.basename)
		.replace(
			/\[\[tags]]/g,
			getAllTags(this.app.metadataCache.getFileCache(file))
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
