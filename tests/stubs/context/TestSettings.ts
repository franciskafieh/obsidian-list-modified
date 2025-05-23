import { Settings } from "../../../src/interfaces/Settings";
import { OBSIDIAN_DEFAULT_SETTINGS } from "../../../src/obsidian/settings/ObsidianDefaultSettings";

export class TestSettings implements Settings {
	excludedTags = OBSIDIAN_DEFAULT_SETTINGS.excludedTags;
	excludedFolders = OBSIDIAN_DEFAULT_SETTINGS.excludedFolders;
	excludedNameContains = OBSIDIAN_DEFAULT_SETTINGS.excludedNameContains;
	excludedExtensions = OBSIDIAN_DEFAULT_SETTINGS.excludedExtensions;
	outputFormat = OBSIDIAN_DEFAULT_SETTINGS.outputFormat;
	separateOutputFormats = OBSIDIAN_DEFAULT_SETTINGS.separateOutputFormats;
	createdFormat = OBSIDIAN_DEFAULT_SETTINGS.createdFormat;
	modifiedFormat = OBSIDIAN_DEFAULT_SETTINGS.modifiedFormat;
	deletedFormat = OBSIDIAN_DEFAULT_SETTINGS.deletedFormat;
	timeFormat = OBSIDIAN_DEFAULT_SETTINGS.timeFormat;
	autoEmbedAttachments = OBSIDIAN_DEFAULT_SETTINGS.autoEmbedAttachments;
	autoCreateLogNote = OBSIDIAN_DEFAULT_SETTINGS.autoCreateLogNote;
	logNoteType = OBSIDIAN_DEFAULT_SETTINGS.logNoteType;
	writeInterval = OBSIDIAN_DEFAULT_SETTINGS.writeInterval;
	combineCreatedAndModified =
		OBSIDIAN_DEFAULT_SETTINGS.combineCreatedAndModified;
	autoRemoveDividers = OBSIDIAN_DEFAULT_SETTINGS.autoRemoveDividers;
	autoCreateCreatedDivider =
		OBSIDIAN_DEFAULT_SETTINGS.autoCreateCreatedDivider;
	autoCreateModifiedDivider =
		OBSIDIAN_DEFAULT_SETTINGS.autoCreateModifiedDivider;
	autoCreateDeletedDivider =
		OBSIDIAN_DEFAULT_SETTINGS.autoCreateDeletedDivider;
	sortCreated = OBSIDIAN_DEFAULT_SETTINGS.sortCreated;
	sortModified = OBSIDIAN_DEFAULT_SETTINGS.sortModified;
	sortDeleted = OBSIDIAN_DEFAULT_SETTINGS.sortDeleted;
	verboseModeEnabled = OBSIDIAN_DEFAULT_SETTINGS.verboseModeEnabled;
	lastTrackedDate = OBSIDIAN_DEFAULT_SETTINGS.lastTrackedDate;
	trackedFiles = OBSIDIAN_DEFAULT_SETTINGS.trackedFiles;
}
