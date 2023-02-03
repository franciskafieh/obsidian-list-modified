import { serialize } from "monkey-around";
import { CachedMetadata, TFile, moment } from "obsidian";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import { getSettings, saveSettingsAndWriteTrackedFiles } from "src/io/settings";

const onMetadataCacheChanged = serialize(
	async (file: TFile, _data: string, cache: CachedMetadata) => {
		const settings = getSettings();

		writeAndResetIfNewDay();

		if (file === getDailyNote(moment(), getAllDailyNotes())) {
			return;
		}

		const path: string = file.path;

		// find which list file is in

		// make shift set
		if (
			!trackedFiles.includes(path) &&
			!this.cacheContainsIgnoredTag(cache) &&
			!this.pathIsExcluded(path) &&
			!this.noteTitleContainsIgnoredText(file.basename)
		) {
			trackedFiles.push(path);
		}

		if (
			(trackedFiles.includes(path) &&
				this.cacheContainsIgnoredTag(cache)) ||
			this.pathIsExcluded(path) ||
			this.noteTitleContainsIgnoredText(file.basename)
		) {
			trackedFiles.remove(path);
		}

		await saveSettingsAndWriteTrackedFiles();
	}
);

async function writeAndResetIfNewDay() {
	const settings = getSettings();
	const currentDate = moment().format("YYYY-MM-DD");

	if (settings.lastTrackedDate !== currentDate) {
		await saveSettingsAndWriteTrackedFiles();
		settings.createdFiles = [];
		settings.modifiedFiles = [];
		settings.deletedFiles = [];
		settings.lastTrackedDate = currentDate;
	}
}

export default onMetadataCacheChanged;
