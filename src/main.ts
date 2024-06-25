import { Plugin } from "obsidian";
import { ISettings } from "./interfaces/ISettings";
import onMetadataCacheChanged from "./obsidian/listeners/onMetadataCacheChanged";

export default class ListModified extends Plugin {
	async onload(): Promise<void> {
		// await initSettings(this);
		// etc
		this.registerEvent(
			this.app.metadataCache.on("changed", onMetadataCacheChanged)
		);
	}

	migrateToThreePointZeroIfNeeded(settings: ISettings) {
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

		// todo: save settings. maybe implement an auto saving version of the settings where setting a property through a class also calls save??
		// disable the plugin and send notice with wiki until user enabled
	}
}

// getSetting("ddsfsdf")
// setSetting("dsfsdf", "value") - this will also saveSettings()
// writeToLogNoteIfNoDelay()
// otherwise just do it on next save
