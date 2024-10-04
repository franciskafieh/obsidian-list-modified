import { File } from "../../../src/interfaces/File";
import { FileMetadataCacheProvider } from "../../../src/interfaces/context/FileMetadataCacheProvider";

export class TestFileMetadataCacheProvider
	implements FileMetadataCacheProvider
{
	tags: string[] = [];
	frontmatter: { [key: string]: any } = {};

	constructor(tags?: string[], frontmatter?: { [key: string]: any }) {
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
	getFileFrontmatter(file: File): { [key: string]: any } {
		return this.frontmatter;
	}
}
