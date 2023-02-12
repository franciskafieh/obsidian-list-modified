import { PluginSettingTab, Setting } from "obsidian";
import {
	getSettings,
	saveSettings,
	saveSettingsAndWriteTrackedFiles,
} from "./settings";
import { PeriodicNoteType } from "../types";

export class ListModifiedSettingTab extends PluginSettingTab {
	display(): void {
		const settings = getSettings();
		const { containerEl } = this;

		containerEl.empty();

		// CRITERIA
		containerEl.createEl("h2", { text: "Criteria" });
		new Setting(containerEl)
			.setName("Ignored Tags")
			.setDesc(
				"Comma-separated list of tags. " +
					"If a file has a tag present on this list, it won't be linked to. " +
					"Leave this blank to disable this feature."
			)
			.addText((text) =>
				text
					.setPlaceholder("e.g. #daily, #💡, #🔧")
					.setValue(settings.tags)
					.onChange(async (value) => {
						settings.tags = value;
						await saveSettingsAndWriteTrackedFiles();
					})
			);

		new Setting(containerEl)
			.setName("Excluded Folders")
			.setDesc(
				"Comma-separated list of folders that should be excluded. " +
					"If a file is in a folder present on this list, it won't be linked to. " +
					"Leave this blank to disable this feature. " +
					"See the wiki for more details."
			)
			.addText((text) =>
				text
					.setPlaceholder(
						"e.g. top folder/nextfolder, another top folder"
					)
					.setValue(settings.excludedFolders)
					.onChange(async (value) => {
						settings.excludedFolders = value;
						await saveSettingsAndWriteTrackedFiles();
					})
			);

		new Setting(containerEl)
			.setName("Ignored Name Text")
			.setDesc(
				"List of text that (case insensitive) should cause a file to be ignored if it contains said text. E.g. ignoring 'ab' will prevent file 'xyz-ab-xyz' from being listed because it contains 'ab.' Leave this blank to disable this feature."
			)
			.addText((text) =>
				text
					.setPlaceholder(
						"e.g. sync-conflict (recommended if you use syncthing), some more text"
					)
					.setValue(settings.ignoredNameContains)
					.onChange(async (value) => {
						settings.ignoredNameContains = value;
						await saveSettingsAndWriteTrackedFiles();
					})
			);

		// FORMATTING
		containerEl.createEl("h2", { text: "Formatting" });
		new Setting(containerEl)
			.setName("Output Format")
			.setDesc(
				"The format to output added links. Use [[link]] as a placeholder to represent a link, [[name]] for file name, [[tags]], [[ctime]] for created time."
			)
			.addText((text) =>
				text
					.setPlaceholder("e.g. - [[link]] ([[tags]])")
					.setValue(settings.outputFormat)
					.onChange(async (value) => {
						settings.outputFormat = value;
						await saveSettingsAndWriteTrackedFiles();
					})
			);

		new Setting(containerEl)
			.setName("Append Space After Headings")
			.setDesc(
				"Whether to append a blank line after every heading or not."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(settings.appendSpaceAfterHeadings)
					.onChange(async (value) => {
						settings.appendSpaceAfterHeadings = value;
						await saveSettingsAndWriteTrackedFiles();
					})
			);

		// LOG NOTE
		containerEl.createEl("h2", { text: "Log note" });
		new Setting(containerEl)
			.setName("Create log note automatically if it does not exist")
			.setDesc(
				"If this setting is not turned on, your modified files will not " +
					"be linked unless you create your log note yourself."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(settings.autoCreateLogNote)
					.onChange(async (value) => {
						settings.autoCreateLogNote = value;
						await saveSettingsAndWriteTrackedFiles();
					});
			});

		new Setting(containerEl)
			.setName("Log note type")
			.setDesc(
				"Requires the Periodic Notes plugin for anything other than daily"
			)
			.addDropdown((dropdown) => {
				dropdown
					.addOption("daily", "Daily")
					.addOption("weekly", "Weekly (Periodic Notes)")
					.addOption("monthly", "Monthly (Periodic Notes)")
					.setValue(settings.logNoteType)
					.onChange(async (value: PeriodicNoteType) => {
						settings.logNoteType = value;
						await saveSettingsAndWriteTrackedFiles();
					});
			});

