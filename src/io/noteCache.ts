import { getSettings } from "./settings";
import {
	createDailyNote,
	createMonthlyNote,
	createWeeklyNote,
	getAllDailyNotes,
	getAllMonthlyNotes,
	getAllWeeklyNotes,
	getDailyNote,
	getMonthlyNote,
	getWeeklyNote,
} from "obsidian-daily-notes-interface";
import { moment, TFile } from "obsidian";

export function getLogNote(): TFile {
	const settings = getSettings();

	switch (settings.logNoteType) {
		case "daily":
			return getDailyNote(moment(), getAllDailyNotes());
		case "weekly":
			return getWeeklyNote(moment(), getAllWeeklyNotes());
		case "monthly":
			return getMonthlyNote(moment(), getAllMonthlyNotes());
	}
}

export async function createLogNote() {
	const settings = getSettings();

	switch (settings.logNoteType) {
		case "daily":
			return await createDailyNote(moment());
		case "weekly":
			return await createWeeklyNote(moment());
		case "monthly":
			return await createMonthlyNote(moment());
	}
}
