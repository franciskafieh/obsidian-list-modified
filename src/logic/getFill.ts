export function getFill(
	trackedFiles: {
		path: string;
		supposedList: "created" | "modified" | "deleted";
		matchesCriteria: boolean;
	}[],
	combineCreatedAndModified: boolean
) {
	return { created: "", modified: "", deleted: "" };
}
