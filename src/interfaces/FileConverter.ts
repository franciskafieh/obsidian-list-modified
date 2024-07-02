import { File } from "./File";
import { Vault } from "./Vault";

export interface FileConverter {
	fromPath(path: string, vault?: Vault): File | null;
}
