import { serialize } from "monkey-around";
import {
	getSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";
import { TAbstractFile, TFile } from "obsidian";
import { consoleWarnIfVerboseMode } from "../../utils/alerter";
import { isLogNote } from "../log_note/logNote";
import { findTrackedFileWithPath } from "../../logic/file_tracking/findTrackedFileWithPath";
import { setLastPerformedAction } from "../file_tracking/lastPerformedAction";

const onVaultCreate = serialize(async (file: TAbstractFile) => {
	const settings = getSettings();

	if (!(file instanceof TFile)) return;

	if (isLogNote(file)) return;

	setLastPerformedAction("created");

	consoleWarnIfVerboseMode(
		"File created: " + file.path,
		settings.verboseModeEnabled
	);

	const currFile = findTrackedFileWithPath(file.path, settings);

	if (currFile) {
		// it probably existed then got deleted
		currFile.supposedList = "created";
		currFile.matchesCriteria = false;
	} else {
		// bandaid fix for syncthing sync solution, common among Obsidian users
		if (file.basename.contains("~syncthing~")) {
			return;
		}

		settings.trackedFiles.push({
			path: file.path,
			supposedList: "created",
			matchesCriteria: false,
		});
	}

	saveSettingsAndWriteToLogNote();
});

export default onVaultCreate;
