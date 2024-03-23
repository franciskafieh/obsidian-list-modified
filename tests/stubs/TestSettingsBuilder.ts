import { LogNoteType, TrackedFile } from "../../src/types";
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

	public setTimeFormat(format: string) {
		this.testSettings.timeFormat = format;
	}

	public setAutoCreateLogNote(autoCreate: boolean) {
		this.testSettings.autoCreateLogNote = autoCreate;
	}

	public setLogNoteType(type: LogNoteType) {
		this.testSettings.logNoteType = type;
	}

	public setWriteInterval(interval: number) {
		this.testSettings.writeInterval = interval;
	}

	public setCombineCreatedAndModified(combined: boolean) {
		this.testSettings.combineCreatedAndModified = combined;
	}

	public setAutoCreateCreatedDivider(autoCreate: boolean) {
		this.testSettings.autoCreateCreatedDivider = autoCreate;
	}

	public setAutoCreateModifiedDivider(autoCreate: boolean) {
		this.testSettings.autoCreateModifiedDivider = autoCreate;
	}

	public setAutoCreateDeletedDivider(autoCreate: boolean) {
		this.testSettings.autoCreateDeletedDivider = autoCreate;
	}

	public setLastTrackedDate(date: string) {
		this.testSettings.lastTrackedDate = date;
	}

	public setTrackedFiles(trackedFiles: TrackedFile[]) {
		this.testSettings.trackedFiles = trackedFiles;
	}

	public setVerboseModeEnabled(enabled: boolean) {
		this.testSettings.verboseModeEnabled = enabled;
	}

	public build() {
		return this.testSettings;
	}
}
