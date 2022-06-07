import { serialize } from "monkey-around";
import {
	CachedMetadata,
	Notice,
	Plugin,
	TFile,
	moment,
	getAllTags,
} from "obsidian";
import {
	getAllDailyNotes,
	getDailyNote,
	createDailyNote,
} from "obsidian-daily-notes-interface";
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

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onunload() {}

	private onCacheChange = serialize(
		async (file: TFile, _data: string, cache: CachedMetadata) => {
			const modifiedFile = file as TFile;

			let dailyNote: TFile;

			try {
				dailyNote = getDailyNote(moment(), getAllDailyNotes());
			} catch (e) {
				new Notice(
					"Unable to create daily note. See console for details."
				);
				console.log(e.message);
			}

			if (!dailyNote) {
				if (!this.settings.automaticallyCreateDailyNote) return;

				new Notice("Creating daily note since it did not exist...");
				dailyNote = await createDailyNote(moment());
			}

			console.log(`=============== FILE "${modifiedFile.name}" MODIFIED, DAILY NOTE "${dailyNote.name}" EXISTS (TIME: ${moment().format('HH:mm:ss:SS')}) ===================`)

			if (modifiedFile === dailyNote) return;

			console.log("FILE IS NOT DAILY NOTE");
			if (this.fileIsLinked(modifiedFile.path, dailyNote.path)) return;

			console.log("FILE IS NOT ALREADY LINKED");
			if (this.fileContainsIgnoredTag(cache)) return;

			console.log("FILE DOES NOT CONTAIN IGNORED TAGS");
			if (this.fileIsInExcludedFolder(modifiedFile)) return;

			console.log("FILE IS NOT IN EXCLUDED FOLDER");
			this.appendLink(dailyNote, modifiedFile);

			console.log("LINK APPENDED")
		}
	);

	private async appendLink(dailyNote: TFile, currentFile: TFile) {
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

	private fileIsLinked(
		currentFilePath: string,
		dailyNotePath: string
	): boolean {
		const resolvedLinks =
			this.app.metadataCache.resolvedLinks[dailyNotePath];
		console.log("resolved links: " + resolvedLinks);
		if (!resolvedLinks) return false;
		const links: string[] = Object.keys(resolvedLinks);

		console.log("links: " + links);
		if (!links) return false;
		console.log("current file path is " + currentFilePath);
		return links.some((l) => l === currentFilePath);
	}

	private fileContainsIgnoredTag(fileCache: CachedMetadata): boolean {
		const currentFileTags: string[] = getAllTags(fileCache);
		const ignoredTags = this.settings.tags.replace(/\s/g, "").split(",");
		return ignoredTags.some((ignoredTag: string) =>
			currentFileTags.contains(ignoredTag)
		);
	}

	private fileIsInExcludedFolder(file: TFile): boolean {
		const excludedFolders = this.settings.excludedFolders;

		if (!excludedFolders) return false;

		const excludedFolderPaths: string[] = excludedFolders
			.replace(/\s*, | \s*,/, ",")
			.split(",")
			.map(item => item.replace(/^\/|\/$/g, ""));

		const currentFilePath: string = file.parent.path;
		console.log(excludedFolderPaths)
		return excludedFolderPaths.some((excludedFolder: string) =>
			currentFilePath.startsWith(excludedFolder)
		);
	}

	private async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}
}
