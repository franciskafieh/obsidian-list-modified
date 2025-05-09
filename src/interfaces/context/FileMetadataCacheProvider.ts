import { File } from "../File";

export interface FileMetadataCacheProvider {
	getAllTagsFromFile(file: File): string[];
	getFileFrontmatter(file: File): { [key: string]: unknown };
}
