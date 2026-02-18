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

		// if mtime is not within the configured threshold of now, ignore.
		// This is to prevent "echoes" (Obsidian reacting to its own internal updates)
		// and to ignore old files during startup scans or cloud syncs.
		// Default is 1 second (1000ms). Can be increased for external tools (CLI).
		const threshold = settings.timeoutThreshold * 1000;

		if (Date.now() - file.stat.mtime >= threshold) {
			consoleWarnIfVerboseMode(
				`Mtime not within ${settings.timeoutThreshold} second(s) of now. Returning...`,
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
