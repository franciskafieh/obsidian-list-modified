import { serialize } from "monkey-around";
import { TAbstractFile } from "obsidian";
import {
	getSettings,
	saveSettings,
	saveSettingsAndWriteTrackedFiles,
} from "src/io/settings";

const onVaultCreate = serialize(async (file: TAbstractFile) => {
	const settings = getSettings();

	const existingFile = settings.trackedFiles.find(
		({ path }) => path === file.path
	);

	if (existingFile) {
		existingFile.supposedList = "created";
		existingFile.matchesCriteria = false;
	} else {
		settings.trackedFiles.push({
			path: file.path,
			supposedList: "created",
			matchesCriteria: false,
		});
	}

	if (settings.writeInterval) {
		await saveSettings();
	} else {
		await saveSettingsAndWriteTrackedFiles();
	}
});

export default onVaultCreate;
