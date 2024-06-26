import { serialize } from "monkey-around";
import { CachedMetadata, TFile, getAllTags, moment } from "obsidian";
import { isNewDay } from "../../logic/isNewDay";
import {
	getSettings,
	saveSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";
import { displayNoticeAndWarn } from "../../utils/alerter";
import { findTrackedFileWithPath } from "../../logic/findTrackedFileWithPath";
import fileMatchesCriteria from "../../logic/fileMatchesCriteria";
import { isLogNote } from "../logNote/logNote";

const onMetadataCacheChanged = serialize(
	async (file: TFile, _data: string, cache: CachedMetadata) => {
		const settings = getSettings();
		let newDay = false;

		if (true) {
			// if (isNewDay(settings)) {
			newDay = true;

			displayNoticeAndWarn("New note time period detected, resetting...");
			// force write to log note
			await saveSettingsAndWriteToLogNote(true);

			const lastTrackedDate = moment(settings.lastTrackedDate);
			const today = moment().format("YYYY-MM-DD");

			if (settings.verboseModeEnabled) {
				console.log(
					`New day detected, last tracked date was ${lastTrackedDate.format(
						"YYYY-MM-DD",
					)}, now it is ${today}`,
				);
			}
			settings.trackedFiles = [];

			settings.lastTrackedDate = today;

			await saveSettings(); // todo - should log file be updated here here?
		}

		if (isLogNote(file)) return;

		const matchesCriteria = fileMatchesCriteria(
			file,
			getAllTags(cache),
			settings,
		);

		if (!matchesCriteria) return;

		const currFile = findTrackedFileWithPath(file.path, settings);

		if (currFile) {
			currFile.matchesCriteria = matchesCriteria;
			console.log(newDay + "1"); // TEMP
			// if new day and currFile is created, make it modified ???
		} else {
			console.log(newDay + "2"); // TEMP
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
