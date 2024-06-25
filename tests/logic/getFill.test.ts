// import { describe, it, expect } from "bun:test";
// import { getFill } from "../../src/logic/getFill";
// import { ListType } from "../../src/types";

// describe("target fill should be correct", () => {
// 	it("should return empty arrays if no data provided", () => {
// 		expect(getFill([], false)).toEqual({
// 			created: [],
// 			modified: [],
// 			deleted: [],
// 		});
// 	});

// 	// test combined bool flag

// 	it("should check if criteria is matched", () => {
// 		const stub = [
// 			{
// 				path: "a",
// 				supposedList: "created" as ListType, // TODO - why does this need explicit type cast
// 				matchesCriteria: false,
// 			},
// 			{
// 				path: "b",
// 				supposedList: "created" as ListType,
// 				matchesCriteria: true,
// 			},
// 		];

// 		expect(getFill(stub, false).created).toEqual(["b"]);
// 	});

// 	it("should sort into correct lists", () => {
// 		const stub = [
// 			{
// 				path: "a",
// 				supposedList: "created" as ListType,
// 				matchesCriteria: true,
// 			},
// 			{
// 				path: "b",
// 				supposedList: "modified" as ListType,
// 				matchesCriteria: true,
// 			},
// 			{
// 				path: "c",
// 				supposedList: "deleted" as ListType,
// 				matchesCriteria: true,
// 			},
// 			{
// 				path: "d",
// 				supposedList: "deleted" as ListType,
// 				matchesCriteria: true,
// 			},
// 		];

// 		expect(getFill(stub, false)).toEqual({
// 			created: ["a"],
// 			modified: ["b"],
// 			deleted: ["c", "d"],
// 		});
// 	});

// 	it("should combine created and modified if boolean flag is true", () => {
// 		const stub = [
// 			{
// 				path: "a",
// 				supposedList: "created" as ListType,
// 				matchesCriteria: true,
// 			},
// 			{
// 				path: "b",
// 				supposedList: "modified" as ListType,
// 				matchesCriteria: true,
// 			},
// 		];

// 		expect(getFill(stub, true)).toEqual({
// 			created: [],
// 			modified: ["a", "b"],
// 			deleted: [],
// 		});
// 	});
// });
