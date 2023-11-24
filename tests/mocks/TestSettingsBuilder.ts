import { TestSettings } from "./TestSettings";

export class TestSettingsBuilder {
	private testSettings: TestSettings;

	constructor() {
		this.testSettings = new TestSettings();
	}

	public setTags(tags: string): void;
	public setTags(tags: string[]): void;
	public setTags(tags: string | string[]) {
		if (Array.isArray(tags)) {
			this.testSettings.tags = tags.join(",");
		} else {
			this.testSettings.tags = tags as string;
		}
	}

	public setExcludedFolders(folders: string): void;
	public setExcludedFolders(folders: string[]): void;
	public setExcludedFolders(folders: string | string[]) {
		if (Array.isArray(folders)) {
			this.testSettings.excludedFolders = folders.join(",");
		} else {
			this.testSettings.excludedFolders = folders as string;
		}
	}

	public setIgnoredNameContains(names: string): void;
	public setIgnoredNameContains(names: string[]): void;
	public setIgnoredNameContains(names: string | string[]) {
		if (Array.isArray(names)) {
			this.testSettings.ignoredNameContains = names.join(",");
		} else {
			this.testSettings.ignoredNameContains = names as string;
		}
	}

	public setOutputFormat(format: string) {
		this.testSettings.outputFormat = format;
	}

	public setAppendSpaceAfterHeadings(appendSpace: boolean) {
		this.testSettings.appendSpaceAfterHeadings = appendSpace;
	}

	public setTimeFormat(format: string) {
		this.testSettings.timeFormat = format;
	}

	public setAutoCreateLogNote(autoCreate: boolean) {
		this.testSettings.autoCreateLogNote = autoCreate;
	}

	public setLogNoteType(type: "daily" | "weekly" | "monthly") {
		this.testSettings.logNoteType = type;
	}

	public setWriteInterval(interval: number) {
		this.testSettings.writeInterval = interval;
	}

	public setAutoCreatePrimaryHeading(autoCreate: boolean) {
		this.testSettings.autoCreatePrimaryHeading = autoCreate;
	}

	public setPrimaryHeading(heading: string) {
		this.testSettings.primaryHeading = heading;
	}

	public setModifiedHeading(heading: string) {
		this.testSettings.modifiedHeading = heading;
	}

	public setSeparateCreated(separate: boolean) {
		this.testSettings.separateCreated = separate;
	}

	public setCreatedHeading(heading: string) {
		this.testSettings.createdHeading = heading;
	}

	public setSeparateDeleted(separate: boolean) {
		this.testSettings.separateDeleted = separate;
	}

	public setDeletedHeading(heading: string) {
		this.testSettings.deletedHeading = heading;
	}

	public setLastTrackedDate(date: string) {
		this.testSettings.lastTrackedDate = date;
	}

	public setTrackedFiles(
		trackedFiles: {
			path: string;
			supposedList: "created" | "modified" | "deleted";
			matchesCriteria: boolean;
		}[]
	) {
		this.testSettings.trackedFiles = trackedFiles;
	}

	public setVerboseModeEnabled(enabled: boolean) {
		this.testSettings.verboseModeEnabled = enabled;
	}

	public build() {
		return this.testSettings;
	}
}
