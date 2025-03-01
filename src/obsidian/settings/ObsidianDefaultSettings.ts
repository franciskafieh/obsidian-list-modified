import { Settings } from "../../interfaces/Settings";

export const OBSIDIAN_DEFAULT_SETTINGS: Settings = {
	// CRITERIA
	excludedTags: [],
	excludedFolders: [],
	excludedNameContains: [],
	excludedExtensions: [],

	// FORMATTING
	outputFormat: "- [[link]]",
	separateOutputFormats: false,
	createdFormat: "- [[link]]",
	modifiedFormat: "- [[link]]",
	deletedFormat: "- [[path]]",
	timeFormat: "h:mm A",

	// LOG NOTE
	autoCreateLogNote: true,
	logNoteType: "daily",
	writeInterval: 0,

	// DIVIDERS
	combineCreatedAndModified: false,
	autoRemoveDividers: true,

	autoCreateCreatedDivider: false,
	autoCreateModifiedDivider: false,
	autoCreateDeletedDivider: false,

	// MISC
	verboseModeEnabled: false,

	// INTERNAL
	lastTrackedDate: "",
	trackedFiles: [],
};
