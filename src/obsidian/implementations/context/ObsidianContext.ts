import { Vault } from "obsidian";
import { Context } from "../../../interfaces/context/Context";
import { Settings } from "../../../interfaces/Settings";
import { ObsidianFileConverter } from "./ObsidianFileConverter";
import { ObsidianReplacementDictionary } from "./ObsidianReplacementDictionary";
import { FileMetadataCacheProvider } from "../../../interfaces/context/FileMetadataCacheProvider";
import { ObsidianFileMetadataCacheProvider } from "./ObsidianFileMetadataCacheProvider";

export class ObsidianContext implements Context {
	settings: Settings;
	replacementDictionary: ObsidianReplacementDictionary;
	fileConverter: ObsidianFileConverter;
	vault: Vault;
	fileMetadataCacheProvider: ObsidianFileMetadataCacheProvider;

	constructor(
		settings: Settings,
		replacementDictionary: ObsidianReplacementDictionary,
		fileConverter: ObsidianFileConverter,
		vault: Vault,
		fileMetadataCacheProvider: FileMetadataCacheProvider
	) {
		this.settings = settings;
		this.replacementDictionary = replacementDictionary;
		this.fileConverter = fileConverter;
		this.vault = vault;
		this.fileMetadataCacheProvider = fileMetadataCacheProvider;
	}
}
