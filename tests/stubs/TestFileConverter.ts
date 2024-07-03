import { File } from "../../src/interfaces/File";
import { FileConverter } from "../../src/interfaces/FileConverter";
import { Vault } from "../../src/interfaces/Vault";

export class TestFileConverter implements FileConverter {
	fromPath(path: string): File | null {
		return {
			basename: path,
			extension: path, // not used
			path: "looool.md",
			stat: { ctime: 2, mtime: 2, size: 0 },
			name: path, // not used
			parent: null, // not used
			vault: {} as Vault, // not used
		};
	}
}
