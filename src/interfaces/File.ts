import { AbstractFile } from "./AbstractFile";
import { FileStats } from "./FileStats";
import { Folder } from "./Folder";

export interface File extends AbstractFile {
	basename: string;
	parent: Folder | null;
	extension: string;
	stat: FileStats;
}
