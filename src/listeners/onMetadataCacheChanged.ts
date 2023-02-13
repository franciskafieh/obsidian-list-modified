import { serialize } from "monkey-around";
import { CachedMetadata, TFile, moment, getAllTags } from "obsidian";
import {
	getSettings,
	saveSettings,
	saveSettingsAndWriteTrackedFiles,
} from "src/io/settings";
import { displayNotice } from "../utils/formatter";
import { getLogNote } from "../io/noteCache";

const onMetadataCacheChanged = serialize(
	async (file: TFile, _data: string, cache: CachedMetadata) => {
		await writeAndResetIfNewDay();

		const settings = getSettings();
		if (file === getLogNote()) {
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
	const lastTrackedDate = moment(settings.latestTrackedDate);

	const granularity = new Map([
		["daily", "day"],
		["weekly", "week"],
		["monthly", "month"],
	]).get(settings.logNoteType);

	// @ts-ignore
	if (!lastTrackedDate.isSame(moment(), granularity)) {
		displayNotice(
			"New day/week/month detected, writing tracked files and resetting..."
		);
		await saveSettingsAndWriteTrackedFiles();

		settings.trackedFiles = [];
		settings.latestTrackedDate = moment().format("YYYY-MM-DD");
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
