import { serialize } from "monkey-around";
import { TAbstractFile, TFile, getAllTags } from "obsidian";
import {
	getPlugin,
	getSettings,
	saveSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";
import { consoleWarnIfVerboseMode } from "../../utils/alerter";
import { findTrackedFileWithPath } from "../../logic/file_tracking/findTrackedFileWithPath";
import fileMatchesCriteria from "../../logic/file_tracking/fileMatchesCriteria";

const onVaultRename = serialize(
	async (file: TAbstractFile, oldPath: string) => {
		if (!(file instanceof TFile)) return;

		const settings = getSettings();

		consoleWarnIfVerboseMode(
			"File renamed: " + file.path,
			settings.verboseModeEnabled
		);

		// if entry with current new path, remove it (assume it was previously deleted)
		const currFile = findTrackedFileWithPath(file.path, settings);

		if (currFile) {
			settings.trackedFiles.remove(currFile);
		}

		const oldFile = findTrackedFileWithPath(oldPath, settings);
		const tags =
			// @ts-ignore
			getAllTags(
				getPlugin().app.metadataCache.getFileCache(file) || {}
			)?.map((tag) => tag.substring(1)) || null;

		if (oldFile) {
			// rename file if exists previously in tracked files array
			oldFile.path = file.path;
			// update file matches criteria since the file was moved (e.g. new name, new path)
			oldFile.matchesCriteria = fileMatchesCriteria(file, tags, settings);
		}

		// this makes sure link does not mess up if user has alwaysUpdateLinks disabled
		// @ts-ignore
		if (!getPlugin().app.vault.getConfig("alwaysUpdateLinks")) {
			await saveSettings();
		} else {
			await saveSettingsAndWriteToLogNote();
		}
	}
);

export default onVaultRename;
