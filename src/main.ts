import { Plugin, getAllTags } from "obsidian";
import { ISettings } from "./interfaces/ISettings";
import { initSettings } from "./obsidian/settings/settings";
import onMetadataCacheChanged from "./obsidian/listeners/onMetadataCacheChanged";
import onVaultDelete from "./obsidian/listeners/onVaultDelete";
import onVaultRename from "./obsidian/listeners/onVaultRename";
import onVaultCreate from "./obsidian/listeners/onVaultCreate";
import { SettingsTab } from "./obsidian/settings/SettingsTab";

export default class ListModified extends Plugin {
	async onload(): Promise<void> {
		await initSettings(this);

		this.registerEvent(
			this.app.metadataCache.on("changed", onMetadataCacheChanged),
		);
		this.registerEvent(this.app.vault.on("delete", onVaultDelete));
		this.registerEvent(this.app.vault.on("rename", onVaultRename));

		this.app.workspace.onLayoutReady(async () => {
			// onLayoutReady prevents this from firing for every single file in the vault on startup.
			this.registerEvent(this.app.vault.on("create", onVaultCreate));
		});

		this.addSettingTab(new SettingsTab(this.app, this));
	}

	migrateToThreePointZeroIfNeeded(settings: ISettings) {
		// 	excludedTags = "";
		// excludedFolders = "";
		// excludedNameContains = ""; <== these all changed names and became arrays, todo in migration

		// @ts-ignore - property should not exist but may
		// if still have old setting
		if (!settings.autoCreatePrimaryHeading) {
			return;
		}

		// @ts-ignore
		settings.autoCreatePrimaryHeading = null;

		settings.timeFormat = "set a default here"; //todo

		// @ts-ignore - property should not exist but may
		if (settings.separateCreated) {
			// @ts-ignore
			settings.combineCreatedAndModified = !settings.separateCreated;
			// @ts-ignore
			settings.separateCreated = null;
		}

		// disable the plugin and send notice with wiki until user enabled
	}
}

// getSetting("ddsfsdf")
// setSetting("dsfsdf", "value") - this will also saveSettings()
// writeToLogNoteIfNoDelay()
// otherwise just do it on next save
