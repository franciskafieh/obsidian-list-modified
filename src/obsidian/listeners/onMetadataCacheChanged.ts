import { serialize } from "monkey-around";
import { CachedMetadata, TFile, getAllTags } from "obsidian";
import {
	getSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";
import { consoleWarnIfVerboseMode } from "../../utils/alerter";
import { findTrackedFileWithPath } from "../../logic/file_tracking/findTrackedFileWithPath";
import fileMatchesCriteria from "../../logic/file_tracking/fileMatchesCriteria";
import { isLogNote } from "../log_note/logNote";
import { runLogicAndReturnIfNewPeriod } from "../file_tracking/runLogicAndReturnIfNewPeriod";
import {
	getLastPerformedAction,
	setLastPerformedAction,
} from "../file_tracking/lastPerformedAction";

const onMetadataCacheChanged = serialize(
	async (file: TFile, _data: string, cache: CachedMetadata) => {
		const settings = getSettings();
		consoleWarnIfVerboseMode(
			"File modified: " + file.path,
			settings.verboseModeEnabled
		);

		// if mtime is not within 1 second of now, ignore. Most likely a file being indexed/synced
		if (Date.now() - file.stat.mtime >= 1000) {
			consoleWarnIfVerboseMode(
				"Mtime not within 1 second of now. Returning...",
				settings.verboseModeEnabled
			);
			return;
		}

		const isNewNotePeriod = await runLogicAndReturnIfNewPeriod(
			settings,
			getLastPerformedAction()
		);

		if (isLogNote(file)) {
			consoleWarnIfVerboseMode(
				"File is log note. Returning...",
				settings.verboseModeEnabled
			);
			return;
		}

		const matchesCriteria = fileMatchesCriteria(
			file,
			getAllTags(cache)?.map((tag) => tag.substring(1)) || null,
			settings
		);

		consoleWarnIfVerboseMode(
			"File matches criteria: " + matchesCriteria,
			settings.verboseModeEnabled
		);

		const currFile = findTrackedFileWithPath(file.path, settings);

		if (currFile) {
			consoleWarnIfVerboseMode(
				"file already tracked",
				settings.verboseModeEnabled
			);
			currFile.matchesCriteria = matchesCriteria;
		} else {
			if (!matchesCriteria) {
				return;
			}

			const list = isNewNotePeriod
				? getLastPerformedAction()
				: "modified";

			consoleWarnIfVerboseMode(
				`file ${file.path} not tracked. pushing to list ${list}...`,
				settings.verboseModeEnabled
			);

			settings.trackedFiles.push({
				path: file.path,
				matchesCriteria: matchesCriteria,
				supposedList: list,
			});
		}

		saveSettingsAndWriteToLogNote();
		setLastPerformedAction("modified");
	}
);

export default onMetadataCacheChanged;
