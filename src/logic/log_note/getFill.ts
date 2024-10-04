import { Context } from "../../interfaces/context/Context";

export function getFill(context: Context) {
	const settings = context.settings;
	const replacementDictionary = context.replacementDictionary;
	const fileConverter = context.fileConverter;
	const vault = context.vault;
	const fileMetadataCacheProvider = context.fileMetadataCacheProvider;

	const created = [];
	const modified = [];
	const deleted = [];
	const trackedFiles = settings.trackedFiles;
	for (const trackedFile of trackedFiles) {
		if (!trackedFile.matchesCriteria || !trackedFile.path) {
			continue;
		}
		const file = fileConverter.fromPath(trackedFile.path, vault);
		let outputFormatToUse = settings.outputFormat;
		if (settings.separateOutputFormats) {
			switch (trackedFile.supposedList) {
				case "created":
					outputFormatToUse = settings.createdFormat;
					break;
				case "modified":
					outputFormatToUse = settings.modifiedFormat;
					break;
				case "deleted":
					outputFormatToUse = settings.deletedFormat;
					break;
			}
		}
		const formattedOutput = replacementDictionary.getOutputPostReplacement(
			outputFormatToUse,
			file,
			fileMetadataCacheProvider,
			trackedFile.path
		);
		if (trackedFile.supposedList === "created") {
			if (settings.combineCreatedAndModified) {
				modified.push(formattedOutput);
			} else {
				created.push(formattedOutput);
			}
		} else if (trackedFile.supposedList === "modified") {
			modified.push(formattedOutput);
		} else if (trackedFile.supposedList === "deleted") {
			deleted.push(formattedOutput);
		}
	}
	return { created, modified, deleted };
}
