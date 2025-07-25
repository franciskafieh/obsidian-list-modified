import { serialize } from "monkey-around";
import { TAbstractFile, TFile } from "obsidian";
import {
	getSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";
import { consoleWarnIfVerboseMode } from "../../utils/alerter";
import { findTrackedFileWithPath } from "../../logic/file_tracking/findTrackedFileWithPath";
import { isLogNote } from "../log_note/logNote";
import { setLastPerformedAction } from "../file_tracking/lastPerformedAction";

const onVaultDelete = serialize(async (file: TAbstractFile) => {
	if (!(file instanceof TFile)) return;

	const settings = getSettings();

	if (
		settings.excludedExtensions.includes(file.extension) ||
		file.extension === "tmp"
	) {
		consoleWarnIfVerboseMode(
			`ignoring deleted ${file.path} file since it has extension`,
			getSettings().verboseModeEnabled
		);
		return;
	}

	setLastPerformedAction("deleted");
	consoleWarnIfVerboseMode(
		"Delete called for " + file.path,
		settings.verboseModeEnabled
	);

	if (isLogNote(file)) {
		consoleWarnIfVerboseMode(
			"Delete: File is log note. Returning...",
			settings.verboseModeEnabled
		);
		return;
	}

	consoleWarnIfVerboseMode(
		"File deleted: " + file.path,
		settings.verboseModeEnabled
	);

	const currFile = findTrackedFileWithPath(file.path, settings);

	if (currFile) {
		currFile.supposedList = "deleted";
	} else {
		settings.trackedFiles.push({
			path: file.path,
			supposedList: "deleted",
			matchesCriteria: true,
		});
	}

	saveSettingsAndWriteToLogNote();
});

export default onVaultDelete;
