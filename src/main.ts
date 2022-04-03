import {
	CachedMetadata,
	Notice,
	Plugin,
	TFile,
	moment,
	TagCache,
	FrontMatterCache,
	TAbstractFile,
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
	blacklistedTags: string[];
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

	onunload() {
		this.app.vault.off("modify", this.onModify);
	}

	onModify = async (file: TAbstractFile) => {
		this.blacklistedTags = this.settings.tags.replace(/\s/g, "").split(",");
		this.currentFile = file as TFile;

		const dailyNoteFormat: string = this.settings.dailyNoteFormat;
		this.dailyFile = this.app.vault.getAbstractFileByPath(
			moment().format(dailyNoteFormat) + ".md"
		) as TFile;

		const outputFormat: string = this.settings.outputFormat;
		this.resolvedOutput = outputFormat.replace(
			"[[link]]",
			`[[${this.currentFile.basename}]]`
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

	// broken
	fileMeetsTagRequirements(): boolean {
		for (const tag of this.blacklistedTags) {
			if (
				this.tagMetadataContainsTag(tag) ||
				this.frontmatterMetadataContainsTag(tag)
			)
				return false;
		}
		return true;
	}

	tagMetadataContainsTag(tagToMatch: string): boolean {
		const tagCache: TagCache[] = this.currentFileCache.tags;
		if (!tagCache) return false;
		// console.log('tag cache is ' + tagCache.forEach(console.log))
		return tagCache.some((tag) => tag.tag === tagToMatch);
	}

	frontmatterMetadataContainsTag(tagToMatch: string): boolean {
		const frontmatterCache: FrontMatterCache =
			this.currentFileCache.frontmatter;
		if (!frontmatterCache) return false;
		return frontmatterCache.tags.some((tag: string) => tag === tagToMatch);
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
