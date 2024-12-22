import { File } from "../../../src/interfaces/File";
import { FileMetadataCacheProvider } from "../../../src/interfaces/context/FileMetadataCacheProvider";

export class TestFileMetadataCacheProvider
	implements FileMetadataCacheProvider
{
	tags: string[] = [];
	frontmatter: { [key: string]: unknown } = {};

	constructor(tags?: string[], frontmatter?: { [key: string]: unknown }) {
		if (tags) {
			this.tags = tags;
		}

		if (frontmatter) {
			this.frontmatter = frontmatter;
		}
	}

	getAllTagsFromFile(file: File): string[] {
		return this.tags;
	}
	getFileFrontmatter(file: File): { [key: string]: unknown } {
		return this.frontmatter;
	}
}
