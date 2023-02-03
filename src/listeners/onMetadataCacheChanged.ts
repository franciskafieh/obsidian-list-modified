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

		// if no interval, write to file on every change
		if (!settings.writeInterval) {
			await saveSettingsAndWriteTrackedFiles();
		}
	}
);

async function writeAndResetIfNewDay() {
	const settings = getSettings();
	const currentDate = moment().format("YYYY-MM-DD");

	if (settings.lastTrackedDate !== currentDate) {
		await saveSettingsAndWriteTrackedFiles();
		settings.trackedFiles = [];
		settings.lastTrackedDate = currentDate;
	}
}

function fileMatchesCriteria(file: TFile, cache: CachedMetadata) {
	return false;
}

export default onMetadataCacheChanged;
