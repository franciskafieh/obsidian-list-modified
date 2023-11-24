import { getSettings } from "./settings";
import {
	consoleWarn,
	displayNotice,
	getFormattedHeading,
	getFormattedOutput,
} from "../utils/formatter";
import { TFile } from "obsidian";
import useWarnedState from "./useWarnedState";
import { serialize } from "monkey-around";
import { createLogNote, getLogNote } from "./noteCache";
import { HeadingCache } from "obsidian";

export const writeListsToLogFile = serialize(async () => {
	const settings = getSettings();

	if (settings.verboseModeEnabled) {
		console.log("--- Writing tracked files ---");
	}

	const logNote = await setupLogNote();
	if (!logNote) return;

	const fileCache = app.metadataCache.getFileCache(logNote);

	// file has probably just been created
	if (fileCache === null) {
		if (settings.verboseModeEnabled) {
			consoleWarn("File cache is null... ending write process");
		}
		return;
	}

	const headings = fileCache.headings;

	if (!headings) {
		if (settings.verboseModeEnabled) {
			consoleWarn("Headings not found. Creating and appending notes...");
		}
		await createHeadingAndAppendContentIfApplicable(logNote);
		return;
	}

	const primaryHeadingIndex = headings.findIndex(
		({ heading }) => heading === settings.primaryHeading
	);

	if (primaryHeadingIndex === -1) {
		await createHeadingAndAppendContentIfApplicable(logNote);

		if (settings.verboseModeEnabled) {
			consoleWarn("Headings not found. Creating and appending notes...");
		}
		return;
	}

	for (const heading of headings) {
		console.log(heading.heading + " : " + heading.level);
	}

	const followingHeadingIndex = headings.findIndex(
		(heading, index) =>
			index > primaryHeadingIndex &&
			(heading.level === 2 || heading.level === 1)
	);
	try {
		await app.vault.process(logNote, (data) => {
			const content = data.split("\n");

			const startPos =
				headings[primaryHeadingIndex].position.end.line + 1;

			if (headings[followingHeadingIndex]) {
				const endPos =
					headings[followingHeadingIndex].position.start.line;
				content.splice(
					startPos,
					endPos - startPos,
					getFinalContentBlock()
				);
			} else {
				const endPos: number = content.length;
				content.splice(
					startPos,
					endPos - startPos,
					getFinalContentBlock()
				);
			}

			return content.join("\n");
		});
	} catch (error) {
		displayNotice(
			"Please update Obsidian to its latest version. If this does not work, see console for details."
		);
		console.error(error);
	}
});

async function setupLogNote() {
	const settings = getSettings();

	if (getLogNote()) {
		if (settings.verboseModeEnabled) {
			consoleWarn("Log note found at: " + getLogNote().path);
		}
		return getLogNote();
	}

	if (settings.autoCreateLogNote) {
		if (settings.verboseModeEnabled) {
			consoleWarn(
				"Log note not found, but should be created automatically. Creating now..."
			);
		}
		return await createLogNote();
	}

	consoleWarn("Log note not found");
	const userHasBeenWarnedFor = useWarnedState();

	if (!userHasBeenWarnedFor.fileNotExisting) {
		displayNotice(
			"Your log file does not exist. Please check your settings."
		);
		userHasBeenWarnedFor.fileNotExisting = true;
	}
	return null;
}

async function createHeadingAndAppendContentIfApplicable(logNote: TFile) {
	const settings = getSettings();
	const userHasBeenWarnedFor = useWarnedState();

	if (settings.verboseModeEnabled) {
		consoleWarn("Trying to creatr heading and append...");
	}

	if (settings.autoCreatePrimaryHeading) {
		try {
			await app.vault.process(
				logNote,
				(data) =>
					data +
					"\n" +
					getFormattedHeading("## " + settings.primaryHeading) +
					getFinalContentBlock()
			);
		} catch (error) {
			displayNotice(
				"Please update Obsidian to its latest version. If this does not work, see console for details."
			);
			console.error(error);
		}
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

	let finalContentBlock = settings.appendSpaceAfterHeadings ? "\n" : "";

	if (settings.separateCreated && createdList.length != 0) {
		finalContentBlock +=
			getFormattedHeading("### " + settings.createdHeading) +
			createdList.join("\n") +
			"\n\n";
	}

	if (modifiedList.length != 0) {
		if (settings.separateDeleted || settings.separateCreated) {
			finalContentBlock += getFormattedHeading(
				"### " + settings.modifiedHeading
			);
		}

		finalContentBlock += modifiedList.join("\n") + "\n\n";
	}

	if (settings.separateDeleted && deletedList.length != 0) {
		finalContentBlock +=
			getFormattedHeading("### " + settings.deletedHeading) +
			deletedList.join("\n") +
			"\n";
	}

	return finalContentBlock;
}
