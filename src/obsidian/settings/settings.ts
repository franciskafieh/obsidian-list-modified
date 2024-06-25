import { ISettings } from "../../interfaces/ISettings";
import ListModified from "../../main";
import { writeChangesToLogNote } from "../logNote/writeChangesToLogNote";
import { ObsidianDefaultSettings } from "./ObsidianDefaultSettings";

let plugin: ListModified;
let settings: ISettings;

export function getSettings() {
	return settings;
}

export function getPlugin() {
	return plugin;
}

export async function initSettings(initPlugin: ListModified) {
	plugin = initPlugin;
	settings = Object.assign(
		{},
		ObsidianDefaultSettings,
		await plugin.loadData(),
	);

	if (settings.writeInterval !== 0) {
		initPlugin.registerInterval(
			window.setInterval(async () => {
				await saveSettingsAndWriteToLogNote(true);
			}, settings.writeInterval * 1000),
		);
	}
}

export async function saveSettingsAndWriteToLogNote(force?: boolean) {
	await saveSettings();

	if (force || settings.writeInterval === 0) {
		writeChangesToLogNote();
	}
}

export async function saveSettings() {
	await plugin.saveData(settings);
}
