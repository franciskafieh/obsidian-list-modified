import { serialize } from "monkey-around";
import { CachedMetadata, TFile } from "obsidian";

const onMetadataCacheChanged = serialize(
	async (file: TFile, _data: string, cache: CachedMetadata) => {
		console.log("working");
	}
);

export default onMetadataCacheChanged;

// e.g....
// write and reset if new day
// if file is log note return
