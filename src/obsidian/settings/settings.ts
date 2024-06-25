import { ISettings } from "../../interfaces/ISettings";
import ListModified from "../../main";
import { writeChangesToLogNote } from "../logNote/writeChangesToLogNote";
import { ObsidianDefaultSettings } from "./ObsidianDefaultSettings";

let plugin: ListModified;
let settings: ISettings;

export function Settings() {
	return settings;
}

export async function initSettings(initPlugin: ListModified) {
	plugin = initPlugin;
	settings = Object.assign(
		{},
		ObsidianDefaultSettings,
		await plugin.loadData(),
	);

	if (settings.writeInterval !== 0) {
		// writeChangesToLogNote(); INTERVAL TODO
	}
}

export async function saveSettings() {
	await plugin.saveData(settings);

	if (settings.writeInterval === 0) {
		writeChangesToLogNote();
	}
	// writeChangesToNote if no interval TODO
}
