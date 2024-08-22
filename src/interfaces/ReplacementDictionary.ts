import { replaceStrFromIndexToIndex } from "../utils/replaceStrFromIndexToIndex";
import { File } from "./File";
import { FrontMatterCache } from "./FrontmatterCache";

export abstract class ReplacementDictionary {
	getOutputPostReplacement(
		format: string,
		file: File | null,
		frontmatter: FrontMatterCache | null,
		path: string,
	): string {
		// for deleted section, etc where no metadata is stored - TODO get rid of this
		const disableAllTemplatesExceptPath = !file;

		// matches all text in btwn [[ and ]]. EXCLUDES the brackets
		let templates = format.matchAll(/(?<=\[\[)[^\]]+(?=]])/gm);
		const preDefinedReplacements = this.replacements.map((r) => r.template);
		let output = format;

		// netCharOffset takes into account how many characters
		// the content has been offset due to fill expansion/shrinking of templates
		let netCharOffset = 0;
		for (const t of templates) {
			// assume current template is always at index 0 - ignores other results for same template
			const templateStr = t[0];
			const BRACKET_LENGTH = 2;
			const startIdx = t.index - BRACKET_LENGTH;
			const endIdx = t.index + templateStr.length + BRACKET_LENGTH - 1;

			// frontmatter-based templates
			if (templateStr.startsWith("f.")) {
				if (disableAllTemplatesExceptPath) {
					const replaced = replaceStrFromIndexToIndex(
						output,
						startIdx + netCharOffset,
						endIdx + netCharOffset,
						"",
					);
					output = replaced.string;
					netCharOffset += replaced.offset;

					continue;
				}

				if (!frontmatter) {
					frontmatter = {};
				}

				// string without f. at start

				const targetProperty = frontmatter[templateStr.substring(2)];

				// can't just use ! since booleans should work
				if (
					!frontmatter ||
					targetProperty === null ||
					targetProperty === undefined
				) {
					// if no frontmatter property for this specific file, just replace with ""
					const replaced = replaceStrFromIndexToIndex(
						output,
						startIdx + netCharOffset,
						endIdx + netCharOffset,
						"",
					);
					output = replaced.string;
					netCharOffset += replaced.offset;

					continue;
				}

				const targetPropertyValue = Array.isArray(targetProperty)
					? targetProperty.join(", ")
					: targetProperty.toString();

				const replaced = replaceStrFromIndexToIndex(
					output,
					startIdx + netCharOffset,
					endIdx + netCharOffset,
					targetPropertyValue,
				);
				output = replaced.string;
				netCharOffset += replaced.offset;

				continue;
			}

			// OLM templates
			const preDefinedReplacement = this.replacements.find(
				({ template }) => template === templateStr,
			);
			if (preDefinedReplacement) {
				if (disableAllTemplatesExceptPath) {
					const replaced = replaceStrFromIndexToIndex(
						output,
						startIdx + netCharOffset,
						endIdx + netCharOffset,
						["path", "link", "name"].includes(templateStr)
							? path
							: "",
					);
					output = replaced.string;
					netCharOffset += replaced.offset;

					continue;
				}

				const replaced = replaceStrFromIndexToIndex(
					output,
					startIdx + netCharOffset,
					endIdx + netCharOffset,
					preDefinedReplacement.replaceWith(file),
				);

				output = replaced.string;
				netCharOffset += replaced.offset;
			}
		}

		return output;
	}

	abstract replacements: Array<{
		template: string;
		replaceWith: (file: File) => string;
	}>;
}
