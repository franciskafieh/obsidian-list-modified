import { IFolder } from "./IFolder";
import { IVault } from "./IVault";

export interface IAbstractFile {
	name: string;
	parent: IFolder | null;
	path: string;
	vault: IVault;
}
