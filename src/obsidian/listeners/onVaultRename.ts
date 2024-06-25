import { serialize } from "monkey-around";
import { TAbstractFile, TFile } from "obsidian";
import {
	getSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";
import { consoleWarn } from "../../utils/alerter";
import { findTrackedFileWithPath } from "../../logic/findTrackedFileWithPath";
import { TrackedFile } from "../../types";

const onVaultRename = serialize(
	async (file: TAbstractFile, oldPath: string) => {
		if (file instanceof TFile) {
			const settings = getSettings();

			if (settings.verboseModeEnabled) {
				consoleWarn("File renamed: " + file.path);
			}

			// if entry with current new path, remove it (assume it was previously deleted)
			settings.trackedFiles.remove(
				// @ts-ignore defined
				findTrackedFileWithPath(file.path, settings),
			);

			// rename file in tracked files array

			// @ts-ignore defined
			findTrackedFileWithPath(oldPath, settings).path = file.path;

			await saveSettingsAndWriteToLogNote();
		}
	},
);

export default onVaultRename;
