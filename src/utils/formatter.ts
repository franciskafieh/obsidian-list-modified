import { Notice, TFile, moment, getAllTags } from "obsidian";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";

export function displayNotice(message: string) {
	new Notice("[Obsidian List Modified] " + message);
}

export function getFormattedOutput(path: string): string {
	const file: TFile = this.app.vault.getAbstractFileByPath(path) as TFile;

	return this.settings.outputFormat
		.replace(
			"[[link]]",
			this.app.fileManager.generateMarkdownLink(
				file,
				getDailyNote(moment(), getAllDailyNotes()).path
			)
		)
		.replace("[[name]]", file.basename)
		.replace(
			"[[tags]]",
			getAllTags(this.app.metadataCache.getFileCache(file))
				.map((tag) => "\\" + tag)
				.join(", ")
		)
		.replace("[[ctime]]", moment(file.stat.ctime).format("YYYY-MM-DD"));
}
