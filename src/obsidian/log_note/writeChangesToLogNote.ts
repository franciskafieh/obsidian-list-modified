import { getFinalNoteContent } from "../../logic/log_note/getFinalNoteContent";
import { consoleWarnIfVerboseMode, warnUserOnce } from "../../utils/alerter";
import { ObsidianFileConverter } from "../implementations/ObsidianFileConverter";
import { ObsidianReplacementDictionary } from "../implementations/ObsidianReplacementDictionary";
import { getPlugin, getSettings } from "../settings/settings";
import { createLogNote, getLogNote } from "./logNote";

export async function writeChangesToLogNote() {
	const settings = getSettings();

	consoleWarnIfVerboseMode(
		"writing to log note",
		settings.verboseModeEnabled,
	);

	if (!getLogNote()) {
		if (settings.autoCreateLogNote) {
			await createLogNote();
			consoleWarnIfVerboseMode(
				"log note did not exist, but will autocreate...",
				settings.verboseModeEnabled,
			);
		} else {
			warnUserOnce(
				"fileNotExisting",
				"Log note not found. You must create one or enable auto-creation in settings for the plugin to work.",
			);
			return;
		}
	}

	const frontmatterCache =
		getPlugin().app.metadataCache.getFileCache(getLogNote());

	getPlugin().app.vault.process(getLogNote(), (data) => {
		return getFinalNoteContent(
			data,
			settings,
			new ObsidianReplacementDictionary(),
			frontmatterCache,
			new ObsidianFileConverter(),
			getPlugin().app.vault,
		);
	});
}
