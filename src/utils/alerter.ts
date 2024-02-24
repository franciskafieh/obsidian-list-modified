import { Notice } from "obsidian";

export function displayNoticeAndWarn(message: string) {
	const notice = new Notice("", 10000);
	// @ts-ignore
	notice.noticeEl.innerHTML = `<b>[Obsidian List Modified]</b><br/>${message}`;

	consoleWarn(message);
}

export function consoleWarnIfVerboseMode(message: string) {
	// if verbose mode ** TODO
	consoleWarn(message);
}

export function consoleWarn(message: string) {
	console.warn("[Obsidian List Modified] " + message);
}

export function warnUserOnce(key: Keys, message: string) {
	if (!userWarned[key]) {
		displayNoticeAndWarn(message);
		userWarned[key] = true;
	}
}

type Keys = "headingsNotExisting" | "fileNotExisting";
const userWarned: {
	[K in Keys]?: boolean;
} = {};
