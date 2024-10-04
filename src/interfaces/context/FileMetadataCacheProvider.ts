import { File } from "../File";
// todo bun test errors because getfill and getnotecontent currently use a function which calls app.metadataCache. instead have a filecache provider or sum and make an obsidian impl and a test impl

export interface FileMetadataCacheProvider {
	getAllTagsFromFile(file: File): string[];
	getFileFrontmatter(file: File): { [key: string]: any };
}
