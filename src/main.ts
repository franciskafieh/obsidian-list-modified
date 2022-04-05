import {
	CachedMetadata,
	Notice,
	Plugin,
	TFile,
	moment,
	TAbstractFile,
	getAllTags,
} from "obsidian";
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
	ignoredTags: string[];
	currentFile: TFile;
	dailyFile: TFile;
	resolvedOutput: string;
	currentFileCache: CachedMetadata;
	dailyFileCache: CachedMetadata;
	dailyFileContent: string;

	async onload() {
		await this.loadSettings();

		this.registerEvent(this.app.vault.on("modify", this.onModify));

		this.addSettingTab(new ListModifiedSettingTab(this.app, this));
	}

	onunload() {}

	onModify = async (file: TAbstractFile) => {
		this.ignoredTags = this.settings.tags.replace(/\s/g, "").split(",");
		this.currentFile = file as TFile;

		// @ts-ignore
		// prettier-ignore
		const dailyNoteFormat: string = this.app.internalPlugins
				.getPluginById("daily-notes")
				.instance.options.format;

		this.dailyFile = this.app.vault.getAbstractFileByPath(
			moment().format(dailyNoteFormat) + ".md"
		) as TFile;

		const outputFormat: string = this.settings.outputFormat;
		this.resolvedOutput = outputFormat.replace(
			"[[link]]",
			this.app.fileManager.generateMarkdownLink(
				this.currentFile,
				this.dailyFile.path
			)
		);

		if (!this.dailyFile) {
			new Notice(
				`A daily file with format ${dailyNoteFormat} doesn't exist! Cannot append link`
			);
			return;
		}

		this.currentFileCache = this.app.metadataCache.getFileCache(
			this.currentFile
		);
		this.dailyFileCache = this.app.metadataCache.getFileCache(
			this.dailyFile
		);

		if (this.currentFile === this.dailyFile) return;

		if (this.fileIsLinked()) return;

		if (!this.fileMeetsTagRequirements()) return;

		this.dailyFileContent = await this.app.vault.read(this.dailyFile);

		await this.appendLink();
	};

	async appendLink(): Promise<void> {
		if (this.dailyFileContent.slice(-1) === "\n") {
			await this.app.vault.modify(
				this.dailyFile,
				this.dailyFileContent + this.resolvedOutput + "\n"
			);
		} else {
			await this.app.vault.modify(
				this.dailyFile,
				this.dailyFileContent + "\n" + this.resolvedOutput
			);
		}
	}

	fileIsLinked(): boolean {
		if (!this.dailyFileCache.links) return false;
		return this.dailyFileCache.links.some(
			(l) => l.link === this.currentFile.basename
		);
	}

	fileMeetsTagRequirements(): boolean {
		const currentFileTags: string[] = getAllTags(this.currentFileCache);
		return !this.ignoredTags.some((ignoredTag) =>
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
}
