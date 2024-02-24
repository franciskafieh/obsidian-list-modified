export interface ISettings {
	// CRITERIA
	tags: string;
	excludedFolders: string;
	ignoredNameContains: string;

	// FORMATTING
	outputFormat: string;
	timeFormat: string;

	// LOG NOTE
	autoCreateLogNote: boolean;
	logNoteType: "daily" | "weekly" | "monthly";
	writeInterval: number;

	// DIVIDERS
	combineCreatedAndModified: boolean;

	autoCreateCreatedDivider: boolean;
	autoCreateModifiedDivider: boolean;
	autoCreateDeletedDivider: boolean;

	// DEBUG
	verboseModeEnabled: boolean;

	// INTERNAL
	lastTrackedDate: string;
	trackedFiles: {
		path: string;
		supposedList: "created" | "modified" | "deleted";
		matchesCriteria: boolean;
	}[];
}
