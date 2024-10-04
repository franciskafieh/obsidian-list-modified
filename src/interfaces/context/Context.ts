import { FileConverter } from "./FileConverter";
import { FileMetadataCacheProvider } from "./FileMetadataCacheProvider";
import { ReplacementDictionary } from "./ReplacementDictionary";
import { Settings } from "../Settings";
import { Vault } from "../Vault";

export interface Context {
	settings: Settings;
	replacementDictionary: ReplacementDictionary;
	fileConverter: FileConverter;
	vault: Vault;
	fileMetadataCacheProvider: FileMetadataCacheProvider;
}
