import { ListType } from "../../types";

// this logic ensures new day flow uses the correct list
let lastPerformedAction: ListType = "modified";

export function getLastPerformedAction() {
	return lastPerformedAction;
}

export function setLastPerformedAction(action: ListType) {
	lastPerformedAction = action;
}
