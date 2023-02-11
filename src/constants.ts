import { ListModifiedSettings } from "./types";

export const DEFAULT_SETTINGS: ListModifiedSettings = {
	// CRITERIA
	tags: "",
	excludedFolders: "",
	ignoredNameContains: "",

	// FORMATTING
	outputFormat: "- [[link]]",
	appendSpaceAfterHeadings: false,

	// LOG NOTE
	autoCreateLogNote: true,
	logNoteType: "daily",
	writeInterval: 0,

	// HEADINGS
	autoCreatePrimaryHeading: true,
	primaryHeading: "Changed Notes",
	modifiedHeading: "Modified",
	separateCreated: false,
	createdHeading: "",
	separateDeleted: false,
	deletedHeading: "",

	// INTERNAL
	lastTrackedDate: "",
	trackedFiles: [],
};