		new Setting(containerEl)
			.setName("Write Interval")
			.setDesc(
				"The interval (in seconds) at which to write your modified files to your daily note. " +
					"Set to 0 to disable and write to your file ASAP. " +
					"This is recommended especially if you do not use a sync solution. " +
					"Please restart Obsidian after changing this value."
			)
			.addText((text) =>
				text
					.setPlaceholder("e.g. 30")
					.setValue(String(settings.writeInterval))
					.onChange(async (value) => {
						settings.writeInterval = parseInt(value);
						await saveSettings();
					})
			);

		// HEADINGS
		containerEl.createEl("h2", { text: "Headings" });
		new Setting(containerEl)
			.setName("Automatically create primary heading")
			.setDesc(
				"If this is disabled, the plugin will not work until you create the heading yourself. " +
					"Please KEEP THIS DISABLED if using the Templater plugin with folder templates."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(settings.autoCreatePrimaryHeading)
					.onChange(async (value) => {
						settings.autoCreatePrimaryHeading = value;
						await saveSettingsAndWriteTrackedFiles();
					});
			});

		new Setting(containerEl)
			.setName("Primary Heading name")
			.setDesc(
				`Name of the heading (without "#", case sensitive) to list modified files under.`
			)
			.addText((text) =>
				text
					.setPlaceholder("e.g. Modified Notes")
					.setValue(settings.primaryHeading)
					.onChange(async (value) => {
						settings.primaryHeading = value;
						await saveSettingsAndWriteTrackedFiles();
					})
			);

		new Setting(containerEl)
			.setName("Modified heading name")
			.setDesc(
				"Name of the heading (without '#', case sensitive) to list modified files under."
			)
			.addText((text) =>
				text
					.setPlaceholder("e.g. Modified Notes")
					.setValue(settings.modifiedHeading)
					.onChange(async (value) => {
						settings.modifiedHeading = value;
						await saveSettingsAndWriteTrackedFiles();
					})
			);

		new Setting(containerEl)
			.setName("Separate created files")
			.setDesc(
				"Move created files out of the modified list, into a separate heading."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(settings.separateCreated)
					.onChange(async (value) => {
						settings.separateCreated = value;
						createdHeadingNameSetting.setDisabled(!value);
						await saveSettingsAndWriteTrackedFiles();
					})
			);

		const createdHeadingNameSetting = new Setting(containerEl)
			.setName("Created Heading name")
			.setDesc(
				`Name of the heading (without "#", case sensitive) to list created files under.`
			)
			.addText((text) =>
				text
					.setPlaceholder("e.g. Created Notes")
					.setValue(settings.createdHeading)
					.setDisabled(!settings.separateCreated)
					.onChange(async (value) => {
						settings.createdHeading = value;
						await saveSettingsAndWriteTrackedFiles();
					})
			);

		new Setting(containerEl)
			.setName("Separate deleted files")
			.setDesc("Track deleted files in your log note.")
			.addToggle((toggle) =>
				toggle
					.setValue(settings.separateDeleted)
					.onChange(async (value) => {
						deletedHeadingNameSetting.setDisabled(!value);
						settings.separateDeleted = value;
						await saveSettingsAndWriteTrackedFiles();
					})
			);

		const deletedHeadingNameSetting = new Setting(containerEl)
			.setName("Deleted Heading name")
			.setDesc(
				`Name of the heading (without "#", case sensitive) to list deleted files under.`
			)
			.addText((text) =>
				text
					.setPlaceholder("e.g. Deleted Notes")
					.setValue(settings.deletedHeading)
					.setDisabled(!settings.separateDeleted)
					.onChange(async (value) => {
						settings.deletedHeading = value;
						await saveSettingsAndWriteTrackedFiles();
					})
			);
	}
}
