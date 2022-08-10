import {
	moment,
	CachedMetadata,
	Plugin, TFile, TAbstractFile
} from "obsidian";
import {
	ListModifiedSettings,
	DEFAULT_SETTINGS,
	ListModifiedSettingTab,
} from "./settings";
import { serialize } from "monkey-around";

export default class ListModified extends Plugin {
	settings: ListModifiedSettings;
	workingFiles: Set<TFile>;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerEvent(
			this.app.metadataCache.on("changed", this.onCacheChange)
		);
		
		this.registerEvent(this.app.vault.on("delete", this.onVaultDelete));
		this.registerEvent(this.app.vault.on("rename", this.onVaultRename));

		this.workingFiles = new Set<TFile>();

		this.addSettingTab(new ListModifiedSettingTab(this.app, this));
	}

	private onCacheChange = serialize(
        async (file: TFile, data: string, cache: CachedMetadata) => {
			const trackedFiles = this.settings.trackedFiles;
			const currentDate = moment().format('YYYY-MM-DD');
			
			if (this.settings.lastTrackedDate !== currentDate) {
				// TODO: setup new day....
				this.settings.lastTrackedDate = currentDate;
			}
			const path: string = file.path;
			// make shift set
			if (!trackedFiles.contains(path) && !this.isTagIgnore(path) && !this.isPathExcluded(path)) {
				trackedFiles.push(path);

			} else {

			}

			console.log(trackedFiles)
			this.updateTrackedFiles();
            // console.log(cache.headings.find(item => item.heading.contains('lol')));
        }
    );

	private isTagIgnore(path: string): boolean {
		// TODO: remove
		if (path === "test.md") return true;
		return false;
	}

	private isPathExcluded(path: string): boolean {
		return false;
	}

	private onVaultDelete = serialize(
		async(file: TAbstractFile) => {
			if (file instanceof TFile) {
				if (this.settings.trackedFiles.contains(file.path)) {
					this.settings.trackedFiles.remove(file.path);
					this.updateTrackedFiles();
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
					this.updateTrackedFiles()
				}
			}
		}
	);


	private updateTrackedFiles = serialize(
		async() => {
			this.saveSettings();
			const f: TFile = this.app.vault.getAbstractFileByPath("test.md") as TFile;
			this.app.vault.modify(f, "dasdasd");
		}
	);



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