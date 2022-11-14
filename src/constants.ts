import { ListModifiedSettings } from "./types";

export const DEFAULT_SETTINGS: ListModifiedSettings = {
	outputFormat: "- [[link]]",
	tags: "",
	excludedFolders: "",
	automaticallyCreateDailyNote: true,
	heading: "Modified Files",
	writeInterval: 30,
	ignoredNameContains: "",
	lastTrackedDate: "",
	trackedFiles: [],
};

export const DEFAULT_HEADING = "Modified Today";
