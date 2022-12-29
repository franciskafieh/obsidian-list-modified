import { ListModifiedSettings } from "./types";

export const DEFAULT_SETTINGS: ListModifiedSettings = {
  outputFormat: "- [[link]]",
  tags: "",
  excludedFolders: "",
  automaticallyCreateDailyNote: true,
  heading: "Modified Today",
  writeInterval: 30,
  ignoredNameContains: "",
  lastTrackedDate: "",
  trackedFiles: [],
};
