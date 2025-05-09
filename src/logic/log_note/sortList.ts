import { OutputFile, SortOption } from "../../types";

export function sortList(
	unsortedFiles: OutputFile[],
	sortOption: SortOption
): OutputFile[] {
	let sortedFiles: OutputFile[];

	switch (sortOption) {
		case "alphabetical":
			sortedFiles = [...unsortedFiles].sort((a, b) => {
				if (a.file && b.file) {
					return a.file.basename.localeCompare(b.file.basename);
				}

				// fallback if no file, compare from last / to file .md
				const aPathParts = a.path.split("/");
				const bPathParts = b.path.split("/");
				const aFileName = aPathParts[aPathParts.length - 1];
				const bFileName = bPathParts[bPathParts.length - 1];

				return aFileName.localeCompare(bFileName);
			});
			break;
		case "alphabetical-reverse":
			sortedFiles = [...unsortedFiles].sort((a, b) => {
				if (a.file && b.file) {
					return b.file.basename.localeCompare(a.file.basename);
				}

				// fallback if no file, compare from last / to file .md
				const aPathParts = a.path.split("/");
				const bPathParts = b.path.split("/");
				const aFileName = aPathParts[aPathParts.length - 1];
				const bFileName = bPathParts[bPathParts.length - 1];
				return bFileName.localeCompare(aFileName);
			});
			break;
		case "mtime":
			sortedFiles = [...unsortedFiles].sort((a, b) => {
				if (a.file && b.file) {
					return a.file.stat.mtime - b.file.stat.mtime;
				}

				// fallback if no file, do not change order
				return 0;
			});
			break;
		case "mtime-reverse":
			sortedFiles = [...unsortedFiles].sort((a, b) => {
				if (a.file && b.file) {
					return b.file.stat.mtime - a.file.stat.mtime;
				}

				// fallback if no file, do not change order
				return 0;
			});
			break;
		case "ctime":
			sortedFiles = [...unsortedFiles].sort((a, b) => {
				if (a.file && b.file) {
					return a.file.stat.ctime - b.file.stat.ctime;
				}

				// fallback if no file, do not change order
				return 0;
			});
			break;
		case "ctime-reverse":
			sortedFiles = [...unsortedFiles].sort((a, b) => {
				if (a.file && b.file) {
					return b.file.stat.ctime - a.file.stat.ctime;
				}

				// fallback if no file, do not change order
				return 0;
			});
			break;
		default:
			sortedFiles = [...unsortedFiles];
	}

	return sortedFiles;
}
