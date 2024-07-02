import { File } from "../../interfaces/File";
import { ReplacementDictionary } from "../../interfaces/ReplacementDictionary";
import { Settings } from "../../interfaces/Settings";

export function getFormattedOutputGivenFile(
	file: File,
	replacementDictionary: ReplacementDictionary,
	settings: Settings,
): string {
	return replacementDictionary.getOutputPostReplacement(
		settings.outputFormat,
		file,
	);
}
