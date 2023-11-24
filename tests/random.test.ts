// import testFn from "../src/utils/testFn";

import { TestSettingsBuilder } from "./mocks/TestSettingsBuilder";

test("a", () => {
	const builder = new TestSettingsBuilder();
	builder.setTags("ddd");

	const testSettings = builder.build();

	expect(testSettings.tags).toBe("ddd");
	expect(testSettings.primaryHeading).toBe("Changed Notes");
});
