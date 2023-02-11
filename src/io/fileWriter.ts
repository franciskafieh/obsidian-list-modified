import { getSettings } from "./settings";
import {
	consoleWarn,
	displayNotice,
	getFormattedHeading,
	getFormattedOutput,
} from "../utils/formatter";
import { TFile, moment } from "obsidian";
import {
	getDailyNote,
	getMonthlyNote,
	getWeeklyNote,
} from "obsidian-daily-notes-interface";
import useWarnedState from "./useWarnedState";
import { getNoteCache } from "./noteCache";

export async function writeListsToLogFile() {
	const settings = getSettings();

	const logNote: TFile = await createAndGetLogNote();

	const userHasBeenWarnedFor = useWarnedState();

	if (!logNote) {
		consoleWarn("Log note not found");

		if (!userHasBeenWarnedFor.fileNotExisting) {
			displayNotice(
				"Your log file does not exist. Please check your settings."
			);
			userHasBeenWarnedFor.fileNotExisting = true;
		}
		return;
	}

	const headings = app.metadataCache.getCache(logNote.path).headings;

	if (!headings) {
		await createHeadingAndAppendContentIfApplicable(logNote);
		return;
	}

	const primaryHeadingIndex = headings.findIndex(
		({ heading }) => heading === settings.primaryHeading
	);

	if (primaryHeadingIndex === -1) {
		await createHeadingAndAppendContentIfApplicable(logNote);
		return;
	}

	const followingHeadingIndex = headings.findIndex(
		(heading, index) => index > primaryHeadingIndex && heading.level === 1
	);

	// we've established that the primary heading exists

	const content: string[] = (await this.app.vault.read(logNote)).split("\n");

	const startPos = headings[primaryHeadingIndex].position.end.line + 1;

	if (headings[followingHeadingIndex]) {
		const endPos = headings[followingHeadingIndex].position.start.line - 1;
		content.splice(startPos, endPos - startPos, getFinalContentBlock());
	} else {
		const endPos: number = content.length;
		content.splice(startPos, endPos - startPos, getFinalContentBlock());
	}

	await this.app.vault.modify(logNote, content.join("\n"));
}

async function createAndGetLogNote() {
	switch (getSettings().logNoteType) {
		case "daily":
			return getDailyNote(moment(), getNoteCache("daily"));
		case "weekly":
			return getWeeklyNote(moment(), getNoteCache("weekly"));
		case "monthly":
			return getMonthlyNote(moment(), getNoteCache("monthly"));
		default:
			return null;
	}
}

async function createHeadingAndAppendContentIfApplicable(logNote: TFile) {
	const settings = getSettings();
	const userHasBeenWarnedFor = useWarnedState();

	if (settings.autoCreatePrimaryHeading) {
		await app.vault.append(
			logNote,
			"\n" +
				getFormattedHeading("# " + settings.primaryHeading) +
				getFinalContentBlock()
		);
	} else {
		consoleWarn("Primary heading not found");
		if (!userHasBeenWarnedFor.headingsNotExisting) {
			displayNotice(
				"Your primary heading could not be found in your log note. Please check your settings."
			);
			userHasBeenWarnedFor.headingsNotExisting = true;
		}
	}
	return;
}

function getFinalContentBlock() {
	const settings = getSettings();

	const createdList: string[] = [];
	const modifiedList: string[] = [];
	const deletedList: string[] = [];

	for (const file of settings.trackedFiles) {
		if (!file.matchesCriteria) {
			continue;
		}

		switch (file.supposedList) {
			case "created":
				if (settings.separateCreated) {
					createdList.push(getFormattedOutput(file.path));
				} else {
					modifiedList.push(getFormattedOutput(file.path));
				}
				break;
			case "modified":
				modifiedList.push(getFormattedOutput(file.path));
				break;
			case "deleted":
				if (settings.separateDeleted) {
					deletedList.push(getFormattedOutput(file.path));
				}
				break;
		}
	}

	let finalContentBlock = "";

	if (settings.separateCreated) {
		finalContentBlock +=
			getFormattedHeading("## " + settings.createdHeading) +
			createdList.join("\n") +
			"\n";
	}

	finalContentBlock +=
		getFormattedHeading("## " + settings.modifiedHeading) +
		modifiedList.join("\n") +
		"\n";

	if (settings.separateDeleted) {
		finalContentBlock +=
			getFormattedHeading("## " + settings.deletedHeading) +
			deletedList.join("\n") +
			"\n";
	}

	return finalContentBlock;
}

// 	updateTrackedFiles = serialize(async (doWrite?: boolean) => {
// 		await this.saveSettings();

// 		let dailyNote: TFile;

// 		try {
// 			dailyNote = getDailyNote(moment(), getAllDailyNotes());
// 		} catch (e) {
// 			new Notice("Unable to load daily note. See console for details.");
// 			console.error(e.message);
// 		}

// 		if (!dailyNote) {
// 			if (this.settings.automaticallyCreateDailyNote) {
// 				this.displayNotice(
// 					"Creating daily note since it did not exist..."
// 				);
// 				dailyNote = await createDailyNote(moment());
// 			}

// 			await saveSettingsAndWriteTrackedFiles();
// 		}

// 		const cache: CachedMetadata =
// 			this.app.metadataCache.getFileCache(dailyNote);

// 		let currentHeadings: HeadingCache[] = cache?.headings;

// 		// auto-create heading
// 		if (!currentHeadings || !this.settings.heading) {
// 			this.displayNotice(
// 				"Cannot find the designated heading in your file. Creating a default one for now..."
// 			);

// 			// mock heading for first run to avoid error
// 			currentHeadings = [
// 				{ heading: this.settings.heading, level: 1 } as HeadingCache,
// 			];

// 			await this.app.vault.append(
// 				dailyNote,
// 				"\n" +
// 					"# " +
// 					this.settings.heading +
// 					"\n" +
// 					this.settings.trackedFiles
// 						.map((path) => this.getFormattedOutput(path))
// 						.join("\n")
// 			);

// 			await this.saveSettings();
// 			return;
// 		}

// 		// if user set delay, do not write to file after initial run
// 		if (this.writeIntervalInMs && !doWrite) {
// 			return;
// 		}

// 	});
