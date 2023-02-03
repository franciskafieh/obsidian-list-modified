import { serialize } from "monkey-around";

const onVaultRename = serialize(
	async (file: TAbstractFile, oldPath: string) => {
		if (file instanceof TFile) {
			if (this.settings.trackedFiles.includes(oldPath)) {
				this.settings.trackedFiles.remove(oldPath);
				this.settings.trackedFiles.push(file.path);

				await this.saveSettings();
				// obsidian already handles link renames
				if (!this.settings.outputFormat.includes("[[link]]")) {
					await this.updateTrackedFiles();
				}
			}
		}
	}
);

export default onVaultRename;
