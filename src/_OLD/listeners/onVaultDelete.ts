import { serialize } from "monkey-around";
import { TAbstractFile, TFile } from "obsidian";
import {
	getSettings,
	saveSettings,
	saveSettingsAndWriteTrackedFiles,
} from "src/io/settings";
import { consoleWarn } from "src/utils/formatter";

const onVaultDelete = serialize(async (file: TAbstractFile) => {
	if (file instanceof TFile) {
		const settings = getSettings();

		if (settings.verboseModeEnabled) {
			consoleWarn("File deleted: " + file.path);
		}

		const existingFile = settings.trackedFiles.find(
			({ path }) => path === file.path
		);

		if (existingFile) {
			existingFile.supposedList = "deleted";
			existingFile.matchesCriteria = true;
		} else {
			settings.trackedFiles.push({
				path: file.path,
				supposedList: "deleted",
				matchesCriteria: true,
			});
		}

		if (settings.writeInterval) {
			await saveSettings();
		} else {
			await saveSettingsAndWriteTrackedFiles();
		}
	}
});

export default onVaultDelete;
