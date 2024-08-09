import { Settings } from "../../interfaces/Settings";

export const OBSIDIAN_DEFAULT_SETTINGS: Settings = {
	// CRITERIA
	excludedTags: [],
	excludedFolders: [],
	excludedNameContains: [],

	// FORMATTING
	outputFormat: "- [[link]]",
	timeFormat: "h:mm A",

	// LOG NOTE
	autoCreateLogNote: true,
	logNoteType: "daily",
	writeInterval: 0,

	// DIVIDERS
	combineCreatedAndModified: false,

	autoCreateCreatedDivider: false,
	autoCreateModifiedDivider: false,
	autoCreateDeletedDivider: false,

	// DEBUG
	verboseModeEnabled: false,

	// INTERNAL
	lastTrackedDate: "",
	trackedFiles: [],
};
