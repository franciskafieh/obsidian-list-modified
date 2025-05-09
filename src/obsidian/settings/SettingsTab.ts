import { PluginSettingTab, Setting } from "obsidian";
import {
	getSettings,
	saveSettings,
	saveSettingsAndWriteToLogNote,
} from "./settings";
import { LogNoteType, SortOption } from "../../types";
import { convertCommaListToArray } from "../../utils/converCommaListToArray";
import { getLogNote } from "../log_note/logNote";
import { getContentWithoutCreatedSection } from "../../logic/log_note/getContentWithoutCreatedSection";
import { ConfirmModal } from "../modal/ConfirmModal";
import { displayNoticeAndWarn } from "../../utils/alerter";

export class SettingsTab extends PluginSettingTab {
	display(): void {
		const settings = getSettings();
		const { containerEl } = this;

		containerEl.empty();

		// TOP HEADER
		const topHeader = containerEl.createDiv("top-header");
		topHeader.append(
			"Please read ",
			containerEl.createEl("a", {
				href: "https://github.com/franciskafieh/obsidian-list-modified/wiki",
				text: "the wiki",
			}),
			" for configuration and setup help. The plugin ",
			containerEl.createEl("b", { text: "will not work" }),
			" unless configured properly!"
		);

		// LOG NOTE
		new Setting(containerEl).setName("Log note").setHeading();

		new Setting(containerEl)
			.setName("Auto create log note")
			.setDesc(
				"If this setting is turned off, your modified files will not " +
					"be linked unless you create a log note yourself."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(settings.autoCreateLogNote)
					.onChange(async (value) => {
						settings.autoCreateLogNote = value;
						saveSettingsAndWriteToLogNote();
					});
			});

		new Setting(containerEl)
			.setName("Log note type")
			.setDesc(
				"The 'Weekly' and 'Monthly' options REQUIRE you to have the Periodic Notes plugin."
			)
			.addDropdown((dropdown) => {
				dropdown
					.addOption("daily", "Daily")
					.addOption("weekly", "Weekly (Requires Periodic Notes)")
					.addOption("monthly", "Monthly (Requires Periodic Notes)")
					.setValue(settings.logNoteType)
					.onChange(async (value: string) => {
						settings.logNoteType = value as LogNoteType;
						saveSettingsAndWriteToLogNote();
					});
			});

		new Setting(containerEl)
			.setName("Write interval")
			.setDesc(
				"The interval (in seconds) at which to write your modified files to your daily note. " +
					"Set to 0 to disable the interval and write to your file directly after every change. " +
					"This is recommended especially if you do not use a sync solution. " +
					"Please restart Obsidian after changing this value."
			)
			.addText((text) =>
				text
					.setPlaceholder("0 (RECOMMENDED)")
					.setValue(String(settings.writeInterval))
					.onChange(async (value) => {
						settings.writeInterval = parseInt(value);
						await saveSettings();
					})
			);

		// CRITERIA
		new Setting(containerEl).setName("Criteria").setHeading();

		new Setting(containerEl)
			.setName("Excluded tags")
			.setDesc("Files with these tags will not be tracked.")
			.addText((text) =>
				text
					.setPlaceholder("tag1, tag2, tag3")
					.setValue(settings.excludedTags.join(", "))
					.onChange(async (value) => {
						settings.excludedTags = convertCommaListToArray(value);
						saveSettingsAndWriteToLogNote();
					})
			);

		new Setting(containerEl)
			.setName("Excluded folders")
			.setDesc(
				"Files in these folders will not be tracked. This is case-sensitive."
			)
			.addText((text) =>
				text
					.setPlaceholder("folder1, folder2, folder3")
					.setValue(settings.excludedFolders.join(", "))
					.onChange(async (value) => {
						settings.excludedFolders =
							convertCommaListToArray(value);
						saveSettingsAndWriteToLogNote();
					})
			);

		new Setting(containerEl)
			.setName("Excluded names")
			.setDesc(
				"Files with names containing these strings will not be tracked. This is case-sensitive."
			)
			.addText((text) =>
				text
					.setPlaceholder("string1, string2, string3")
					.setValue(settings.excludedNameContains.join(", "))
					.onChange(async (value) => {
						settings.excludedNameContains =
							convertCommaListToArray(value);
						saveSettingsAndWriteToLogNote();
					})
			);

		new Setting(containerEl)
			.setName("Excluded extensions")
			.setDesc(
				"Files with these extensions will not be tracked. " +
					"Please exclude the period. This is mostly useful for " +
					"deleted files that are not notes, for example temporary/sync files."
			)
			.addText((text) =>
				text
					.setPlaceholder("e.g. png, pdf, jpeg")
					.setValue(settings.excludedExtensions.join(", "))
					.onChange(async (value) => {
						settings.excludedExtensions =
							convertCommaListToArray(value);
						saveSettingsAndWriteToLogNote();
					})
			);

		// OUTPUT FORMAT
		new Setting(containerEl).setName("Output formatting").setHeading();

		const outputFormatDesc = document.createDocumentFragment();

