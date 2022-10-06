export interface ListModifiedSettings {
	outputFormat: string;
	tags: string;
	excludedFolders: string;
	automaticallyCreateDailyNote: boolean;
	heading: string;
	writeInterval: number;
	ignoredNameContains: string;
	lastTrackedDate: string;
	trackedFiles: string[];
}
