import { Context } from "../../interfaces/context/Context";
import { sortList } from "./sortList";
import { OutputFile } from "../../types";

export function getFill(context: Context) {
	const settings = context.settings;
	const replacementDictionary = context.replacementDictionary;
	const fileConverter = context.fileConverter;
	const vault = context.vault;
	const fileMetadataCacheProvider = context.fileMetadataCacheProvider;

	const created: OutputFile[] = [];
	const modified: OutputFile[] = [];
	const deleted: OutputFile[] = [];

	const trackedFiles = settings.trackedFiles;

	// collect files into appropriate lists
	for (const trackedFile of trackedFiles) {
		if (!trackedFile.matchesCriteria || !trackedFile.path) {
			continue;
		}

		const file = fileConverter.fromPath(trackedFile.path, vault);

		if (trackedFile.supposedList === "created") {
			if (settings.combineCreatedAndModified) {
				modified.push({
					file: file,
					path: trackedFile.path,
				});
			} else {
				created.push({
					file: file,
					path: trackedFile.path,
				});
			}
		} else if (trackedFile.supposedList === "modified") {
			modified.push({
				file: file,
				path: trackedFile.path,
			});
		} else if (trackedFile.supposedList === "deleted") {
			deleted.push({
				file: file,
				path: trackedFile.path,
			});
		}
	}

	// Sort the file lists based on settings
	const sortedCreated = sortList(created, settings.sortCreated);

	const sortedModified = sortList(modified, settings.sortModified);

	const sortedDeleted = sortList(deleted, settings.sortDeleted);

	// format
	const formattedCreated = sortedCreated.map((file) => {
		const outputFormatToUse = settings.separateOutputFormats
			? settings.createdFormat
			: settings.outputFormat;
		return replacementDictionary.getOutputPostReplacement(
			outputFormatToUse,
			file.file,
			fileMetadataCacheProvider,
			file.path
		);
	});

	const formattedModified = sortedModified.map((file) => {
		const outputFormatToUse = settings.separateOutputFormats
			? settings.modifiedFormat
			: settings.outputFormat;
		return replacementDictionary.getOutputPostReplacement(
			outputFormatToUse,
			file.file,
			fileMetadataCacheProvider,
			file.path
		);
	});

	const formattedDeleted = sortedDeleted.map((file) => {
		const outputFormatToUse = settings.separateOutputFormats
			? settings.deletedFormat
			: settings.outputFormat;
		return replacementDictionary.getOutputPostReplacement(
			outputFormatToUse,
			file.file,
			fileMetadataCacheProvider,
			file.path
		);
	});

	return {
		created: formattedCreated,
		modified: formattedModified,
		deleted: formattedDeleted,
	};
}
