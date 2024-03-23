import { ISettings } from "../../interfaces/ISettings";
import { LogNoteType, TrackedFile } from "../../types";

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
	logNoteType = "daily" as LogNoteType;
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
	trackedFiles = [] as TrackedFile[];
}
