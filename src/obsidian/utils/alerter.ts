import { Notice } from "obsidian";

export function displayNotice(message: string) {
	const notice = new Notice("", 10000);
	// @ts-ignore
	notice.noticeEl.innerHTML = `<b>[Obsidian List Modified]</b><br/>${message}`;
}

export function consoleWarn(message: string) {
	console.warn("[Obsidian List Modified] " + message);
}

export function consoleLog(message: string) {
	console.log("[Obsidian List Modified] " + message);
}
