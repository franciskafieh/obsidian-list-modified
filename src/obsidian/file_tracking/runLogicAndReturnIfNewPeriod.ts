import { Settings } from "../../interfaces/Settings";
import { isNewNotePeriod } from "../../logic/file_tracking/isNewNotePeriod";
import { removeDividers } from "../../logic/log_note/removeDividers";
import { ListType } from "../../types";
import {
	consoleWarnIfVerboseMode,
	displayNoticeAndWarn,
} from "../../utils/alerter";
import { getLastLogNote } from "../log_note/logNote";
import { getPlugin, saveSettingsAndWriteToLogNote } from "../settings/settings";
import { moment } from "obsidian";

export async function runLogicAndReturnIfNewPeriod(
	settings: Settings,
	lastPerformedAction: ListType
) {
	const isNewPeriod = isNewNotePeriod(settings);
	if (isNewPeriod) {
		displayNoticeAndWarn("New note time period detected, resetting...");
		consoleWarnIfVerboseMode(
			"New period logic is being ran by " + lastPerformedAction,
			settings.verboseModeEnabled
		);
		// force write to log note
		await saveSettingsAndWriteToLogNote(true);

		if (getLastLogNote() && settings.autoRemoveDividers) {
			await getPlugin().app.vault.process(getLastLogNote(), (data) =>
				removeDividers(data)
			);

			// fixes race condition where removing header is counted as a modification
			// for the new date, since onChange ignores mtime difference > 1 sec.
			// since Obsidian changes mtime on the next modification, this should effectively
			// ignore exactly ONE modification to the old log note.
			getLastLogNote().stat.mtime = 0;
		}
		const lastTrackedDate = moment(settings.lastTrackedDate);
		const today = moment().format("YYYY-MM-DD");

		consoleWarnIfVerboseMode(
			`New day detected, last tracked date was ${lastTrackedDate.format(
				"YYYY-MM-DD"
			)}, now it is ${today}`,
			settings.verboseModeEnabled
		);

		settings.trackedFiles = [];

		settings.lastTrackedDate = today;
		await saveSettingsAndWriteToLogNote();
	}

	return isNewPeriod;
}
