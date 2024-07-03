import { File } from "./File";

export abstract class ReplacementDictionary {
	getOutputPostReplacement(
		format: string,
		file: File | null,
		path: string,
	): string {
		// for deleted section, etc where no metadata is stored
		if (!file) {
			return "- " + path;
		}

		let output = format;
		for (const replacement of this.replacements) {
			const { template, replaceWith } = replacement;
			const regex = new RegExp(`\\[\\[${template}\\]\\]`, "g");
			output = output.replace(regex, replaceWith(file));
		}
		return output;
	}
	abstract replacements: Array<{
		template: string;
		replaceWith: (file: File) => string;
	}>;
}
