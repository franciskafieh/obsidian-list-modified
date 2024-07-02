import { File } from "../../src/interfaces/File";
import { ReplacementDictionary } from "../../src/interfaces/ReplacementDictionary";

export class TestReplacementDictionary implements ReplacementDictionary {
	getOutputPostReplacement(format: string, file: File): string {
		return "";
	}

	replacements = [];
}

// export class ObsidianReplacementDictionary implements IReplacementDictionary {
// 	getOutputPostReplacement(format: string, file: IFile): string {
// 		let out: string = "";
// 		for (const replacement of this.replacements) {
// 			out = format.replace(
// 				new RegExp(`[[${replacement.template}]]`, "g"),
// 				replacement.replaceWith(file),
// 			);
// 		}

// 		return out;
// 	}

// 	replacements = [
// 		{ template: "path", replaceWith: (file: IFile) => file.path },
// 	];
// }
