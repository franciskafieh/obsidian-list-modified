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

			if (modifiedFile === dailyNote) return;
			if (this.fileIsLinked(modifiedFile.path, dailyNote.path)) return;
			if (this.fileContainsIgnoredTag(cache)) return;
			if (this.fileIsInExcludedFolder(modifiedFile)) return;
			this.appendLink(dailyNote, modifiedFile);
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
		if (!resolvedLinks) return false;
		const links: string[] = Object.keys(resolvedLinks);
		if (!links) return false;
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
		const excludedFolderPaths: string[][] = this.settings.excludedFolders
			.replace(/, +/g, ",")
			.split(",")
			.map((item) => item.replace(/^\/|\/$/g, "").split("/"));

		const parentPathFolders = file.parent.path.split("/");

		for (let i = 0; i < parentPathFolders.length; i++) {
			for (let j = 0; j < excludedFolderPaths.length; j++) {
				if (parentPathFolders[i] !== excludedFolderPaths[j][i])
					return false;
			}
		}
		return true;
	}

	private async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}
}
