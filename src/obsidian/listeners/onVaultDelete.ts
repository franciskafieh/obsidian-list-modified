import { serialize } from "monkey-around";
import { TAbstractFile, TFile } from "obsidian";
import {
	getSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";
import { consoleWarn } from "../../utils/alerter";
import { findTrackedFileWithPath } from "../../logic/file_tracking/findTrackedFileWithPath";
import { isLogNote } from "../logNote/logNote";
import { runLogicAndReturnIfNewPeriod } from "../file_tracking/runLogicAndReturnIfNewPeriod";

const onVaultDelete = serialize(async (file: TAbstractFile) => {
	if (!(file instanceof TFile)) return;

	if (isLogNote(file)) return;

	const settings = getSettings();

	if (settings.verboseModeEnabled) {
		consoleWarn("File deleted: " + file.path);
	}

	const isNewNotePeriod = runLogicAndReturnIfNewPeriod(settings);

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
