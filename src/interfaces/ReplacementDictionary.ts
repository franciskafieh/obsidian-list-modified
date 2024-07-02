import { File } from "./File";

export interface ReplacementDictionary {
	getOutputPostReplacement(format: string, file: File): string;
	replacements: Array<{
		template: string;
		replaceWith: (file: File) => string;
	}>;
}
