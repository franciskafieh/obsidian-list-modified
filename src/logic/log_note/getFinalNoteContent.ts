import { FileConverter } from "../../interfaces/FileConverter";
import { ReplacementDictionary } from "../../interfaces/ReplacementDictionary";
import { Settings } from "../../interfaces/Settings";
import { Vault } from "../../interfaces/Vault";
import { ListType } from "../../types";
import { consoleWarnIfVerboseMode } from "../../utils/alerter";
import { fillLineXToYWithContent } from "./fillLineXToYWithContent";
import { getDividerPositions } from "./getDividerPositions";
import { getFill } from "./getFill";

export function getFinalNoteContent(
	fileContent: string,
	settings: Settings,
	replacementDictionary: ReplacementDictionary,
	fileConverter: FileConverter,
	vault: Vault,
) {
	const contentByLine = fileContent.split("\n");
	const dividerPositions = getDividerPositions(contentByLine);

	if (
		settings.autoCreateCreatedDivider &&
		!settings.combineCreatedAndModified
	) {
		if (
			dividerPositions.created.start === -1 ||
			dividerPositions.created.end === -1
		) {
			consoleWarnIfVerboseMode(
				"auto creating created divider...",
				settings.verboseModeEnabled,
			);

			contentByLine.push("%% LIST CREATED %%");
			contentByLine.push("%% END %%");

			// update divider positions
			dividerPositions.created.start = contentByLine.length - 2;
			dividerPositions.created.end = contentByLine.length - 1;
		}
	}

	if (settings.autoCreateModifiedDivider) {
		if (
			dividerPositions.modified.start === -1 ||
			dividerPositions.modified.end === -1
		) {
			consoleWarnIfVerboseMode(
				"auto creating modified divider...",
				settings.verboseModeEnabled,
			);
			contentByLine.push("%% LIST MODIFIED %%");
			contentByLine.push("%% END %%");

			// update divider positions
			dividerPositions.modified.start = contentByLine.length - 2;
			dividerPositions.modified.end = contentByLine.length - 1;
		}
	}

	if (settings.autoCreateDeletedDivider) {
		if (
			dividerPositions.deleted.start === -1 ||
			dividerPositions.deleted.end === -1
		) {
			consoleWarnIfVerboseMode(
				"auto creating deleted divider...",
				settings.verboseModeEnabled,
			);
			contentByLine.push("%% LIST DELETED %%");
			contentByLine.push("%% END %%");

			// update divider positions
			dividerPositions.deleted.start = contentByLine.length - 2;
			dividerPositions.deleted.end = contentByLine.length - 1;
		}
	}

	const fill = getFill(settings, replacementDictionary, fileConverter, vault);

	let finalContent = contentByLine;

	// netLineOffset takes into account how many lines
	// the content has been offset due to fill expansion/shrinking of dividers
	let netLineOffset = 0;
	for (const l in fill) {
		const listType = l as ListType;
		// empty array, skip
		if (fill[listType].length === 0) {
			continue;
		}

		if (
			dividerPositions[listType].start === -1 ||
			dividerPositions[listType].end === -1
		) {
			continue;
		}

		const filled = fillLineXToYWithContent(
			finalContent,
			dividerPositions[listType].start + 1 + netLineOffset,
			dividerPositions[listType].end - 1 + netLineOffset,
			fill[listType],
		);
		finalContent = filled.filled;
		netLineOffset += filled.lineOffset;
	}

	return finalContent.join("\n");
}
