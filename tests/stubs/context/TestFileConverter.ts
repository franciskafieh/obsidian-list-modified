import { File } from "../../../src/interfaces/File";
import { FileConverter } from "../../../src/interfaces/context/FileConverter";
import {
	getSingleFileWithPath,
	getSingleFileWithPathAndCtime,
} from "../fakeFiles";

export class TestFileConverter implements FileConverter {
	fromPath(path: string): File | null {
		if (path.startsWith("ctime-")) {
			return getSingleFileWithPathAndCtime(
				path,
				Number.parseInt(path.substring(6, path.lastIndexOf(".md")))
			);
		}
		return getSingleFileWithPath(path);
	}
}
