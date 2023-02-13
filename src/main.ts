import { Plugin } from "obsidian";
import { ListModifiedSettingTab } from "./io/settingsTab";
import onMetadataCacheChanged from "./listeners/onMetadataCacheChanged";
import onVaultDelete from "./listeners/onVaultDelete";
import onVaultRename from "./listeners/onVaultRename";
import onVaultCreate from "./listeners/onVaultCreate";
import {
	getSettings,
	initSettings,
	saveSettingsAndWriteTrackedFiles,
} from "./io/settings";
export default class ListModified extends Plugin {
	async onload(): Promise<void> {
		await initSettings(this);

		const settings = getSettings();

		this.migrateToTwoPointOne();

		const writeIntervalInMs = settings.writeInterval * 1000;

		// if interval is 0, don't run the registerInterval and instead just run on modify for performance.
		if (writeIntervalInMs) {
			this.registerInterval(
				window.setInterval(async () => {
					await saveSettingsAndWriteTrackedFiles();
				}, writeIntervalInMs)
			);
		}

		this.registerEvent(
			this.app.metadataCache.on("changed", onMetadataCacheChanged)
		);
		this.registerEvent(this.app.vault.on("delete", onVaultDelete));
		this.registerEvent(this.app.vault.on("rename", onVaultRename));

		this.app.workspace.onLayoutReady(async () => {
			// onLayoutReady prevents this from firing for every single file in the vault on startup.
			this.registerEvent(this.app.vault.on("create", onVaultCreate));
		});

		this.addSettingTab(new ListModifiedSettingTab(this.app, this));
	}

	migrateToTwoPointOne() {
		const settings = getSettings();
		// if the settings are already migrated, don't do anything.
		if (settings.autoCreatePrimaryHeading !== undefined || null) {
			return;
		}

		settings.autoCreatePrimaryHeading =
			// @ts-ignore
			settings.automaticallyCreateDailyNote;

		// @ts-ignore
		settings.primaryHeading = settings.heading;

		if (typeof settings.trackedFiles[0] === "string") {
			settings.trackedFiles =
				// @ts-ignore
				settings.trackedFiles.map((file: string) => {
					return {
						path: file,
						supposedList: "modified",
						matchesCriteria: true,
					};
				});
		}
	}
}
