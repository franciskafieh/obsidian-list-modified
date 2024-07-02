import {
	getAllDailyNotes,
	getDailyNote,
	getWeeklyNote,
	getAllWeeklyNotes,
	getMonthlyNote,
	getAllMonthlyNotes,
	createDailyNote,
	createMonthlyNote,
	createWeeklyNote,
} from "obsidian-daily-notes-interface";
import { moment, TFile } from "obsidian";
import { getSettings } from "../settings/settings";

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

export function isLogNote(file: TFile): boolean {
	return file === getLogNote();
}
