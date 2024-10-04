import { PluginSettingTab, Setting } from "obsidian";
import {
	getSettings,
	saveSettings,
	saveSettingsAndWriteToLogNote,
} from "./settings";
import { LogNoteType } from "../../types";
import { convertCommaListToArray } from "../../utils/converCommaListToArray";
import { getLogNote } from "../log_note/logNote";
import { getContentWithoutCreatedSection } from "../../logic/log_note/getContentWithoutCreatedSection";

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
			.setDesc("Files in these folders will not be tracked.")
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
				"Files with names containing these strings will not be tracked."
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
			.setDesc("Combine the 'created' and 'modified' dividers into one.")
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

		// DEBUG
		new Setting(containerEl).setName("Debug").setHeading();

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
