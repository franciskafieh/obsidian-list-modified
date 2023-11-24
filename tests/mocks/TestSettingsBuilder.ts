import { TestSettings } from "./TestSettings";

export class TestSettingsBuilder {
	private testSettings: TestSettings;

	constructor() {
		this.testSettings = new TestSettings();
	}

	public setTags(tags: string): this;
	public setTags(tags: string[]): this;
	public setTags(tags: string | string[]) {
		if (Array.isArray(tags)) {
			this.testSettings.tags = tags.join(",");
		}

		this.testSettings.tags = tags as string;

		return this;
	}

	public build() {
		return this.testSettings;
	}
}
