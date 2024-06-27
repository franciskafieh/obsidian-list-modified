import { PluginSettingTab, Setting } from "obsidian";
import {
	getSettings,
	saveSettings,
	saveSettingsAndWriteToLogNote,
} from "./settings";
import { LogNoteType } from "../../types";

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
			" for configuration and setup help.",
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
				"'Weekly' and 'monthly' require you to have the Periodic Notes plugin.",
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
					"Set to 0 to disable and write to your file directly after every change. " +
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

		containerEl.createEl("h2", { text: "Criteria" });
		containerEl.createEl("h2", { text: "Output Format" });
		containerEl.createEl("h2", { text: "Dividers" });
		containerEl.createEl("h2", { text: "Debug" });

		// DONATIONS
		containerEl.createEl("h2", { text: "Donations 🫶" });
		// containerEl.append(containerEl.createSvg("https://ko-fi.com/img/githubbutton_sm.svg"));
	}
}
