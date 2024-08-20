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
		topHeader.createEl("h3", { text: "List Modified Settings" });
		topHeader.append(
			"Please read ",
			containerEl.createEl("a", {
				href: "https://github.com/franciskafieh/obsidian-list-modified/wiki",
				text: "the wiki",
			}),
			" for configuration and setup help. The plugin ",
			containerEl.createEl("b", { text: "will not work" }),
			" unless configured properly!",
		);
		topHeader.style.marginBottom = "50px";

		// LOG NOTE
		containerEl.createEl("h2", { text: "Log Note" });
		new Setting(containerEl)
			.setName("Auto Create Log Note")
			.setDesc(
				"If this setting is turned off, your modified files will not " +
					"be linked unless you create a log note yourself.",
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
			.setName("Log Note Type")
			.setDesc(
				"The 'Weekly' and 'Monthly' options REQUIRE you to have the Periodic Notes plugin.",
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
			.setName("Write Interval")
			.setDesc(
				"The interval (in seconds) at which to write your modified files to your daily note. " +
					"Set to 0 to disable the interval and write to your file directly after every change. " +
					"This is recommended especially if you do not use a sync solution. " +
					"Please restart Obsidian after changing this value.",
			)
			.addText((text) =>
				text
					.setPlaceholder("0 (RECOMMENDED)")
					.setValue(String(settings.writeInterval))
					.onChange(async (value) => {
						settings.writeInterval = parseInt(value);
						await saveSettings();
					}),
			);

		// CRITERIA
		containerEl.createEl("h2", { text: "Criteria" });
		new Setting(containerEl)
			.setName("Excluded Tags")
			.setDesc("Files with these tags will not be tracked.")
			.addText((text) =>
				text
					.setPlaceholder("tag1, tag2, tag3")
					.setValue(settings.excludedTags.join(", "))
					.onChange(async (value) => {
						settings.excludedTags = convertCommaListToArray(value);
						saveSettingsAndWriteToLogNote();
					}),
			);

		new Setting(containerEl)
			.setName("Excluded Folders")
			.setDesc("Files in these folders will not be tracked.")
			.addText((text) =>
				text
					.setPlaceholder("folder1, folder2, folder3")
					.setValue(settings.excludedFolders.join(", "))
					.onChange(async (value) => {
						settings.excludedFolders =
							convertCommaListToArray(value);
						saveSettingsAndWriteToLogNote();
					}),
			);

		new Setting(containerEl)
			.setName("Excluded Names")
			.setDesc(
				"Files with names containing these strings will not be tracked.",
			)
			.addText((text) =>
				text
					.setPlaceholder("string1, string2, string3")
					.setValue(settings.excludedNameContains.join(", "))
					.onChange(async (value) => {
						settings.excludedNameContains =
							convertCommaListToArray(value);
						saveSettingsAndWriteToLogNote();
					}),
			);

		// OUTPUT FORMAT
		containerEl.createEl("h2", { text: "Output Formatting" });

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
			}),
		);

		new Setting(containerEl)
			.setName("Output Format")
			.setDesc(outputFormatDesc)
			.addText((text) =>
				text
					.setPlaceholder("- [[link]]")
					.setValue(settings.outputFormat)
					.onChange(async (value) => {
						settings.outputFormat = value;
						saveSettingsAndWriteToLogNote();
					}),
			);

		new Setting(containerEl)
			.setName("Separate Output Formats")
			.setDesc(
				"If turned on, you may use different output formats for created/deleted/modified.",
			)
			.addText((text) =>
				text
					.setPlaceholder("- [[link]]")
					.setValue(settings.outputFormat)
					.onChange(async (value) => {
						settings.outputFormat = value;
						saveSettingsAndWriteToLogNote();
					}),
			);

		new Setting(containerEl)
			.setName("Time Format")
			.setDesc(
				"Time format for use with the above time-related placeholders. ",
			)
			.addText((text) =>
				text
					.setPlaceholder("YYYY-MM-DD")
					.setValue(settings.timeFormat)
					.onChange(async (value) => {
						settings.timeFormat = value;
						saveSettingsAndWriteToLogNote();
					}),
			);

		// DIVIDERS
		containerEl.createEl("h2", { text: "Dividers" });
		new Setting(containerEl)
			.setName("Combine Created and Modified")
			.setDesc("Combine the 'created' and 'modified' dividers into one.")
			.addToggle((toggle) => {
				toggle
					.setValue(settings.combineCreatedAndModified)
					.onChange(async (value) => {
						settings.combineCreatedAndModified = value;

						// if set to true get rid of created section
						if (value) {
							await this.app.vault.process(getLogNote(), (data) =>
								getContentWithoutCreatedSection(data),
							);
						}

						saveSettingsAndWriteToLogNote();
					});
			});

		new Setting(containerEl)
			.setName("Auto Create Created Divider")
			.setDesc(
				"Automatically append a 'created' divider to " +
					"the bottom of your note if it is not present.",
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
			.setName("Auto Create Modified Divider")
			.setDesc(
				"Automatically append a 'modified' divider to " +
					"the bottom of your note if it is not present.",
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
			.setName("Auto Create Deleted Divider")
			.setDesc(
				"Automatically append a 'deleted' divider to " +
					"the bottom of your note if it is not present.",
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
		containerEl.createEl("h2", { text: "Debug" });
		new Setting(containerEl)
			.setName("Verbose Mode")
			.setDesc(
				"Enable verbose mode for debugging. " +
					"This only needs to be on for support and development purposes.",
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
		containerEl.createEl("h2", { text: "Donations 🫶" });
		containerEl.createEl("p", {
			text: "If this plugin has helped you, feel free to donate. Thank you so much!",
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

		const separateOutputFormats = containerEl.createDiv();
		separateOutputFormats.style.display = "block";
		new Setting(separateOutputFormats).setName("lol").setDesc("test desc");
		new Setting(separateOutputFormats).setName("lol").setDesc("test desc");
		new Setting(separateOutputFormats).setName("lol").setDesc("test desc");
		new Setting(separateOutputFormats).setName("lol").setDesc("test desc");
		new Setting(separateOutputFormats).setName("lol").setDesc("test desc");
		new Setting(separateOutputFormats).setName("lol").setDesc("test desc");
		new Setting(separateOutputFormats).setName("lol").setDesc("test desc");
		new Setting(separateOutputFormats).setName("lol").setDesc("test desc");
		new Setting(separateOutputFormats).setName("lol").setDesc("test desc");
		new Setting(separateOutputFormats).setName("lol").setDesc("test desc");
		new Setting(separateOutputFormats).setName("lol").setDesc("test desc");
		new Setting(separateOutputFormats).setName("lol").setDesc("test desc");
		new Setting(separateOutputFormats).setName("lol").setDesc("test desc");
	}
}
