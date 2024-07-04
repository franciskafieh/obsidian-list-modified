import { LogNoteType, TrackedFile } from "../../src/types";
import { convertCommaListToArray } from "../../src/utils/converCommaListToArray";
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
			this.testSettings.excludedTags = tags;
		} else {
			this.testSettings.excludedTags = convertCommaListToArray(tags);
		}

		return this;
	}

	public setExcludedFolders(folders: string): void;
	public setExcludedFolders(folders: string[]): void;
	public setExcludedFolders(folders: string | string[]) {
		if (Array.isArray(folders)) {
			this.testSettings.excludedFolders = folders;
		} else {
			this.testSettings.excludedFolders =
				convertCommaListToArray(folders);
		}

		return this;
	}

	public setIgnoredNameContains(names: string): void;
	public setIgnoredNameContains(names: string[]): void;
	public setIgnoredNameContains(names: string | string[]) {
		if (Array.isArray(names)) {
			this.testSettings.excludedNameContains = names;
		} else {
			this.testSettings.excludedNameContains =
				convertCommaListToArray(names);
		}

		return this;
	}

	public setOutputFormat(format: string) {
		this.testSettings.outputFormat = format;
		return this;
	}

	public setTimeFormat(format: string) {
		this.testSettings.timeFormat = format;
		return this;
	}

	public setAutoCreateLogNote(autoCreate: boolean) {
		this.testSettings.autoCreateLogNote = autoCreate;
		return this;
	}

	public setLogNoteType(type: LogNoteType) {
		this.testSettings.logNoteType = type;
		return this;
	}

	public setWriteInterval(interval: number) {
		this.testSettings.writeInterval = interval;
		return this;
	}

	public setCombineCreatedAndModified(combined: boolean) {
		this.testSettings.combineCreatedAndModified = combined;
		return this;
	}

	public setAutoCreateCreatedDivider(autoCreate: boolean) {
		this.testSettings.autoCreateCreatedDivider = autoCreate;
		return this;
	}

	public setAutoCreateModifiedDivider(autoCreate: boolean) {
		this.testSettings.autoCreateModifiedDivider = autoCreate;
		return this;
	}

	public setAutoCreateDeletedDivider(autoCreate: boolean) {
		this.testSettings.autoCreateDeletedDivider = autoCreate;
		return this;
	}

	public setLastTrackedDate(date: string) {
		this.testSettings.lastTrackedDate = date;
		return this;
	}

	public setTrackedFiles(trackedFiles: TrackedFile[]) {
		this.testSettings.trackedFiles = trackedFiles;
		return this;
	}

	public setVerboseModeEnabled(enabled: boolean) {
		this.testSettings.verboseModeEnabled = enabled;
		return this;
	}

	public build() {
		return this.testSettings;
	}
}
