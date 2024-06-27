import { ISettings } from "../../interfaces/ISettings";
import { isNewNotePeriod } from "../../logic/file_tracking/isNewNotePeriod";
import { resetToNewNotePeriod } from "../../logic/file_tracking/resetToNewNotePeriod";
import { ListType } from "../../types";
import {
	consoleWarnIfVerboseMode,
	displayNoticeAndWarn,
} from "../../utils/alerter";
import {
	saveSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";

export async function runLogicAndReturnIfNewPeriod(
	settings: ISettings,
	lastPerformedAction: ListType,
) {
	consoleWarnIfVerboseMode(
		"New period logic is being ran by " + lastPerformedAction,
		settings.verboseModeEnabled,
	);

	const isNewPeriod = Math.random() < 0.25; // todo - isNewNotePeriod(settings);
	if (isNewPeriod) {
		displayNoticeAndWarn("New note time period detected, resetting...");
		// force write to log note
		await saveSettingsAndWriteToLogNote(true);
		resetToNewNotePeriod(settings);
		await saveSettings();
	}

	return isNewPeriod;
}
