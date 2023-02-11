import { DEFAULT_SETTINGS } from "src/constants";
import ListModified from "src/main";
import { ListModifiedSettings } from "src/types";
import { writeListsToLogFile } from "./fileWriter";
import { App } from "obsidian";

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
	await writeListsToLogFile();
}

export async function initSettings(initPlugin: ListModified) {
	plugin = initPlugin;
	settings = await Object.assign({}, DEFAULT_SETTINGS, initPlugin.loadData());
}
