export type ListType = "created" | "modified" | "deleted";
export type LogNoteType = "daily" | "weekly" | "monthly";
export type TrackedFile = {
	path: string;
	supposedList: ListType;
	matchesCriteria: boolean;
};
