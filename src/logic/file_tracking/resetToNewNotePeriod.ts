import moment from "moment";
import { ISettings } from "../../interfaces/ISettings";

export function resetToNewNotePeriod(settings: ISettings) {
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
}
