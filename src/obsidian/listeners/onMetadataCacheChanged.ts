import { serialize } from "monkey-around";
import { CachedMetadata, TFile, getAllTags, moment } from "obsidian";
import { isNewNotePeriod } from "../../logic/file_tracking/isNewNotePeriod";
import {
	getSettings,
	saveSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";
import { consoleWarn, consoleWarnIfVerboseMode } from "../../utils/alerter";
import { findTrackedFileWithPath } from "../../logic/file_tracking/findTrackedFileWithPath";
import fileMatchesCriteria from "../../logic/file_tracking/fileMatchesCriteria";
import { isLogNote } from "../logNote/logNote";
import { resetToNewNotePeriod } from "../../logic/file_tracking/resetToNewNotePeriod";
import { runLogicAndReturnIfNewPeriod } from "../file_tracking/runLogicAndReturnIfNewPeriod";

const onMetadataCacheChanged = serialize(
	async (file: TFile, _data: string, cache: CachedMetadata) => {
		const settings = getSettings();
		consoleWarnIfVerboseMode(
			"File modified: " + file.path,
			settings.verboseModeEnabled,
		);

		// if mtime is not within 1 second of now, ignore. Most likely an indexed file
		if (Date.now() - file.stat.mtime >= 1000) {
			consoleWarnIfVerboseMode(
				"Mtime not within 1 second of now. Returning...",
				settings.verboseModeEnabled,
			);
			return;
		}

		const isNewNotePeriod = runLogicAndReturnIfNewPeriod(settings);

		if (isLogNote(file)) {
			consoleWarnIfVerboseMode(
				"File is log note. Returning...",
				settings.verboseModeEnabled,
			);
			return;
		}

		const matchesCriteria = fileMatchesCriteria(
			file,
			getAllTags(cache),
			settings,
		);

		consoleWarnIfVerboseMode(
			"File matches criteria: " + matchesCriteria,
			settings.verboseModeEnabled,
		);

		const currFile = findTrackedFileWithPath(file.path, settings);

		if (currFile) {
			consoleWarnIfVerboseMode(
				"file already tracked",
				settings.verboseModeEnabled,
			);
			currFile.matchesCriteria = matchesCriteria;
		} else {
			consoleWarnIfVerboseMode(
				"file not tracked. pushing...",
				settings.verboseModeEnabled,
			);
			settings.trackedFiles.push({
				path: file.path,
				matchesCriteria: matchesCriteria,
				supposedList: "modified",
			});
		}

		saveSettingsAndWriteToLogNote();
	},
);

export default onMetadataCacheChanged;
