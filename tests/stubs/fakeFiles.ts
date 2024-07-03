import { File } from "../../src/interfaces/File";
import { Vault } from "../../src/interfaces/Vault";

export const getSingleFileWithPath = (path: string) =>
	({
		basename: getBasenameFromPath(path),
		extension: "", // not used
		path: path,
		stat: { ctime: 0, mtime: 0, size: 0 },
		name: "", // not used
		parent: null, // not used
		vault: {} as Vault, // not used}
	}) as File;

function getBasenameFromPath(path: string) {
	return path.split("/").pop()?.slice(0, -3) || "";
}
