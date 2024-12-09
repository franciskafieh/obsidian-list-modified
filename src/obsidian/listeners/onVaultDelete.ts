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

	if (file.path.endsWith(".tmp")) {
		consoleWarnIfVerboseMode(
			`ignoring deleted ${file.path} file since it has .tmp extension`,
			getSettings().verboseModeEnabled
		);
		return;
	}

	setLastPerformedAction("deleted");
	const settings = getSettings();
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
		currFile.matchesCriteria = true;
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
