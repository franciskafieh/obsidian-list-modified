import { Context } from "../../../src/interfaces/context/Context";
import { TestFileConverter } from "./TestFileConverter";
import { TestFileMetadataCacheProvider } from "./TestFileMetadataCacheProvider";
import { TestReplacementDictionary } from "./TestReplacementDictionary";
import { TestSettings } from "./TestSettings";
import { TestVault } from "./TestVault";

export class TestContext implements Context {
	settings: TestSettings;
	replacementDictionary: TestReplacementDictionary;
	fileConverter: TestFileConverter;
	vault: TestVault;
	fileMetadataCacheProvider: TestFileMetadataCacheProvider;

	constructor(
		settings: TestSettings,
		replacementDictionary: TestReplacementDictionary,
		fileConverter: TestFileConverter,
		vault: TestVault,
		fileMetadataCacheProvider: TestFileMetadataCacheProvider
	) {
		this.settings = settings;
		this.replacementDictionary = replacementDictionary;
		this.fileConverter = fileConverter;
		this.vault = vault;
		this.fileMetadataCacheProvider = fileMetadataCacheProvider;
	}
}
