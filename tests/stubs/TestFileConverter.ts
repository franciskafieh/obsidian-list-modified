import { File } from "../../src/interfaces/File";
import { FileConverter } from "../../src/interfaces/FileConverter";
import { Vault } from "../../src/interfaces/Vault";
import { getSingleFileWithPath } from "./fakeFiles";

export class TestFileConverter implements FileConverter {
	fromPath(path: string): File | null {
		return getSingleFileWithPath(path);
	}
}
