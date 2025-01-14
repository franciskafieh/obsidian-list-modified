import { AbstractFile } from "../../src/interfaces/AbstractFile";
import { File } from "../../src/interfaces/File";
import { Folder } from "../../src/interfaces/Folder";
import { Vault } from "../../src/interfaces/Vault";

export const getSingleFileWithPath = (path: string) =>
	({
		basename: getBasenameFromPath(path),
		extension: getExtensionFromPath(path),
		path: path,
		stat: { ctime: 0, mtime: 0, size: 0 },
		name: "", // not used
		parent: {
			name: "", // not used
			parent: {}, // not used
			vault: {}, // not used
			children: [] as AbstractFile[], // not used
			path: path.substring(0, path.lastIndexOf("/")),
		} as Folder,
		vault: {} as Vault, // not used
	} as File);

function getBasenameFromPath(path: string) {
	const pathNoFolder = path.split("/").pop();
	if (!pathNoFolder) {
		return "";
	}
	return pathNoFolder.substring(0, pathNoFolder.lastIndexOf(".")) || "";
}

function getExtensionFromPath(path: string) {
	return path.split(".").pop() || "";
}
