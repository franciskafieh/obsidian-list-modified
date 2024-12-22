import { Plugin } from "obsidian";
import { Settings } from "./interfaces/Settings";
import {
	getSettings,
	initSettings,
	saveSettings,
} from "./obsidian/settings/settings";
import onMetadataCacheChanged from "./obsidian/listeners/onMetadataCacheChanged";
import onVaultDelete from "./obsidian/listeners/onVaultDelete";
import onVaultRename from "./obsidian/listeners/onVaultRename";
import onVaultCreate from "./obsidian/listeners/onVaultCreate";
import { SettingsTab } from "./obsidian/settings/SettingsTab";
import { displayNoticeAndWarn } from "./utils/alerter";

export default class ListModified extends Plugin {
	async onload(): Promise<void> {
		await initSettings(this);

		const pluginDisabledLocally = // @ts-ignore
			this.app.loadLocalStorage(
				"obsidian-list-modified:disableLocally"
			) !== "true";

		if (!pluginDisabledLocally) {
			this.registerEvent(
				this.app.metadataCache.on("changed", onMetadataCacheChanged)
			);
			this.registerEvent(this.app.vault.on("delete", onVaultDelete));
			this.registerEvent(this.app.vault.on("rename", onVaultRename));

			this.app.workspace.onLayoutReady(async () => {
				// onLayoutReady prevents this from firing for every single file in the vault on startup.
				this.registerEvent(this.app.vault.on("create", onVaultCreate));
			});
		}

		this.migrateToThreePointZeroIfNeeded(getSettings());

		this.addSettingTab(new SettingsTab(this.app, this));
	}

	migrateToThreePointZeroIfNeeded(settings: Settings) {
		// @ts-ignore - property should not exist but may
		// if does have old setting return
		if (!settings.autoCreatePrimaryHeading) {
			return;
		}

		displayNoticeAndWarn("Migrating to version 3.0...");

		// @ts-ignore - no more primary heading. this also makes sure migrate logic runs once
		settings.autoCreatePrimaryHeading = null;

		// @ts-ignore - became an array
		settings.excludedFolders =
			// @ts-ignore - became an array
			((settings.excludedFolders as string) || "")
				.split(",")
				.filter((t) => t != "") || [];

		// @ts-ignore - new name for tags and became array
		settings.excludedTags =
			// @ts-ignore - new name for tags and became array
			((settings.tags as string) || "")
				.split(",")
				.filter((t) => t != "") || [];

		// @ts-ignore - new name for name contains and became array
		settings.excludedNameContains =
			// @ts-ignore - new name for name contains and became array
			((settings.ignoredNameContains as string) || "")
				.split(",")
				.filter((t) => t != "") || [];

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

		settings.separateOutputFormats = false;
		settings.createdFormat = "";
		settings.modifiedFormat = "";
		settings.deletedFormat = "";

		// CREATE all new divider settings
		settings.autoCreateCreatedDivider = true;
		settings.autoCreateModifiedDivider = true;
		settings.autoCreateDeletedDivider = true;

		saveSettings();
		displayNoticeAndWarn(
			"Migration complete. Your settings have been preserved, but this update adds new features. " +
				"The plugin WILL NOT WORK until you configure the new settings. Please read " +
				'<a href="https://github.com/franciskafieh/obsidian-list-modified/wiki">https://github.com/franciskafieh/obsidian-list-modified/wiki</a> for info.'
		);
	}
}
