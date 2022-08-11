import {
	moment,
	CachedMetadata,
	Plugin,
	TFile,
	TAbstractFile,
	getAllTags,
	Notice,
	HeadingCache,
} from "obsidian";
import {
	ListModifiedSettings,
	DEFAULT_SETTINGS,
	ListModifiedSettingTab,
} from "./settings";
import { serialize } from "monkey-around";
import { createDailyNote, getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";

export default class ListModified extends Plugin {
	settings: ListModifiedSettings;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerEvent(
			this.app.metadataCache.on("changed", this.onCacheChange)
		);
		
		this.registerEvent(this.app.vault.on("delete", this.onVaultDelete));
		this.registerEvent(this.app.vault.on("rename", this.onVaultRename));

		this.addSettingTab(new ListModifiedSettingTab(this.app, this));
	}

	private onCacheChange = serialize(
        async (file: TFile, _data: string, cache: CachedMetadata) => {
			const trackedFiles = this.settings.trackedFiles;
			const currentDate = moment().format('YYYY-MM-DD');
			
			if (this.settings.lastTrackedDate !== currentDate) {
				this.settings.trackedFiles = [];
				this.settings.lastTrackedDate = currentDate;
			}

			const path: string = file.path;

			if (file === getDailyNote(moment(), getAllDailyNotes())) {
				return;
			}

			// make shift set
			if (!trackedFiles.contains(path) && !this.cacheContainsIgnoredTag(cache) && !this.pathIsExcluded(path)) {
				trackedFiles.push(path);
        	} 

			if (trackedFiles.contains(path) && this.cacheContainsIgnoredTag(cache) || this.pathIsExcluded(path)) {
				trackedFiles.remove(path);
				
			}

			await this.updateTrackedFiles();
		}
    );

	private cacheContainsIgnoredTag(cache: CachedMetadata): boolean {
		const currentFileTags: string[] = getAllTags(cache);
		const ignoredTags = this.settings.tags.replace(/\s/g, "").split(",");
		return ignoredTags.some((ignoredTag: string) =>
			currentFileTags.contains(ignoredTag)
		);
	}

	private pathIsExcluded(path: string): boolean {
		const excludedFolders = this.settings.excludedFolders;
		if (!excludedFolders) return false;
		const excludedFolderPaths: string[] = excludedFolders
			.replace(/\s*, | \s*,/, ",")
			.split(",")
			.map(item => item.replace(/^\/|\/$/g, ""));
		
		const currentFilePath: string = this.app.vault.getAbstractFileByPath(path).parent.path;

		return excludedFolderPaths.some((excludedFolder: string) =>
			currentFilePath.startsWith(excludedFolder)
		);
	}

	private onVaultDelete = serialize(
		async(file: TAbstractFile) => {
			if (file instanceof TFile) {
				if (this.settings.trackedFiles.contains(file.path)) {
					this.settings.trackedFiles.remove(file.path);
					await this.updateTrackedFiles();
				}
			}
		}
	);

	private onVaultRename = serialize(
		async(file: TAbstractFile, oldPath: string) => {
			if (file instanceof TFile) {
				if (this.settings.trackedFiles.contains(oldPath)) {
					this.settings.trackedFiles.remove(oldPath);
					this.settings.trackedFiles.push(file.path);
					// do not update file, just save settings. this is because obsidian already handles link renames
					await this.saveSettings();
				}
			}
		}
	);


	updateTrackedFiles = serialize(
		async() => {
			await this.saveSettings();

			let dailyNote: TFile;

			try {
				dailyNote = getDailyNote(moment(), getAllDailyNotes());
			} catch (e) {
				new Notice(
					"Unable to load daily note. See console for details."
				);
				console.log(e.message);
			}

			if (!dailyNote && this.settings.automaticallyCreateDailyNote) {
				new Notice("Creating daily note since it did not exist...");
				dailyNote = await createDailyNote(moment());
			}

			if (dailyNote) {
				const cache: CachedMetadata = this.app.metadataCache.getFileCache(dailyNote);
				const headings: HeadingCache[] = cache.headings;
				// this.app.vault.modify(dailyNote, .join('\n'));
				let content: string[] = (await this.app.vault.read(dailyNote)).split("\n");

				if (!headings || !this.settings.heading) {
					new Notice("Cannot create list. Please read the Obsidian List Modified 'Headings' settings.");
					return;
				}

				for (let i = 0; i < headings.length; i++) {
					if (headings[i].heading === this.settings.heading) {
						const startPos: number = headings[i].position.end.line + 1;
						if (headings[i + 1]) {
							const endPos: number = headings[i + 1].position.start.line - 1;
							content.splice(startPos, endPos - startPos, ...this.settings.trackedFiles.map(path => this.getFormattedOutput(path)));
						} else {
							const endPos: number = content.length;
							content.splice(startPos, endPos - startPos, ...this.settings.trackedFiles.map(path => this.getFormattedOutput(path)));
						}

						this.app.vault.modify(dailyNote, content.join("\n"));
						return;
					}
				}

				new Notice("Cannot create list. Please read the Obsidian List Modified settings.");
			}

		}
	);

	private getFormattedOutput(path: string): string {
		const file: TFile = this.app.vault.getAbstractFileByPath(path) as TFile;
		return this.settings.outputFormat
		.replace("[[link]]", this.app.fileManager.generateMarkdownLink(
			file,
			getDailyNote(moment(), getAllDailyNotes()).path
		))
		.replace("[[name]]", file.basename)
		.replace("[[tags]]", getAllTags(this.app.metadataCache.getFileCache(file)).map(tag => "\\" + tag).join(", "))
		.replace("[[ctime]]", moment(file.stat.ctime).format("YYYY-MM-DD"));

	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	private async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}
}