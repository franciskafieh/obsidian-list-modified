import { Context } from "../../interfaces/context/Context";
import { ListType } from "../../types";
import { fillLineXToYWithContent } from "./fillLineXToYWithContent";
import { getDividerPositions } from "./getDividerPositions";
import { getFill } from "./getFill";
import { getSectionOrder } from "./getSectionOrder";

export function getFinalNoteContent(fileContent: string, context: Context) {
	const settings = context.settings;

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
			contentByLine.push("%% LIST DELETED %%");
			contentByLine.push("%% END %%");

			// update divider positions
			dividerPositions.deleted.start = contentByLine.length - 2;
			dividerPositions.deleted.end = contentByLine.length - 1;
		}
	}

	const fill = getFill(context);

	let finalContent = contentByLine;

	// get sections in order of appearance in the note
	const sectionOrder = getSectionOrder(dividerPositions);

	// netLineOffset takes into account how many lines
	// the content has been offset due to fill expansion/shrinking of dividers
	let netLineOffset = 0;
	for (const listType of sectionOrder) {
		const filled = fillLineXToYWithContent(
			finalContent,
			dividerPositions[listType].start + 1 + netLineOffset,
			dividerPositions[listType].end - 1 + netLineOffset,
			fill[listType]
		);
		finalContent = filled.filled;
		netLineOffset += filled.lineOffset;
	}

	return finalContent.join("\n");
}
