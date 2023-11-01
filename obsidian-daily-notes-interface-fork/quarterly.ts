import type { Moment } from "moment";
import { normalizePath, Notice, TFile, TFolder, Vault } from "obsidian";

import { appHasQuarterlyNotesPluginLoaded } from "./index";
import { getDateFromFile, getDateUID } from "./parse";
import { getQuarterlyNoteSettings } from "./settings";
import { getNotePath, getTemplateInfo } from "./vault";

export class QuarterlyNotesFolderMissingError extends Error {}

/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
export async function createQuarterlyNote(date: Moment): Promise<TFile> {
  const { vault } = window.app;
  const { template, format, folder } = getQuarterlyNoteSettings();
  const [templateContents, IFoldInfo] = await getTemplateInfo(template);
  const filename = date.format(format);
  const normalizedPath = await getNotePath(folder, filename);

  try {
    const createdFile = await vault.create(
      normalizedPath,
      templateContents
        .replace(
          /{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi,
          (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
              hour: now.get("hour"),
              minute: now.get("minute"),
              second: now.get("second"),
            });
            if (calc) {
              currentDate.add(parseInt(timeDelta, 10), unit);
            }

            if (momentFormat) {
              return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
          }
        )
        .replace(/{{\s*date\s*}}/gi, filename)
        .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
        .replace(/{{\s*title\s*}}/gi, filename)
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.app as any).foldManager.save(createdFile, IFoldInfo);

    return createdFile;
  } catch (err) {
    console.error(`Failed to create file: '${normalizedPath}'`, err);
    new Notice("Unable to create new file.");
  }
}

export function getQuarterlyNote(
  date: Moment,
  quarterly: Record<string, TFile>
): TFile {
  return quarterly[getDateUID(date, "quarter")] ?? null;
}

export function getAllQuarterlyNotes(): Record<string, TFile> {
  const quarterly: Record<string, TFile> = {};

  if (!appHasQuarterlyNotesPluginLoaded()) {
    return quarterly;
  }
  const { vault } = window.app;
  const { folder } = getQuarterlyNoteSettings();

  const quarterlyFolder = vault.getAbstractFileByPath(
    normalizePath(folder)
  ) as TFolder;

  if (!quarterlyFolder) {
    throw new QuarterlyNotesFolderMissingError(
      "Failed to find quarterly notes folder"
    );
  }

  Vault.recurseChildren(quarterlyFolder, (note) => {
    if (note instanceof TFile) {
      const date = getDateFromFile(note, "quarter");
      if (date) {
        const dateString = getDateUID(date, "quarter");
        quarterly[dateString] = note;
      }
    }
  });

  return quarterly;
}
