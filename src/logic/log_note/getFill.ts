import { TrackedFile } from "../../types";
import { Settings } from "../../interfaces/Settings";
import { ReplacementDictionary } from "../../interfaces/ReplacementDictionary";
import { FileConverter } from "../../interfaces/FileConverter";
import { Vault } from "../../interfaces/Vault";

export function getFill(
	settings: Settings,
	replacementDictionary: ReplacementDictionary,
	fileConverter: FileConverter,
	vault: Vault,
) {
	const created = [];
	const modified = [];
	const deleted = [];

	const trackedFiles = settings.trackedFiles;
	for (const trackedFile of trackedFiles) {
		if (!trackedFile.matchesCriteria || !trackedFile.path) {
			continue;
		}

		const file = fileConverter.fromPath(trackedFile.path, vault);

		const formattedOutput = replacementDictionary.getOutputPostReplacement(
			settings.outputFormat,
			file,
			trackedFile.path,
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
