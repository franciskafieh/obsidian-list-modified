import { FileConverter } from "../../interfaces/FileConverter";
import { ReplacementDictionary } from "../../interfaces/ReplacementDictionary";
import { Settings } from "../../interfaces/Settings";
import { ListType } from "../../types";
import { fillLineXToYWithContent } from "./fillLineXToYWithContent";
import { getDividerPositions } from "./getDividerPositions";
import { getFill } from "./getFill";

export function getFinalNoteContent(
	fileContent: string,
	settings: Settings,
	replacementDictionary: ReplacementDictionary,
	fileConverter: FileConverter,
) {
	const contentByLine = fileContent.split("\n");
	const dividerPositions = getDividerPositions(contentByLine);
	// skip each section if start/end is -1
	const fill = getFill(
		settings.trackedFiles,
		settings,
		replacementDictionary,
		fileConverter,
	);

	let finalContent = contentByLine;

	for (const l in fill) {
		const listType = l as ListType;
		// empty array, skip
		if (fill[listType].length === 0) {
			continue;
		}

		finalContent = fillLineXToYWithContent(
			finalContent,
			dividerPositions[listType].start,
			dividerPositions[listType].end,
			fill[listType],
		);
	}

	return finalContent.join("\n");
}
