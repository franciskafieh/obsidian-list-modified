import { Folder } from "./Folder";
import { Vault } from "./Vault";

export interface AbstractFile {
	name: string;
	parent: Folder | null;
	path: string;
	vault: Vault;
}
