import { serialize } from "monkey-around";
import { CachedMetadata, TFile, getAllTags, moment } from "obsidian";
import { isNewNotePeriod } from "../../logic/file_tracking/isNewNotePeriod";
import {
	getSettings,
	saveSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";
import { displayNoticeAndWarn } from "../../utils/alerter";
import { findTrackedFileWithPath } from "../../logic/file_tracking/findTrackedFileWithPath";
import fileMatchesCriteria from "../../logic/file_tracking/fileMatchesCriteria";
import { isLogNote } from "../logNote/logNote";
import { resetToNewNotePeriod } from "../../logic/file_tracking/resetToNewNotePeriod";
import { runLogicAndReturnIfNewPeriod } from "../file_tracking/runLogicAndReturnIfNewPeriod";

const onMetadataCacheChanged = serialize(
	async (file: TFile, _data: string, cache: CachedMetadata) => {
		// if mtime is not within 1 second of now, ignore. Most likely an indexed file
		if (Date.now() - file.stat.mtime >= 1000) return;

		const settings = getSettings();
		const isNewNotePeriod = runLogicAndReturnIfNewPeriod(settings);

		if (isLogNote(file)) return;

		const matchesCriteria = fileMatchesCriteria(
			file,
			getAllTags(cache),
			settings,
		);

		const currFile = findTrackedFileWithPath(file.path, settings);

		if (currFile) {
			currFile.matchesCriteria = matchesCriteria;
		} else {
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