		outputFormatDesc.append(
			"Format of the links in the log note. Use ",
			outputFormatDesc.createEl("a", {
				href: "",
				text: "[[link]]",
			}),
			" to insert the link to the file. For a full list of placeholders, please see ",
			outputFormatDesc.createEl("a", {
				href: "https://github.com/franciskafieh/obsidian-list-modified/wiki/Output-Format",
				text: "the wiki.",
			})
		);

		const outputFormatSetting = new Setting(containerEl)
			.setName("Output format")
			.setDesc(outputFormatDesc)
			.addText((text) =>
				text
					.setPlaceholder("- [[link]]")
					.setValue(settings.outputFormat)
					.onChange(async (value) => {
						settings.outputFormat = value;
						saveSettingsAndWriteToLogNote();
					})
			);

		outputFormatSetting.setDisabled(settings.separateOutputFormats);
		outputFormatSetting.settingEl.style.opacity =
			settings.separateOutputFormats ? "0.5" : "1"; // fade out and disable if separate output formats

		new Setting(containerEl)
			.setName("Separate output formats")
			.setDesc(
				"If turned on, you may use different output formats for created/deleted/modified."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(settings.separateOutputFormats)
					.onChange(async (value) => {
						settings.separateOutputFormats = value;

						outputFormatSetting.setDisabled(value);
						outputFormatSetting.settingEl.style.opacity = value
							? "0.5"
							: "1";
						separateOutputFormats.style.display = value
							? "block"
							: "none";
						saveSettingsAndWriteToLogNote();
					});
			});

		const separateOutputFormats = containerEl.createDiv();
		separateOutputFormats.style.display = settings.separateOutputFormats
			? "block"
			: "none";
		separateOutputFormats.style.marginLeft = "20px";

		new Setting(separateOutputFormats)
			.setName("↳ Created output format")
			.setDesc("Output format for created files.")
			.addText((text) =>
				text
					.setPlaceholder("- [[link]]")
					.setValue(settings.createdFormat)
					.onChange(async (value) => {
						settings.createdFormat = value;
						saveSettingsAndWriteToLogNote();
					})
			);

		new Setting(separateOutputFormats)
			.setName("↳ Modified output format")
			.setDesc("Output format for modified files.")
			.addText((text) =>
				text
					.setPlaceholder("- [[link]]")
					.setValue(settings.modifiedFormat)
					.onChange(async (value) => {
						settings.modifiedFormat = value;
						saveSettingsAndWriteToLogNote();
					})
			);

		new Setting(separateOutputFormats)
			.setName("↳ Deleted output format")
			.setDesc(
				"Output format for deleted files. You cannot use most templates here. Please see the above wiki for info."
			)
			.addText((text) =>
				text
					.setPlaceholder("- [[path]]")
					.setValue(settings.deletedFormat)
					.onChange(async (value) => {
						settings.deletedFormat = value;
						saveSettingsAndWriteToLogNote();
					})
			);

		new Setting(containerEl)
			.setName("Time format")
			.setDesc(
				"Time format for use with the above time-related placeholders. "
			)
			.addText((text) =>
				text
					.setPlaceholder("YYYY-MM-DD")
					.setValue(settings.timeFormat)
					.onChange(async (value) => {
						settings.timeFormat = value;
						saveSettingsAndWriteToLogNote();
					})
			);

		// DIVIDERS
		new Setting(containerEl).setName("Dividers").setHeading();

		new Setting(containerEl)
			.setName("Combine created and modified")
			.setDesc(
				"Combine the 'created' and 'modified' dividers into one. This will disable the " +
					"created divider and use the modified divider for both."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(settings.combineCreatedAndModified)
					.onChange(async (value) => {
						settings.combineCreatedAndModified = value;

						// if set to true get rid of created section
						if (value && getLogNote()) {
							await this.app.vault.process(getLogNote(), (data) =>
								getContentWithoutCreatedSection(data)
							);
						}

						saveSettingsAndWriteToLogNote();
					});
			});

		new Setting(containerEl)
			.setName("Auto remove dividers")
			.setDesc(
				"Automatically remove the %% dividers %% in old log note " +
					"when a new one is created."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(settings.autoRemoveDividers)
					.onChange(async (value) => {
						settings.autoRemoveDividers = value;

						saveSettings(); // no need to write to log note, no immediate affect
					});
			});

		new Setting(containerEl)
			.setName("Auto create created divider")
			.setDesc(
				"Automatically append a 'created' divider to " +
					"the bottom of your note if it is not present."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(settings.autoCreateCreatedDivider)
					.onChange(async (value) => {
						settings.autoCreateCreatedDivider = value;
						saveSettingsAndWriteToLogNote();
					});
			});

		new Setting(containerEl)
			.setName("Auto create modified divider")
			.setDesc(
				"Automatically append a 'modified' divider to " +
					"the bottom of your note if it is not present."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(settings.autoCreateModifiedDivider)
					.onChange(async (value) => {
						settings.autoCreateModifiedDivider = value;
						saveSettingsAndWriteToLogNote();
					});
			});

		new Setting(containerEl)
			.setName("Auto create deleted divider")
			.setDesc(
				"Automatically append a 'deleted' divider to " +
					"the bottom of your note if it is not present."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(settings.autoCreateDeletedDivider)
					.onChange(async (value) => {
						settings.autoCreateDeletedDivider = value;
						saveSettingsAndWriteToLogNote();
					});
			});

		// SORTING
		new Setting(containerEl).setName("Sorting").setHeading();

		new Setting(containerEl)
			.setName("Sort created files")
			.setDesc("Method to sort files in the created list")
			.addDropdown((dropdown) => {
				dropdown
					.addOption("none", "No sorting")
					.addOption("alphabetical", "Name (A to Z)")
					.addOption("alphabetical-reverse", "Name (Z to A)")
					.addOption("mtime", "Modification time (old to new)")
					.addOption(
						"mtime-reverse",
						"Modification time (new to old)"
					)
					.addOption("ctime", "Creation time (old to new)")
					.addOption("ctime-reverse", "Creation time (new to old)")
					.setValue(settings.sortCreated)
					.onChange(async (value: string) => {
						settings.sortCreated = value as SortOption;
						saveSettingsAndWriteToLogNote();
					});
			});

		new Setting(containerEl)
			.setName("Sort modified files")
			.setDesc("Method to sort files in the modified list")
			.addDropdown((dropdown) => {
				dropdown
					.addOption("none", "No sorting")
					.addOption("alphabetical", "Name (A to Z)")
					.addOption("alphabetical-reverse", "Name (Z to A)")
					.addOption("mtime", "Modification time (old to new)")
					.addOption(
						"mtime-reverse",
						"Modification time (new to old)"
					)
					.addOption("ctime", "Creation time (old to new)")
					.addOption("ctime-reverse", "Creation time (new to old)")
					.setValue(settings.sortModified)
					.onChange(async (value: string) => {
						settings.sortModified = value as SortOption;
						saveSettingsAndWriteToLogNote();
					});
			});

		new Setting(containerEl)
			.setName("Sort deleted files")
			.setDesc(
				"Method to sort files in the deleted list. For now, " +
					"only sort by name is possible"
			)
			.addDropdown((dropdown) => {
				dropdown
					.addOption("none", "No sorting (ordered by detection)")
					.addOption("alphabetical", "A to Z")
					.addOption("alphabetical-reverse", "Z to A")
					.setValue(settings.sortDeleted)
					.onChange(async (value: string) => {
						settings.sortDeleted = value as SortOption;
						saveSettingsAndWriteToLogNote();
					});
			});

		// MISC
		new Setting(containerEl).setName("Misc").setHeading();

		new Setting(containerEl)
			.setName("Force update log note")
			.setDesc("This will force your log note content to be refreshed.")
			.addButton((button) => {
				button
					.setButtonText("Force update log note")
					.onClick(async () => {
						saveSettingsAndWriteToLogNote(true);
						displayNoticeAndWarn("Tracked files updated.");
					});
			});

		new Setting(containerEl)
			.setName("Clear tracked files")
			.setDesc(
				"This will get rid of all current modified/created/deleted files, " +
					"as if it were a new day."
			)
			.addButton((button) => {
				button
					.setButtonText("Clear tracked files")
					.onClick(async () => {
						new ConfirmModal(
							this.app,
							"Are you sure you want to clear tracked files? This will get " +
								"rid of all current modified/created/deleted files, " +
								"as if it is a new day. This cannot be undone.",
							async (result) => {
								if (result === "yes") {
									displayNoticeAndWarn(
										"Tracked files cleared."
									);
									settings.trackedFiles = [];
									await saveSettingsAndWriteToLogNote(true);
								}
							}
						).open();
					});
			});

		new Setting(containerEl)
			.setName("Verbose mode")
			.setDesc(
				"Enable verbose mode for debugging. " +
					"This only needs to be on for support and development purposes."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(settings.verboseModeEnabled)
					.onChange(async (value) => {
						settings.verboseModeEnabled = value;
						saveSettingsAndWriteToLogNote();
					});
			});

		new Setting(containerEl)
			.setName("Disable plugin on this device")
			.setDesc(
				"Disable the plugin on this device. This setting will not sync. " +
					"Use this to resolve sync conflicts or temporarily disable the plugin."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(
						// @ts-ignore
						this.app.loadLocalStorage(
							"obsidian-list-modified:disableLocally"
						) === "true"
					)
					.onChange((value) => {
						// @ts-ignore
						this.app.saveLocalStorage(
							"obsidian-list-modified:disableLocally",
							`${value}`
						);

						displayNoticeAndWarn(
							"Please restart Obsidian for this change to take effect."
						);
					});
			});

		// DONATIONS
		new Setting(containerEl).setName("Donations 🫶").setHeading();

		containerEl.createEl("p", {
			text: "If this plugin has helped you in anyway, feel free to donate :). Thank you so much!",
		});

		const coffeeImg = containerEl
			.createEl("a", {
				href: "https://ko-fi.com/franciskafieh",
			})
			.createEl("img", {
				attr: {
					src: "https://cdn.ko-fi.com/cdn/kofi1.png",
				},
			});
		coffeeImg.height = 30;
	}
}
