const onVaultDelete = serialize(async (file: TAbstractFile) => {
	if (file instanceof TFile) {
		if (this.settings.trackedFiles.includes(file.path)) {
			this.settings.trackedFiles.remove(file.path);
			await this.updateTrackedFiles();
		}
	}
});
