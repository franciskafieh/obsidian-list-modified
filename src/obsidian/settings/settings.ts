export async function initSettings(plugin: ListModified) {
	settings = Object.assign({}, DEFAULT_SETTINGS, await plugin.loadData());
}
