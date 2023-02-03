import { PluginSettingTab, Setting } from "obsidian";
import {
	getSettings,
	saveSettings,
	saveSettingsAndWriteTrackedFiles,
} from "./settings";

export class ListModifiedSettingTab extends PluginSettingTab {
	display(): void {
		const settings = getSettings();
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h2", { text: "Output File" });
		new Setting(containerEl)
			.setName("Create daily note automatically if it does not exist")
			.setDesc(
				"If this setting is not toggled, your modified files will not " +
					"be linked unless you create your daily note yourself."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(settings.automaticallyCreateDailyNote)
					.onChange(async (value) => {
						settings.automaticallyCreateDailyNote = value;
						await saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Heading")
			.setDesc(
				`Name of the heading (h1, h2, h3... etc) (case sensitive) to list modified files under.`
			)
			.addText((text) =>
				text
					.setPlaceholder("e.g. Modified Today")
					.setValue(settings.heading)
					.onChange(async (value) => {
						settings.heading = value;
						await saveSettingsAndWriteTrackedFiles();
					})
			);

		containerEl.createEl("h2", { text: "Formatting" });

		new Setting(containerEl)
			.setName("Output Format")
			.setDesc(
				"The format to output added links. Use [[link]] as a placeholder to represent a link."
			)
			.addText((text) =>
				text
					.setPlaceholder("e.g. - [[link]]")
					.setValue(settings.outputFormat)
					.onChange(async (value) => {
						settings.outputFormat = value;
						await saveSettingsAndWriteTrackedFiles();
					})
			);

		containerEl.createEl("h2", { text: "Criteria" });

		new Setting(containerEl)
			.setName("Ignored Tags")
			.setDesc(
				"Comma-separated list of tags. " +
					"If a file has a tag present on this list, it won't be linked to! " +
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
					"If a file is in a folder present on this list, it won't be linked to! " +
					"Leave this blank to disable this feature. " +
					"See the GitHub README for more details."
			)
			.addText((text) =>
				text
					.setPlaceholder(
						"e.g. here is a top folder/nextfolder, another top folder"
					)
					.setValue(settings.excludedFolders)
					.onChange(async (value) => {
						settings.excludedFolders = value;
						await saveSettingsAndWriteTrackedFiles();
					})
			);

		new Setting(containerEl)
			.setName("Write Interval")
			.setDesc(
				"The interval (in seconds) at which to write your modified files to your daily note. These will also be written when you close Obsidian (a best effort attempt.) Otherwise, they will be written before the next daily note is created. Set to 0 to disable and write to your file ASAP. This is recommended especially if you do not use a sync solution. Please restart Obsidian after changing this value."
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
	}
}
