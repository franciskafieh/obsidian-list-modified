import { TFile } from "obsidian";
import {
	getAllDailyNotes,
	getAllMonthlyNotes,
	getAllWeeklyNotes,
} from "obsidian-daily-notes-interface";

let dailyNoteCache: Record<string, TFile>;
let weeklyNoteCache: Record<string, TFile>;
let monthlyNoteCache: Record<string, TFile>;

export function refreshNoteCache(cache: "daily" | "weekly" | "monthly") {
	switch (cache) {
		case "daily":
			dailyNoteCache = getAllDailyNotes();
			break;
		case "weekly":
			weeklyNoteCache = getAllWeeklyNotes();
			break;
		case "monthly":
			monthlyNoteCache = getAllMonthlyNotes();
			break;
	}
}

export function getNoteCache(cache: "daily" | "weekly" | "monthly") {
	switch (cache) {
		case "daily":
			return dailyNoteCache ?? getAllDailyNotes();
		case "weekly":
			return weeklyNoteCache ?? getAllWeeklyNotes();
		case "monthly":
			return monthlyNoteCache ?? getAllMonthlyNotes();
	}
}

export function invalidateCaches() {
	dailyNoteCache = null;
	weeklyNoteCache = null;
	monthlyNoteCache = null;
}
