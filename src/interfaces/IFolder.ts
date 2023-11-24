import { IAbstractFile } from "./IAbstractFile";

export interface IFolder extends IAbstractFile {
	children: IAbstractFile[];
}
