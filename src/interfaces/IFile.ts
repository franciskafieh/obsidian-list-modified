import { IAbstractFile } from "./IAbstractFile";
import { IFileStats } from "./IFileStats";

export interface IFile extends IAbstractFile {
	basename: string;
	extension: string;
	stat: IFileStats;
}
