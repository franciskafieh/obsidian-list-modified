// @ts-nocheck
import { App } from "obsidian";


export function getDailyNoteFormat(app: App): string {
	const dailyNotesPlugin =
			app.internalPlugins?.getPluginById("daily-notes")?.instance
				.options;

	if (!dailyNotesPlugin) {
		return '';
	}

    return `[${dailyNotesPlugin.folder}]/${dailyNotesPlugin.format}`
}