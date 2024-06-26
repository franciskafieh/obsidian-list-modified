import { ISettings } from "../../interfaces/ISettings";
import { isNewNotePeriod } from "../../logic/file_tracking/isNewNotePeriod";
import { resetToNewNotePeriod } from "../../logic/file_tracking/resetToNewNotePeriod";
import { displayNoticeAndWarn } from "../../utils/alerter";
import {
	saveSettings,
	saveSettingsAndWriteToLogNote,
} from "../settings/settings";

export async function runLogicAndReturnIfNewPeriod(settings: ISettings) {
	const isNewPeriod = isNewNotePeriod(settings);
	if (isNewPeriod) {
		displayNoticeAndWarn("New note time period detected, resetting...");
		// force write to log note
		await saveSettingsAndWriteToLogNote(true);
		resetToNewNotePeriod(settings);
		await saveSettings();
	}

	return isNewPeriod;
}
