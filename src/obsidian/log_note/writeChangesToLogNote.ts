import { getFinalNoteContent } from "../../logic/log_note/getFinalNoteContent";
import { consoleWarnIfVerboseMode, warnUserOnce } from "../../utils/alerter";
import { ObsidianContext } from "../implementations/context/ObsidianContext";
import { ObsidianFileConverter } from "../implementations/context/ObsidianFileConverter";
import { ObsidianFileMetadataCacheProvider } from "../implementations/context/ObsidianFileMetadataCacheProvider";
import { ObsidianReplacementDictionary } from "../implementations/context/ObsidianReplacementDictionary";
import { getPlugin, getSettings } from "../settings/settings";
import { createLogNote, getLogNote } from "./logNote";

export async function writeChangesToLogNote() {
	const settings = getSettings();

	consoleWarnIfVerboseMode(
		"writing to log note",
		settings.verboseModeEnabled
	);

	if (!getLogNote()) {
		if (settings.autoCreateLogNote) {
			await createLogNote();
			consoleWarnIfVerboseMode(
				"log note did not exist, but will autocreate...",
				settings.verboseModeEnabled
			);
		} else {
			warnUserOnce(
				"fileNotExisting",
				"Log note not found. You must create one or enable auto-creation in settings for the plugin to work."
			);
			return;
		}
	}

	getPlugin().app.vault.process(getLogNote(), (data) => {
		return getFinalNoteContent(
			data,
			new ObsidianContext(
				settings,
				new ObsidianReplacementDictionary(),
				new ObsidianFileConverter(),
				getPlugin().app.vault,
				new ObsidianFileMetadataCacheProvider()
			)
		);
	});
}
