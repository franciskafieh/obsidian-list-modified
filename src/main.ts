import { Plugin, getAllTags } from "obsidian";
import { Settings } from "./interfaces/Settings";
import { initSettings, saveSettings } from "./obsidian/settings/settings";
import onMetadataCacheChanged from "./obsidian/listeners/onMetadataCacheChanged";
import onVaultDelete from "./obsidian/listeners/onVaultDelete";
import onVaultRename from "./obsidian/listeners/onVaultRename";
import onVaultCreate from "./obsidian/listeners/onVaultCreate";
import { SettingsTab } from "./obsidian/settings/SettingsTab";
import { OBSIDIAN_DEFAULT_SETTINGS } from "./obsidian/settings/ObsidianDefaultSettings";
import {
	consoleWarnIfVerboseMode,
	displayNoticeAndWarn,
} from "./utils/alerter";

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

	migrateToThreePointZeroIfNeeded(settings: Settings) {
		displayNoticeAndWarn("Migrating to version 3.0...");

		// @ts-ignore - property should not exist but may
		// if does have old setting return
		if (!settings.autoCreatePrimaryHeading) {
			return;
		}

		// @ts-ignore - no more primary heading. this also makes sure migrate logic runs once
		settings.autoCreatePrimaryHeading = null;

		// @ts-ignore - became an array
		settings.excludedFolders =
			// @ts-ignore - became an array
			(settings.excludedFolders as string).split(",") || [];

		// @ts-ignore - new name for tags and became array
		settings.excludedTags = (settings.tags as string).split(",") || [];

		// @ts-ignore - new name for name contains and became array
		settings.excludedNameContains =
			// @ts-ignore - new name for name contains and became array
			(settings.ignoredNameContains as string).split(",") || [];

		// @ts-ignore - no more space after headings
		settings.appendSpaceAfterHeadings = null;

		// @ts-ignore - no more headings
		settings.primaryHeading = null;

		// @ts-ignore - no more headings
		settings.modifiedHeading = null;

		// @ts-ignore - no more headings
		settings.createdHeading = null;

		// @ts-ignore - no more headings
		settings.deletedHeading = null;

		// @ts-ignore - now not a setting
		settings.separateDeleted = null;

		// @ts-ignore - new name
		if (settings.separateCreated) {
			// @ts-ignore
			settings.combineCreatedAndModified = !settings.separateCreated;
			// @ts-ignore
			settings.separateCreated = null;
		} else {
			settings.combineCreatedAndModified = false;
		}

		// CREATE all new divider settings
		settings.autoCreateCreatedDivider = false;
		settings.autoCreateModifiedDivider = false;
		settings.autoCreateDeletedDivider = false;

		saveSettings();
		displayNoticeAndWarn(
			"Migration complete. Your settings have been preserved, but this update adds new features. " +
				"The plugin WILL NOT WORK until you configure the new settings. Please read " +
				'<a href="https://github.com/franciskafieh/obsidian-list-modified/wiki/3.0-Breaking-Update-Changes">https://github.com/franciskafieh/obsidian-list-modified/wiki/3.0-Breaking-Update-Changes</a> for info.',
		);
	}
}
