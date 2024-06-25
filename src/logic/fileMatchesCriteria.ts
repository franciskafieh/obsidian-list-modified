import { IFile } from "../interfaces/IFile";
import { ISettings } from "../interfaces/ISettings";

// in Obsidian getAllTags() should be passed into allTags.
export default function fileMatchesCriteria(
	file: IFile,
	allTags: string[],
	settings: ISettings,
) {
	return false;
}
