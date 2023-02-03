import { serialize } from "monkey-around";
import { TAbstractFile } from "obsidian";

const onVaultCreate = serialize(async (file: TAbstractFile) => {
	// todo
});

export default onVaultCreate;
