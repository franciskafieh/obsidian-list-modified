import { ISettings } from "../../interfaces/ISettings";
import { getFinalNoteContent } from "../../logic/getFinalNoteContent";
import { warnUserOnce } from "../../utils/alerter";
import { getPlugin, getSettings } from "../settings/settings";
import { createLogNote, getLogNote } from "./logNote";

export async function writeChangesToLogNote(settings: ISettings) {
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
		getFinalNoteContent(data, getSettings()),
	);
}
