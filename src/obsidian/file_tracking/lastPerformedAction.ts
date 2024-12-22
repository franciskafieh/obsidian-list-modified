import { ListType } from "../../types";
import { consoleWarnIfVerboseMode } from "../../utils/alerter";
import { getSettings } from "../settings/settings";

// this logic ensures new day flow uses the correct list
let lastPerformedAction: ListType = "modified";

export function getLastPerformedAction() {
	return lastPerformedAction;
}

export function setLastPerformedAction(action: ListType) {
	consoleWarnIfVerboseMode(
		"Setting last performed action to " + action,
		getSettings().verboseModeEnabled
	);
	lastPerformedAction = action;
}
