import moment from "moment";
import { Settings } from "../../interfaces/Settings";

export function isNewNotePeriod(settings: Settings) {
	const lastTrackedDate = moment(settings.lastTrackedDate);

	let granularity = new Map([
		["daily", "day"],
		["weekly", "week"],
		["monthly", "month"],
	]).get(settings.logNoteType);

	if (granularity) {
		// @ts-ignore, will always be the right type
		return !lastTrackedDate.isSame(moment(), granularity);
	}

	return false;
}
