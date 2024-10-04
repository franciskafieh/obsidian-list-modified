import { Settings } from "../../../src/interfaces/Settings";
import { TestContext } from "./TestContext";
import { TestFileConverter } from "./TestFileConverter";
import { TestFileMetadataCacheProvider } from "./TestFileMetadataCacheProvider";
import { TestReplacementDictionary } from "./TestReplacementDictionary";
import { TestSettingsBuilder } from "./TestSettingsBuilder";
import { TestVault } from "./TestVault";

export function createTestContextWithSettings(settings: Settings) {
	return new TestContext(
		settings,
		new TestReplacementDictionary(),
		new TestFileConverter(),
		new TestVault(),
		new TestFileMetadataCacheProvider()
	);
}

export function createDefaultTestContext() {
	return createTestContextWithSettings(new TestSettingsBuilder().build());
}
