import { AbstractFile } from "./AbstractFile";

export interface Folder extends AbstractFile {
	children: AbstractFile[];
}
