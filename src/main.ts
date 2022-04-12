import { serialize } from "monkey-around";
import {
	CachedMetadata,
	Notice,
	Plugin,
	TFile,
	moment,
	getAllTags,
} from "obsidian";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import {
	ListModifiedSettings,
	DEFAULT_SETTINGS,
	ListModifiedSettingTab,
} from "./settings";

// const templates: readonly [string[], string[]] = [
// 	['[[link]]', 'f'],
// 	['fsdf', 'dsfdsf'],
// ]

export default class ListModified extends Plugin {
	settings: ListModifiedSettings;

	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.metadataCache.on("changed", this.onCacheChange)
		);

		this.addSettingTab(new ListModifiedSettingTab(this.app, this));
	}

	onCacheChange = serialize(
		async (file: TFile, _data: string, cache: CachedMetadata) => {
			const modifiedFile = file as TFile;

			const dailyNote: TFile = getDailyNote(moment(), getAllDailyNotes());

			if (!dailyNote) {
				new Notice(`Your daily note doesn't exist! Cannot append link`);
				return;
			}

			if (modifiedFile === dailyNote) return;
			if (this.fileIsLinked(modifiedFile, dailyNote.path)) return;
			if (!this.fileMeetsTagRequirements(cache)) return;

			this.appendLink(dailyNote, modifiedFile);
		}
	);

	async appendLink(dailyNote: TFile, currentFile: TFile) {
		const content: string = await this.app.vault.read(dailyNote);

		const outputFormat: string = this.settings.outputFormat;

		const resolvedOutput: string = outputFormat.replace(
			"[[link]]",
			this.app.fileManager.generateMarkdownLink(
				currentFile,
				dailyNote.path
			)
		);

		const newContent: string =
			content.slice(-1) === "\n"
				? content + resolvedOutput + "\n"
				: content + "\n" + resolvedOutput;
		await this.app.vault.modify(dailyNote, newContent);
	}

	fileIsLinked(currentFile: TFile, formattedDailyNote: string): boolean {
		const backlinks: string[] = Object.keys(
			// @ts-ignore
			this.app.metadataCache.getBacklinksForFile(currentFile).data
		);
		console.log(backlinks);
		console.log(formattedDailyNote);
		if (!backlinks) return false;
		return backlinks.some((l) => l === formattedDailyNote);
	}

	fileMeetsTagRequirements(fileCache: CachedMetadata): boolean {
		const currentFileTags: string[] = getAllTags(fileCache);
		const ignoredTags = this.settings.tags.replace(/\s/g, "").split(",");
		return !ignoredTags.some((ignoredTag: string) =>
			currentFileTags.contains(ignoredTag)
		);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onunload() {}
}
