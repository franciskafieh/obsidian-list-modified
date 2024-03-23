import { Plugin } from "obsidian";
import { ISettings } from "./interfaces/ISettings";

export default class ListModified extends Plugin {
	async onload(): Promise<void> {
		// await initSettings(this);
		// etc
	}

	migrateToThreePointZeroIfNeeded(settings: ISettings) {
		// @ts-ignore - property should not exist but may
		// if still have old setting
		if (!settings.autoCreatePrimaryHeading) {
			return;
		}

		settings.timeFormat = "set a default here"; //todo

		// @ts-ignore - property should not exist but may
		if (settings.separateCreated) {
			// @ts-ignore
			settings.combineCreatedAndModified = !settings.separateCreated;
		}

		// todo: save settings. maybe implement an auto saving version of the settings where setting a property through a class also calls save??
	}
}

// new migrator for breaking changes
