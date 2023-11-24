import { ListModifiedSettings } from "./types";

export const DEFAULT_SETTINGS: ListModifiedSettings = {
	// CRITERIA
	tags: "",
	excludedFolders: "",
	ignoredNameContains: "",

	// FORMATTING
	outputFormat: "- [[link]]",
	appendSpaceAfterHeadings: false,
	timeFormat: "YYYY-MM-DD",

	// LOG NOTE
	autoCreateLogNote: true,
	logNoteType: "daily",
	writeInterval: 0,

	// HEADINGS
	autoCreatePrimaryHeading: true,
	primaryHeading: "Changed Notes",
	modifiedHeading: "Modified",
	separateCreated: false,
	createdHeading: "Created",
	separateDeleted: false,
	deletedHeading: "Deleted",

	// INTERNAL
	lastTrackedDate: "",
	trackedFiles: [],

	// DEBUG
	verboseModeEnabled: false,
};
