import { LogNoteType, TrackedFile } from "../../../src/types";
import { convertCommaListToArray } from "../../../src/utils/converCommaListToArray";
import { TestSettings } from "./TestSettings";

export class TestSettingsBuilder {
	private testSettings: TestSettings;

	constructor() {
		this.testSettings = new TestSettings();
	}

	public setTags(tags: string): this;
	public setTags(tags: string[]): this;
	public setTags(tags: string | string[]) {
		if (Array.isArray(tags)) {
			this.testSettings.excludedTags = tags;
		} else {
			this.testSettings.excludedTags = convertCommaListToArray(tags);
		}

		return this;
	}

	public setExcludedFolders(folders: string): this;
	public setExcludedFolders(folders: string[]): this;
	public setExcludedFolders(folders: string | string[]) {
		if (Array.isArray(folders)) {
			this.testSettings.excludedFolders = folders;
		} else {
			this.testSettings.excludedFolders =
				convertCommaListToArray(folders);
		}

		return this;
	}

	public setIgnoredNameContains(names: string): this;
	public setIgnoredNameContains(names: string[]): this;
	public setIgnoredNameContains(names: string | string[]) {
		if (Array.isArray(names)) {
			this.testSettings.excludedNameContains = names;
		} else {
			this.testSettings.excludedNameContains =
				convertCommaListToArray(names);
		}

		return this;
	}

	public setExcludedExtensions(extensions: string): this;
	public setExcludedExtensions(extensions: string[]): this;
	public setExcludedExtensions(extensions: string | string[]) {
		if (Array.isArray(extensions)) {
			this.testSettings.excludedExtensions = extensions;
		} else {
			this.testSettings.excludedExtensions =
				convertCommaListToArray(extensions);
		}

		return this;
	}

	public setOutputFormat(format: string) {
		this.testSettings.outputFormat = format;
		return this;
	}

	public setSeparateOutputFormats(separate: boolean) {
		this.testSettings.separateOutputFormats = separate;
		return this;
	}

	public setCreatedFormat(format: string) {
		this.testSettings.createdFormat = format;
		return this;
	}

	public setModifiedFormat(format: string) {
		this.testSettings.modifiedFormat = format;
		return this;
	}

	public setDeletedFormat(format: string) {
		this.testSettings.deletedFormat = format;
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
