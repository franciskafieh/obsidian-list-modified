import { App, PluginSettingTab, Setting } from "obsidian"
import ListModified from "./main"

export interface ListModifiedSettings {
	dailyNoteFormat: string
	outputFormat: string
	tags: string
}

export const DEFAULT_SETTINGS: ListModifiedSettings = {
	dailyNoteFormat: '',
	outputFormat: '- [[link]]',
	tags: ''
}


export class ListModifiedSettingTab extends PluginSettingTab {
	plugin: ListModified
    tagString: string

	constructor(app: App, plugin: ListModified) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const {containerEl} = this

		containerEl.empty()

		containerEl.createEl('h2', {text: 'Formatting'})

		new Setting(containerEl)
			.setName('Daily Note Format')
			.setDesc('You can find this in your daily note settings menu. ' +
			'BE SURE TO include non-date-format characters in square brackets!')
			.addText(text => text
				.setPlaceholder('e.g. [Daily/]YYYY[/]YYYY-MM-DD')
				.setValue(this.plugin.settings.dailyNoteFormat)
				.onChange(async (value) => {
					this.plugin.settings.dailyNoteFormat = value
					await this.saveSettings()
		}))

		new Setting(containerEl)
			.setName('Output Format')
			.setDesc('The format to output added links. Use [[link]] as a placeholder to represent a link.')
			.addText(text => text
				.setPlaceholder('e.g. - [[link]]')
				.setValue(this.plugin.settings.outputFormat)
				.onChange(async (value) => {
					this.plugin.settings.outputFormat = value
					await this.saveSettings()
		}))


		containerEl.createEl('h2', {text: 'Criteria'})

		new Setting(containerEl)
			.setName('Blacklisted Tags')
			.setDesc('Comma-separated list of tags. ' +
					'If a file has a tag present on this list, it won\'t be linked to! ' +
					'Leave this blank to disable this feature.')
			.addText(text => text
				.setPlaceholder('e.g. #daily, #💡, #🔧')
				.setValue(this.plugin.settings.tags)
				.onChange(async (value) => {
					this.plugin.settings.tags = value
					await this.saveSettings()
		}))
	}

    async loadSettings() {
		this.plugin.settings = Object.assign({}, DEFAULT_SETTINGS, await this.plugin.loadData())
	}

	async saveSettings() {
		await this.plugin.saveData(this.plugin.settings)
	}
}

