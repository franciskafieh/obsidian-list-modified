import { serialize } from "monkey-around";
import { CachedMetadata, TFile, moment, getAllTags } from "obsidian";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import {
	getSettings,
	saveSettings,
	saveSettingsAndWriteTrackedFiles,
} from "src/io/settings";
import { refreshNoteCache } from "../io/noteCache";
import { consoleWarn, displayNotice } from "../utils/formatter";

const onMetadataCacheChanged = serialize(
	async (file: TFile, _data: string, cache: CachedMetadata) => {
		await writeAndResetIfNewDay();

		const settings = getSettings();

		if (file === getDailyNote(moment(), getAllDailyNotes())) {
			return;
		}

		const matchesCriteria = fileMatchesCriteria(file, cache);

		const currFile = settings.trackedFiles.find(
			({ path }) => path === file.path
		);

		if (currFile) {
			currFile.matchesCriteria = matchesCriteria;
		} else {
			settings.trackedFiles.push({
				path: file.path,
				matchesCriteria: matchesCriteria,
				supposedList: "modified",
			});
		}

		if (settings.writeInterval) {
			await saveSettings();
		} else {
			await saveSettingsAndWriteTrackedFiles();
		}
	}
);

async function writeAndResetIfNewDay() {
	const settings = getSettings();
	const currentDate = moment().format("YYYY-MM-DD");

	if (settings.latestTrackedDate !== currentDate) {
		displayNotice(
			"New day detected, writing tracked files and resetting..."
		);
		refreshNoteCache(settings.logNoteType);
		await saveSettingsAndWriteTrackedFiles();

		settings.trackedFiles = [];
		settings.latestTrackedDate = currentDate;
		await saveSettings();
	}
}

function fileMatchesCriteria(file: TFile, cache: CachedMetadata) {
	return (
		!noteTitleContainsIgnoredText(file.basename) &&
		!cacheContainsIgnoredTag(cache) &&
		!pathIsExcluded(file.path)
	);
}

function noteTitleContainsIgnoredText(noteTitle: string): boolean {
	const ignoredNameContains = this.settings?.ignoredNameContains;
	if (!ignoredNameContains) return false;
	const ignoredText = ignoredNameContains.replace(/\s/g, "").split(",");

	return ignoredText.some((ignoredText: string) => {
		const title = noteTitle.toLowerCase();
		const text = ignoredText.toLowerCase();
		if (!text) {
			return false;
		}
		return title.includes(text);
	});
}

function cacheContainsIgnoredTag(cache: CachedMetadata): boolean {
	const currentFileTags: string[] = getAllTags(cache);
	const tags = this.settings?.tags;
	if (!tags) return false;
	const ignoredTags = tags.replace(/\s/g, "").split(",");
	return ignoredTags.some((ignoredTag: string) =>
		currentFileTags.includes(ignoredTag)
	);
}

function pathIsExcluded(path: string): boolean {
	const excludedFolders = this.settings?.excludedFolders;
	if (!excludedFolders) return false;
	const excludedFolderPaths: string[] = excludedFolders
		.replace(/\s*, | \s*,/, ",")
		.split(",")
		.map((path: string) => path.replace(/^\/|\/$/g, ""));

	const currentFilePath: string =
		this.app.vault.getAbstractFileByPath(path).parent.path;

	return excludedFolderPaths.some((excludedFolder: string) =>
		currentFilePath.startsWith(excludedFolder)
	);
}

export default onMetadataCacheChanged;
