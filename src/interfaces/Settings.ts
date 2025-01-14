import { LogNoteType, TrackedFile } from "../types";

export interface Settings {
	// CRITERIA
	excludedTags: string[];
	excludedFolders: string[];
	excludedNameContains: string[];
	excludedExtensions: string[];

	// FORMATTING
	outputFormat: string;
	separateOutputFormats: boolean;
	createdFormat: string;
	modifiedFormat: string;
	deletedFormat: string;
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

	// MISC
	verboseModeEnabled: boolean;

	// INTERNAL
	lastTrackedDate: string;
	trackedFiles: TrackedFile[];
}
