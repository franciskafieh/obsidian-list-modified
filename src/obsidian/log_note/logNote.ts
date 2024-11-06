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
import { consoleWarnIfVerboseMode } from "../../utils/alerter";

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

export function getLastLogNote() {
	const settings = getSettings();

	switch (settings.logNoteType) {
		case "daily":
			return getDailyNote(
				moment(settings.lastTrackedDate),
				getAllDailyNotes()
			);
		case "weekly":
			return getWeeklyNote(
				moment(settings.lastTrackedDate),
				getAllWeeklyNotes()
			);
		case "monthly":
			return getMonthlyNote(
				moment(settings.lastTrackedDate),
				getAllMonthlyNotes()
			);
	}
}

export async function createLogNote() {
	const settings = getSettings();

	consoleWarnIfVerboseMode("creating log note", settings.verboseModeEnabled);

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
