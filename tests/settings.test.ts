import { TestSettingsBuilder } from "./mocks/TestSettingsBuilder";

let builder: TestSettingsBuilder;

beforeEach(() => {
	builder = new TestSettingsBuilder();
});

describe("settings object mock maniuplation", () => {
	it("should be modified", () => {
		builder.setTags(["a", "f"]);

		const testSettings = builder.build();

		expect(testSettings.tags).toBe("a,f");
	});

	it("should be default", () => {
		const testSettings = builder.build();
		expect(testSettings.deletedHeading).toBe("Deleted");
	});
});
