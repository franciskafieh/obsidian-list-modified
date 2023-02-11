export interface ListModifiedSettings {
	// CRITERIA
	tags: string;
	excludedFolders: string;
	ignoredNameContains: string;

	// FORMATTING
	outputFormat: string;
	appendSpaceAfterHeadings: boolean;

	// LOG NOTE
	autoCreateLogNote: boolean;
	logNoteType: "daily" | "weekly" | "monthly";
	writeInterval: number;

	// HEADINGS
	autoCreatePrimaryHeading: boolean;
	primaryHeading: string;
	modifiedHeading: string;
	separateCreated: boolean;
	createdHeading: string;
	separateDeleted: boolean;
	deletedHeading: string;

	// INTERNAL
	lastTrackedDate: string;
	trackedFiles: {
		path: string;
		supposedList: "created" | "modified" | "deleted";
		matchesCriteria: boolean;
	}[];
}
