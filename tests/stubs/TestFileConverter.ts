import { File } from "../../src/interfaces/File";
import { FileConverter } from "../../src/interfaces/FileConverter";
import { Vault } from "../../src/interfaces/Vault";

export class TestFileConverter implements FileConverter {
	fromPath(path: string): File | null {
		return {
			basename: "tmp",
			extension: ".md",
			path: "tmp.md",
			stat: { ctime: 2, mtime: 2, size: 0 },
			name: "",
			parent: null,
			vault: {} as Vault,
		};
	}
}
