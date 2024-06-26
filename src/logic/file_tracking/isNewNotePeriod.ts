import moment from "moment";
import { ISettings } from "../../interfaces/ISettings";

export function isNewNotePeriod(settings: ISettings) {
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
