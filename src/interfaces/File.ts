import { AbstractFile } from "./AbstractFile";
import { FileStats } from "./FileStats";

export interface File extends AbstractFile {
	basename: string;
	extension: string;
	stat: FileStats;
}
