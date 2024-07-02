import { Vault } from "obsidian";
import { File } from "../../interfaces/File";
import { FileConverter } from "../../interfaces/FileConverter";

export class ObsidianFileConverter implements FileConverter {
	fromPath(path: string, vault: Vault): File | null {
		return vault.getFileByPath(path);
	}
}
