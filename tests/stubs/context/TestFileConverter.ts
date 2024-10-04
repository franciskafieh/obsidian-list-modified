import { File } from "../../../src/interfaces/File";
import { FileConverter } from "../../../src/interfaces/context/FileConverter";
import { getSingleFileWithPath } from "../fakeFiles";

export class TestFileConverter implements FileConverter {
	fromPath(path: string): File | null {
		return getSingleFileWithPath(path);
	}
}
