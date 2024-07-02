import { serialize } from "monkey-around";
import { TAbstractFile, TFile } from "obsidian";
import {
	getSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";
import { consoleWarn, consoleWarnIfVerboseMode } from "../../utils/alerter";
import { findTrackedFileWithPath } from "../../logic/file_tracking/findTrackedFileWithPath";
import { getLogNote, isLogNote } from "../log_note/logNote";
import {
	getLastPerformedAction,
	setLastPerformedAction,
} from "../file_tracking/lastPerformedAction";
import { runLogicAndReturnIfNewPeriod } from "../file_tracking/runLogicAndReturnIfNewPeriod";

const onVaultDelete = serialize(async (file: TAbstractFile) => {
	if (!(file instanceof TFile)) return;
	setLastPerformedAction("deleted");
	const settings = getSettings();
	consoleWarnIfVerboseMode(
		"Delete called for " + file.path,
		settings.verboseModeEnabled,
	);

	// delete does not call cache changed, can do this here
	const isNewNotePeriod = await runLogicAndReturnIfNewPeriod(
		settings,
		getLastPerformedAction(),
	);

	if (isLogNote(file)) {
		consoleWarnIfVerboseMode(
			"Delete: File is log note. Returning...",
			settings.verboseModeEnabled,
		);
		return;
	}

	consoleWarnIfVerboseMode(
		"File deleted: " + file.path,
		settings.verboseModeEnabled,
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
