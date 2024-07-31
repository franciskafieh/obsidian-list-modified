import { getFinalNoteContent } from "../../logic/log_note/getFinalNoteContent";
import { warnUserOnce } from "../../utils/alerter";
import { ObsidianFileConverter } from "../implementations/ObsidianFileConverter";
import { ObsidianReplacementDictionary } from "../implementations/ObsidianReplacementDictionary";
import { getPlugin, getSettings } from "../settings/settings";
import { createLogNote, getLogNote } from "./logNote";

export async function writeChangesToLogNote() {
	const settings = getSettings();
	if (!getLogNote()) {
		if (settings.autoCreateLogNote) {
			await createLogNote();
		} else {
			warnUserOnce(
				"fileNotExisting",
				"Log note not found. You must create one or enable auto-creation in settings for the plugin to work.",
			);
			return;
		}
	}
	getPlugin().app.vault.process(getLogNote(), (data) =>
		getFinalNoteContent(
			data,
			settings,
			new ObsidianReplacementDictionary(),
			new ObsidianFileConverter(),
		),
	);
}
