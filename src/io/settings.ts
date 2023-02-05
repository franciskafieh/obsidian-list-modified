import { DEFAULT_SETTINGS } from "src/constants";
import ListModified from "src/main";
import { ListModifiedSettings } from "src/types";

let plugin: ListModified;
let settings: ListModifiedSettings;

export function getSettings(): ListModifiedSettings {
	return settings;
}

export async function saveSettings() {
	await plugin.saveData(settings);
}

export async function saveSettingsAndWriteTrackedFiles() {
	await saveSettings();
	// writer.updateTrackedFiles();
}

export async function initSettings(initPlugin: ListModified) {
	plugin = initPlugin;

	settings = Object.assign({}, DEFAULT_SETTINGS, initPlugin.loadData());
}
