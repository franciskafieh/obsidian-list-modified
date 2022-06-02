import { App, PluginSettingTab, Setting } from "obsidian";
import ListModified from "./main";

export interface ListModifiedSettings {
	outputFormat: string;
	tags: string;
	excludedFolders: string;
	automaticallyCreateDailyNote: boolean;
}

export const DEFAULT_SETTINGS: ListModifiedSettings = {
	outputFormat: "- [[link]]",
	tags: "",
	excludedFolders: "",
	automaticallyCreateDailyNote: false,
};

export class ListModifiedSettingTab extends PluginSettingTab {
	plugin: ListModified;

	constructor(app: App, plugin: ListModified) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Convenience" });
		new Setting(containerEl)
			.setName("Create daily note automatically if it does not exist")
			.setDesc(
				"If this setting is not toggled, your modified files will not " +
					"be linked unless you create your daily note yourself."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.automaticallyCreateDailyNote)
					.onChange((value) => {
						this.plugin.settings.automaticallyCreateDailyNote =
							value;
						this.plugin.saveSettings();
					});
			});

		containerEl.createEl("h2", { text: "Formatting" });

		new Setting(containerEl)
			.setName("Output Format")
			.setDesc(
				"The format to output added links. Use [[link]] as a placeholder to represent a link."
			)
			.addText((text) =>
				text
					.setPlaceholder("e.g. - [[link]]")
					.setValue(this.plugin.settings.outputFormat)
					.onChange(async (value) => {
						this.plugin.settings.outputFormat = value;
						await this.plugin.saveSettings();
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
					.setValue(this.plugin.settings.tags)
					.onChange(async (value) => {
						this.plugin.settings.tags = value;
						await this.plugin.saveSettings();
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
					.setValue(this.plugin.settings.excludedFolders)
					.onChange(async (value) => {
						this.plugin.settings.excludedFolders = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
