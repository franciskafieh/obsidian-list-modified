import { FileMetadataCacheProvider } from "../../../interfaces/context/FileMetadataCacheProvider";
import { File } from "../../../interfaces/File";
import { getPlugin } from "../../settings/settings";
import { getAllTags, TFile } from "obsidian";

export class ObsidianFileMetadataCacheProvider
	implements FileMetadataCacheProvider
{
	getAllTagsFromFile(file: File): string[] {
		const metadataCache = getPlugin().app.metadataCache;
		if (file && metadataCache.getFileCache(file as TFile)) {
			return (
				getAllTags(metadataCache.getFileCache(file as TFile) || {}) ||
				[]
			);
		}

		return [];
	}

	getFileFrontmatter(file: File): { [key: string]: any } {
		const metadataCache = getPlugin().app.metadataCache;
		if (file && metadataCache.getFileCache(file as TFile)) {
			const fileCache = metadataCache.getFileCache(file as TFile);
			return fileCache ? fileCache.frontmatter || {} : {};
		}

		return {};
	}
}
