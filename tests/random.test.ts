import { TestSettingsBuilder } from "./mocks/TestSettingsBuilder";

test("a", () => {
	const builder = new TestSettingsBuilder();
	builder.setTags(["a", "f"]);

	const testSettings = builder.build();

	expect(testSettings.tags).toBe("ddd");
});
