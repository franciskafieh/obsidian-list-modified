import { LogNoteType, TrackedFile, SortOption } from "../types";

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
	autoEmbedAttachments: boolean;

	// LOG NOTE
	autoCreateLogNote: boolean;
	logNoteType: LogNoteType;
	writeInterval: number;

	// DIVIDERS
	combineCreatedAndModified: boolean;
	autoRemoveDividers: boolean;

	autoCreateCreatedDivider: boolean;
	autoCreateModifiedDivider: boolean;
	autoCreateDeletedDivider: boolean;

	// SORTING
	sortCreated: SortOption;
	sortModified: SortOption;
	sortDeleted: SortOption;

	// MISC
	verboseModeEnabled: boolean;

	// INTERNAL
	lastTrackedDate: string;
	trackedFiles: TrackedFile[];
}
