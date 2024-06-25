import { LogNoteType, TrackedFile } from "../types";

export interface ISettings {
	// CRITERIA
	excludedTags: string;
	excludedFolders: string;
	excludedNameContains: string;

	// FORMATTING
	outputFormat: string;
	timeFormat: string;

	// LOG NOTE
	autoCreateLogNote: boolean;
	logNoteType: LogNoteType;
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
	trackedFiles: TrackedFile[];
}
