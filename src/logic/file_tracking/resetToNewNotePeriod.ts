import moment from "moment";
import { ISettings } from "../../interfaces/ISettings";
import { consoleWarnIfVerboseMode } from "../../utils/alerter";

export function resetToNewNotePeriod(settings: ISettings) {
	const lastTrackedDate = moment(settings.lastTrackedDate);
	const today = moment().format("YYYY-MM-DD");

	consoleWarnIfVerboseMode(
		`New day detected, last tracked date was ${lastTrackedDate.format(
			"YYYY-MM-DD",
		)}, now it is ${today}`,
		settings.verboseModeEnabled,
	);

	settings.trackedFiles = [];

	settings.lastTrackedDate = today;
}
