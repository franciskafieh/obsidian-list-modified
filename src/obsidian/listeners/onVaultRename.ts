import { serialize } from "monkey-around";
import { TAbstractFile, TFile } from "obsidian";
import {
	getPlugin,
	getSettings,
	saveSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";
import { consoleWarnIfVerboseMode } from "../../utils/alerter";
import { findTrackedFileWithPath } from "../../logic/file_tracking/findTrackedFileWithPath";

const onVaultRename = serialize(
	async (file: TAbstractFile, oldPath: string) => {
		if (file instanceof TFile) {
			const settings = getSettings();

			consoleWarnIfVerboseMode(
				"File renamed: " + file.path,
				settings.verboseModeEnabled,
			);

			// if entry with current new path, remove it (assume it was previously deleted)
			const currFile = findTrackedFileWithPath(file.path, settings);

			if (currFile) {
				settings.trackedFiles.remove(currFile);
			}

			// rename file in tracked files array
			const oldFile = findTrackedFileWithPath(oldPath, settings);
			if (oldFile) {
				oldFile.path = file.path;
			}

			// this makes sure link does not mess up if user has alwaysUpdateLinks disabled
			// @ts-ignore
			if (!getPlugin().app.vault.getConfig("alwaysUpdateLinks")) {
				await saveSettings();
			} else {
				await saveSettingsAndWriteToLogNote();
			}
		}
	},
);

export default onVaultRename;
