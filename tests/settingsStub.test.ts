import { beforeEach, describe, it, expect } from "bun:test";
import { TestSettingsBuilder } from "./stubs/TestSettingsBuilder";

let builder: TestSettingsBuilder;

beforeEach(() => {
	builder = new TestSettingsBuilder();
});

describe("settings object stub should work like actual settings", () => {
	it("should be mutable", () => {
		builder.setTags(["a", "f"]);

		const testSettings = builder.build();

		expect(testSettings.excludedTags).toBe("a,f");
	});

	it("should have default settings", () => {
		const testSettings = builder.build();
		expect(testSettings.writeInterval).toBe(0);
	});
});
