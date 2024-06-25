import { getFinalNoteContent } from "../../logic/getFinalNoteContent";
import { getPlugin, getSettings } from "../settings/settings";
import { getLogNote } from "./logNote";

export function writeChangesToLogNote() {
	getPlugin().app.vault.process(getLogNote(), (data) =>
		getFinalNoteContent(data, getSettings()),
	);
}
