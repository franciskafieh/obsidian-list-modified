import { Settings } from "../../interfaces/Settings";
import ListModified from "../../main";
import { consoleWarnIfVerboseMode } from "../../utils/alerter";
import { writeChangesToLogNote } from "../log_note/writeChangesToLogNote";
import { OBSIDIAN_DEFAULT_SETTINGS } from "./ObsidianDefaultSettings";

let plugin: ListModified;
let settings: Settings;

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
		OBSIDIAN_DEFAULT_SETTINGS,
		await plugin.loadData(),
	);

	consoleWarnIfVerboseMode(
		"Settings loaded: " + JSON.stringify(settings),
		settings.verboseModeEnabled,
	);

	if (settings.writeInterval !== 0) {
		consoleWarnIfVerboseMode(
			"Write interval enabled. Running...",
			settings.verboseModeEnabled,
		);
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
		await writeChangesToLogNote();
	}
}

export async function saveSettings() {
	await plugin.saveData(settings);
}
