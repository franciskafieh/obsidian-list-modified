import { Settings } from "../../interfaces/Settings";

export function findTrackedFileWithPath(
	desiredPath: string,
	settings: Settings,
) {
	return settings.trackedFiles.find(({ path }) => path === desiredPath);
}
