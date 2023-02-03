import { serialize } from "monkey-around";
import { TAbstractFile, TFile } from "obsidian";
import { getSettings, saveSettings } from "src/io/settings";

const onVaultDelete = serialize(async (file: TAbstractFile) => {
	if (file instanceof TFile) {
		const settings = getSettings();

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

		await saveSettings();
	}
});

export default onVaultDelete;
