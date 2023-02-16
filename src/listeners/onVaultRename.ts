import { serialize } from "monkey-around";
import { TAbstractFile, TFile } from "obsidian";
import { getSettings, saveSettingsAndWriteTrackedFiles } from "src/io/settings";

const onVaultRename = serialize(
	async (file: TAbstractFile, oldPath: string) => {
		if (file instanceof TFile) {
			const settings = getSettings();

			// if entry with current new path, remove it (assume it was previously deleted)
			settings.trackedFiles.remove(
				settings.trackedFiles.find(({ path }) => path === file.path)
			);

			// rename file in tracked files array
			settings.trackedFiles.find(({ path }) => path === oldPath).path =
				file.path;

			await saveSettingsAndWriteTrackedFiles();
		}
	}
);

export default onVaultRename;
