import {
	// moment,
	// CachedMetadata,
	Plugin,
	// TFile,
	// getAllTags,
	// Notice,
	// HeadingCache,
} from "obsidian";
import { ListModifiedSettingTab } from "./io/settingsTab";
// import { serialize } from "monkey-around";
// import {
// 	createDailyNote,
// 	getAllDailyNotes,
// 	getDailyNote,
// } from "obsidian-daily-notes-interface";
import onMetadataCacheChanged from "./listeners/onMetadataCacheChanged";
import onVaultDelete from "./listeners/onVaultDelete";
import onVaultRename from "./listeners/onVaultRename";
import onVaultCreate from "./listeners/onVaultCreate";
import {
	getSettings,
	initSettings,
	saveSettingsAndWriteTrackedFiles,
} from "./io/settings";

export default class ListModified extends Plugin {
	async onload(): Promise<void> {
		await initSettings(this);

		const settings = getSettings();

		const writeIntervalInMs = settings.writeInterval * 1000;

		// if interval is 0, don't run the registerInterval and instead just run on modify for performance.
		if (writeIntervalInMs) {
			this.registerInterval(
				window.setInterval(async () => {
					await saveSettingsAndWriteTrackedFiles();
				}, writeIntervalInMs)
			);
		}

		this.registerEvent(
			this.app.metadataCache.on("changed", onMetadataCacheChanged)
		);
		this.registerEvent(this.app.vault.on("delete", onVaultDelete));
		this.registerEvent(this.app.vault.on("rename", onVaultRename));

		// onLayoutReady prevents this from firing for every single file in the vault on startup.
		this.app.workspace.onLayoutReady(async () => {
			this.registerEvent(this.app.vault.on("create", onVaultCreate));
		});

		this.addSettingTab(new ListModifiedSettingTab(this.app, this));
	}
}
// 	private noteTitleContainsIgnoredText(noteTitle: string): boolean {
// 		const ignoredText = this.settings.ignoredNameContains
// 			.replace(/\s/g, "")
// 			.split(",");

// 		return ignoredText.some((ignoredText: string) => {
// 			const title = noteTitle.toLowerCase();
// 			const text = ignoredText.toLowerCase();
// 			if (!text) {
// 				return false;
// 			}
// 			return title.includes(text);
// 		});
// 	}

// 	private cacheContainsIgnoredTag(cache: CachedMetadata): boolean {
// 		const currentFileTags: string[] = getAllTags(cache);
// 		const ignoredTags = this.settings.tags.replace(/\s/g, "").split(",");
// 		return ignoredTags.some((ignoredTag: string) =>
// 			currentFileTags.includes(ignoredTag)
// 		);
// 	}

// 	private pathIsExcluded(path: string): boolean {
// 		const excludedFolders = this.settings.excludedFolders;
// 		if (!excludedFolders) return false;
// 		const excludedFolderPaths: string[] = excludedFolders
// 			.replace(/\s*, | \s*,/, ",")
// 			.split(",")
// 			.map((item) => item.replace(/^\/|\/$/g, ""));

// 		const currentFilePath: string =
// 			this.app.vault.getAbstractFileByPath(path).parent.path;

// 		return excludedFolderPaths.some((excludedFolder: string) =>
// 			currentFilePath.startsWith(excludedFolder)
// 		);
// 	}

// 	updateTrackedFiles = serialize(async (doWrite?: boolean) => {
// 		await this.saveSettings();

// 		let dailyNote: TFile;

// 		try {
// 			dailyNote = getDailyNote(moment(), getAllDailyNotes());
// 		} catch (e) {
// 			new Notice("Unable to load daily note. See console for details.");
// 			console.error(e.message);
// 		}

// 		if (!dailyNote) {
// 			if (this.settings.automaticallyCreateDailyNote) {
// 				this.displayNotice(
// 					"Creating daily note since it did not exist..."
// 				);
// 				dailyNote = await createDailyNote(moment());
// 			}

// 			await saveSettingsAndWriteTrackedFiles();
// 		}

// 		const cache: CachedMetadata =
// 			this.app.metadataCache.getFileCache(dailyNote);

// 		let currentHeadings: HeadingCache[] = cache?.headings;

// 		const content: string[] = (await this.app.vault.read(dailyNote)).split(
// 			"\n"
// 		);

// 		// auto-create heading
// 		if (!currentHeadings || !this.settings.heading) {
// 			this.displayNotice(
// 				"Cannot find the designated heading in your file. Creating a default one for now..."
// 			);

// 			// mock heading for first run to avoid error
// 			currentHeadings = [
// 				{ heading: this.settings.heading, level: 1 } as HeadingCache,
// 			];

// 			await this.app.vault.append(
// 				dailyNote,
// 				"\n" +
// 					"# " +
// 					this.settings.heading +
// 					"\n" +
// 					this.settings.trackedFiles
// 						.map((path) => this.getFormattedOutput(path))
// 						.join("\n")
// 			);

// 			await this.saveSettings();
// 			return;
// 		}

// 		// if user set delay, do not write to file after initial run
// 		if (this.writeIntervalInMs && !doWrite) {
// 			return;
// 		}

// 		for (let i = 0; i < currentHeadings.length; i++) {
// 			if (currentHeadings[i].heading === this.settings.heading) {
// 				const startPos: number =
// 					currentHeadings[i].position.end.line + 1;
// 				if (currentHeadings[i + 1]) {
// 					const endPos: number =
// 						currentHeadings[i + 1].position.start.line - 1;
// 					content.splice(
// 						startPos,
// 						endPos - startPos,
// 						...this.settings.trackedFiles.map((path) =>
// 							this.getFormattedOutput(path)
// 						)
// 					);
// 				} else {
// 					const endPos: number = content.length;
// 					content.splice(
// 						startPos,
// 						endPos - startPos,
// 						...this.settings.trackedFiles.map((path) =>
// 							this.getFormattedOutput(path)
// 						)
// 					);
// 				}

// 				this.app.vault.modify(dailyNote, content.join("\n"));
// 			}
// 		}
// 	});
