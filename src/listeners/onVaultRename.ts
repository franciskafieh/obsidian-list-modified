import { serialize } from "monkey-around";
import { TAbstractFile, TFile } from "obsidian";
import {
	getSettings,
	saveSettings,
	saveSettingsAndWriteTrackedFiles,
} from "src/io/settings";
import { noteTitleContainsIgnoredText } from "./onMetadataCacheChanged";

const onVaultRename = serialize(
	async (file: TAbstractFile, oldPath: string) => {
		if (file instanceof TFile) {
			const settings = getSettings();

			// if entry with current new path, remove it (assume it was previously deleted)
			settings.trackedFiles.remove(
				settings.trackedFiles.find(({ path }) => path === file.path)
			);

			// rename file in tracked files array
			const currentFile = settings.trackedFiles.find(
				({ path }) => path === oldPath
			);

			currentFile.path = file.path;

			// if new name is ignored, delete from list
			const f = app.vault.getAbstractFileByPath(currentFile.path);
			if (f instanceof TFile) {
				if (noteTitleContainsIgnoredText(f.basename)) {
					settings.trackedFiles.remove(currentFile);
				}
			}

			// obsidian already handles link renames
			if (settings.outputFormat.includes("[[link]]")) {
				await saveSettings();
			} else {
				await saveSettingsAndWriteTrackedFiles();
			}
		}
	}
);

export default onVaultRename;
