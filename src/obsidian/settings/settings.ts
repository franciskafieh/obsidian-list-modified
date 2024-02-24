// let plugin: ListModified;
// let settings: ListModifiedSettings;

// export function getSettings(): ListModifiedSettings {
// 	return settings;
// }

// export async function saveSettings() {
// 	await plugin.saveData(settings);

// 	if (settings.verboseModeEnabled) {
// 		console.log("OLM settings saved.");
// 	}
// }

// export async function saveSettingsAndWriteTrackedFiles() {
// 	await saveSettings();
// 	await writeListsToLogFile();
// }

// export async function initSettings(initPlugin: ListModified) {
// 	plugin = initPlugin;
// 	settings = Object.assign({}, DEFAULT_SETTINGS, await plugin.loadData());
// }
