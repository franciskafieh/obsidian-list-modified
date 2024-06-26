import { serialize } from "monkey-around";
import {
	getSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";
import { TAbstractFile, TFile } from "obsidian";
import { consoleWarn } from "../../utils/alerter";
import { isLogNote } from "../logNote/logNote";
import { findTrackedFileWithPath } from "../../logic/file_tracking/findTrackedFileWithPath";
import { runLogicAndReturnIfNewPeriod } from "../file_tracking/runLogicAndReturnIfNewPeriod";

const onVaultCreate = serialize(async (file: TAbstractFile) => {
	const settings = getSettings();

	if (settings.verboseModeEnabled) {
		consoleWarn("File created: " + file.path);
	}

	if (!(file instanceof TFile)) return;

	if (isLogNote(file)) return;

	const isNewNotePeriod = runLogicAndReturnIfNewPeriod(settings);

	const currFile = findTrackedFileWithPath(file.path, settings);

	if (currFile) {
		// it probably existed then got deleted
		currFile.supposedList = "created";
		currFile.matchesCriteria = false;
	} else {
		settings.trackedFiles.push({
			path: file.path,
			supposedList: "created",
			matchesCriteria: false,
		});
	}

	saveSettingsAndWriteToLogNote();
});

export default onVaultCreate;
