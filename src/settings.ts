import { App, PluginSettingTab, Setting, TFile } from "obsidian";
import ListModified from "./main";

export interface ListModifiedSettings {
	outputFormat: string;
	tags: string;
	excludedFolders: string;
	automaticallyCreateDailyNote: boolean;
	lastTrackedDate: string;
	// cannot use a set because there is no good way to persist it.
	trackedFiles: string[];
	heading: string;
	hasBeenBackedUp: boolean;
}

export const DEFAULT_SETTINGS: ListModifiedSettings = {
	outputFormat: "- [[link]]",
	tags: "",
	excludedFolders: "",
	automaticallyCreateDailyNote: false,
	lastTrackedDate: "",
	trackedFiles: [],
	heading: "",
	hasBeenBackedUp: false
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

		containerEl.createEl("h2", { text: "Output File" });
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

		new Setting(containerEl)
			.setName("Heading")
			.setDesc(
				"Name of the heading (case sensitive) to list modified files under. If none is specified, the plugin WILL NOT WORK! You also must create this heading yourself."
			)
			.addText((text) =>
				text
					.setPlaceholder("e.g. Modified Today")
					.setValue(this.plugin.settings.heading)
					.onChange(async (value) => {
						this.plugin.settings.heading = value;
						await this.plugin.saveSettings();
						await this.plugin.updateTrackedFiles();
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
					.setValue(this.plugin.settings.outputFormat)
					.onChange(async (value) => {
						this.plugin.settings.outputFormat = value;
						await this.plugin.saveSettings();
						await this.plugin.updateTrackedFiles();
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
						await this.plugin.updateTrackedFiles();
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
						await this.plugin.updateTrackedFiles();
					})
			);
	}
}
