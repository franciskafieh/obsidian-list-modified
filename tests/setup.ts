import { mock } from "bun:test";
import Moment from "moment";

// obsidian moment fake
mock.module("obsidian", () => ({
	moment: Moment,
}));
