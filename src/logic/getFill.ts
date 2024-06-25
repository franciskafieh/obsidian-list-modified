import { MomentFormatComponent } from "obsidian";
import { TrackedFile } from "../types";

export function getFill(
	paths: {
		created: string[];
		modified: string[];
		deleted: string[];
	},
	time: MomentFormatComponent
) {
	const created = [];
	const modified = [];
	const deleted = [];
}

// have time, etc, replacements as args??

// keep separate bc easier to test?
export function getPaths(
	trackedFiles: TrackedFile[],
	combineCreatedAndModified: boolean
) {
	const created = [];
	const modified = [];
	const deleted = [];
	for (const file of trackedFiles) {
		if (!file.matchesCriteria) {
			continue;
		}

		if (file.supposedList === "created") {
			if (combineCreatedAndModified) {
				modified.push(file.path);
			} else {
				created.push(file.path);
			}
		} else if (file.supposedList === "modified") {
			modified.push(file.path);
		} else if (file.supposedList === "deleted") {
			deleted.push(file.path);
		}
	}

	return { created, modified, deleted };
}
