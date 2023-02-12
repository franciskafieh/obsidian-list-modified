import { TFile, moment } from "obsidian";
import {
	getAllDailyNotes,
	getAllMonthlyNotes,
	getAllWeeklyNotes,
	getDailyNote,
	getMonthlyNote,
	getWeeklyNote,
} from "obsidian-daily-notes-interface";
import { getSettings } from "./settings";
import { PeriodicNoteType } from "../types";

let dailyNoteCache: Record<string, TFile>;
let weeklyNoteCache: Record<string, TFile>;
let monthlyNoteCache: Record<string, TFile>;

export function getLogNote(): TFile | null {
	const settings = getSettings();

	switch (settings.logNoteType) {
		case "daily":
			return getDailyNote(moment(), getNoteCache("daily"));
		case "weekly":
			return getWeeklyNote(moment(), getNoteCache("weekly"));
		case "monthly":
			return getMonthlyNote(moment(), getNoteCache("monthly"));
	}
}

export function getNoteCache(type: PeriodicNoteType) {
	switch (type) {
		case "daily":
			if (!dailyNoteCache) {
				dailyNoteCache = getAllDailyNotes();
			}
			return dailyNoteCache;
		case "weekly":
			if (!weeklyNoteCache) {
				weeklyNoteCache = getAllWeeklyNotes();
			}
			return weeklyNoteCache;
		case "monthly":
			if (!monthlyNoteCache) {
				monthlyNoteCache = getAllMonthlyNotes();
			}
			return monthlyNoteCache;
	}
}

export function refreshNoteCache(type: PeriodicNoteType) {
	switch (type) {
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
