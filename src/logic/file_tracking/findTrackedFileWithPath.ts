import { ISettings } from "../../interfaces/ISettings";

export function findTrackedFileWithPath(
	desiredPath: string,
	settings: ISettings,
) {
	return settings.trackedFiles.find(({ path }) => path === desiredPath);
}
