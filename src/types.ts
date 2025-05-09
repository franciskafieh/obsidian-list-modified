import { File } from "./interfaces/File";

export type ListType = "created" | "modified" | "deleted";
export type LogNoteType = "daily" | "weekly" | "monthly";
export type SortOption =
	| "none"
	| "alphabetical"
	| "alphabetical-reverse"
	| "mtime"
	| "mtime-reverse"
	| "ctime"
	| "ctime-reverse";

export type TrackedFile = {
	path: string;
	supposedList: ListType;
	matchesCriteria: boolean;
};

export type OutputFile = {
	output?: string;
	file: File | null;
	path: string;
};
