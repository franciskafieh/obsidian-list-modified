import { Settings } from "../../interfaces/Settings";
import { isNewNotePeriod } from "../../logic/file_tracking/isNewNotePeriod";
import { resetToNewNotePeriod } from "../../logic/file_tracking/resetToNewNotePeriod";
import { removeDividers } from "../../logic/log_note/removeDividers";
import { ListType } from "../../types";
import {
	consoleWarnIfVerboseMode,
	displayNoticeAndWarn,
} from "../../utils/alerter";
import { getLogNote } from "../log_note/logNote";
import {
	getPlugin,
	saveSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";

export async function runLogicAndReturnIfNewPeriod(
	settings: Settings,
	lastPerformedAction: ListType,
) {
	consoleWarnIfVerboseMode(
		"New period logic is being ran by " + lastPerformedAction,
		settings.verboseModeEnabled,
	);

	const isNewPeriod = isNewNotePeriod(settings);
	if (isNewPeriod) {
		displayNoticeAndWarn("New note time period detected, resetting...");
		// force write to log note
		await saveSettingsAndWriteToLogNote(true);
		// TODO REMOVE DIVIDERS
		getPlugin().app.vault.process(getLogNote(), (data) =>
			removeDividers(data),
		);
		resetToNewNotePeriod(settings);
		await saveSettings();
	}

	return isNewPeriod;
}
