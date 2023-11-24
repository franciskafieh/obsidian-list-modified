import { ISettings } from "src/interfaces/ISettings";

export class ObsidianSettings implements ISettings {
	// CRITERIA
	tags = "";
	excludedFolders = "";
	ignoredNameContains = "";

	// FORMATTING
	outputFormat = "- [[link]]";
	appendSpaceAfterHeadings = false;
	timeFormat = "YYYY-MM-DD";

	// LOG NOTE
	autoCreateLogNote = true;
	logNoteType = "daily" as "daily" | "weekly" | "monthly";
	writeInterval = 0;

	// HEADINGS
	autoCreatePrimaryHeading = true;
	primaryHeading = "Changed Notes";
	modifiedHeading = "Modified";
	separateCreated = false;
	createdHeading = "Created";
	separateDeleted = false;
	deletedHeading = "Deleted";

	// INTERNAL
	lastTrackedDate = "";
	trackedFiles = [] as {
		path: string;
		supposedList: "created" | "modified" | "deleted";
		matchesCriteria: boolean;
	}[];

	// DEBUG
	verboseModeEnabled = false;
}
