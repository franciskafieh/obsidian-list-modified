import { File } from "../../interfaces/File";
import { Settings } from "../../interfaces/Settings";

// in Obsidian getAllTags() should be passed into allTags.
export default function fileMatchesCriteria(
	file: File,
	allTags: string[] | null,
	settings: Settings,
) {
	// check if allTags is null
	// todo - implement
	return true;
}
