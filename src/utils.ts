// @ts-nocheck
import { App } from "obsidian";


export function getDailyNoteFormat(app: App): string {
	const dailyNotesPlugin: string =
			app.internalPlugins.getPluginById("daily-notes").instance
				.options;

    return `[${dailyNotesPlugin.folder}]/${dailyNotesPlugin.format}`
}