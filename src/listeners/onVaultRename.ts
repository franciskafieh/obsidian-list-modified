import { serialize } from "monkey-around";
import { TAbstractFile, TFile } from "obsidian";
import {
	getSettings,
	saveSettings,
	saveSettingsAndWriteTrackedFiles,
} from "src/io/settings";

const onVaultRename = serialize(
	async (file: TAbstractFile, oldPath: string) => {
		if (file instanceof TFile) {
			const settings = getSettings();

			// rename file in tracked files array
			const oldFile = settings.trackedFiles.find(
				({ path }) => path === oldPath
			);

			oldFile.path = file.path;

			if (oldFile.supposedList === "deleted") {
				oldFile.supposedList = "created";
			}

			// obsidian already handles link renames
			if (settings.outputFormat.includes("[[link]]")) {
				await saveSettings();
			} else {
				await saveSettingsAndWriteTrackedFiles();
			}
		}
	}
);

export default onVaultRename;
