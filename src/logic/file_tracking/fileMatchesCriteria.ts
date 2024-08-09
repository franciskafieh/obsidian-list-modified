import { File } from "../../interfaces/File";
import { Settings } from "../../interfaces/Settings";

// in Obsidian getAllTags() should be passed into allTags.
export default function fileMatchesCriteria(
	file: File,
	allTags: string[] | null,
	settings: Settings,
) {
	// check tags
	if (allTags) {
		for (const tag of settings.excludedTags) {
			if (allTags.includes(tag)) {
				return false;
			}
		}
	}

	// check file name
	for (const excludedName of settings.excludedNameContains) {
		if (file.basename.includes(excludedName)) {
			return false;
		}
	}

	// check folder/path
	for (const excludedFolder of settings.excludedFolders) {
		if (file.parent && file.parent.path.includes(excludedFolder)) {
			return false;
		}
	}

	return true;
}
