import { MomentFormatComponent } from "obsidian";
import { TrackedFile } from "../../types";
import { Settings } from "../../interfaces/Settings";
import { getFormattedOutputGivenFile } from "./getFormattedOutputGivenFile";
import { ReplacementDictionary } from "../../interfaces/ReplacementDictionary";
import { FileConverter } from "../../interfaces/FileConverter";

export function getFill(
	trackedFiles: TrackedFile[],
	settings: Settings,
	replacementDictionary: ReplacementDictionary,
	fileConverter: FileConverter,
) {
	const created = [];
	const modified = [];
	const deleted = [];
	for (const trackedFile of trackedFiles) {
		if (!trackedFile.matchesCriteria || !trackedFile.path) {
			continue;
		}

		const file = fileConverter.fromPath(trackedFile.path);

		if (!file) {
			continue;
		}

		const formattedOutput = getFormattedOutputGivenFile(
			file,
			replacementDictionary,
			settings,
		);

		if (trackedFile.supposedList === "created") {
			if (settings.combineCreatedAndModified) {
				modified.push(formattedOutput);
			} else {
				created.push(formattedOutput);
			}
		} else if (trackedFile.supposedList === "modified") {
			modified.push(formattedOutput);
		} else if (trackedFile.supposedList === "deleted") {
			deleted.push(formattedOutput);
		}
	}

	return { created, modified, deleted };
}
