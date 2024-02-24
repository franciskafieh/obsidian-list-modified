import { ISettings } from "../../interfaces/ISettings";

export class ObsidianSettings implements ISettings {
	// CRITERIA
	tags = "";
	excludedFolders = "";
	ignoredNameContains = "";

	// FORMATTING
	outputFormat = "- [[link]]";
	timeFormat = "YYYY-MM-DD";

	// LOG NOTE
	autoCreateLogNote = true;
	logNoteType = "daily" as "daily" | "weekly" | "monthly";
	writeInterval = 0;

	// DIVIDERS
	combineCreatedAndModified = false;

	autoCreateCreatedDivider = false;
	autoCreateModifiedDivider = false;
	autoCreateDeletedDivider = false;

	// DEBUG
	verboseModeEnabled = false;

	// INTERNAL
	lastTrackedDate = "";
	trackedFiles = [] as {
		path: string;
		supposedList: "created" | "modified" | "deleted";
		matchesCriteria: boolean;
	}[];
}
