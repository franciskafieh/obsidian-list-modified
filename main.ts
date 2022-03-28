import { App, CachedMetadata, Notice, Plugin, PluginSettingTab, Setting, TFile, moment, TagCache, FrontMatterCache } from 'obsidian'

interface ListModifiedSettings {
	dailyNoteFormat: string
	outputFormat: string
	tags: string
}

const DEFAULT_SETTINGS: ListModifiedSettings = {
	dailyNoteFormat: '',
	outputFormat: '- [[link]]',
	tags: ''
}

export default class ListModified extends Plugin {
	settings: ListModifiedSettings

	async onload() {
		await this.loadSettings()

		this.registerEvent(this.app.vault.on('modify', async (file) => {
			const currentFile: TFile = file as TFile
			const tags: string[] = this.settings.tags.replace(/\s/g, '').split(',')
			const dailyNoteFormat: string = this.settings.dailyNoteFormat
			const dailyFile: TFile = this.app.vault.getAbstractFileByPath(
				moment().format(dailyNoteFormat) + '.md'
			) as TFile
			const outputFormat: string = this.settings.outputFormat
			const resolvedOutputFormat: string = outputFormat.replace('[[link]]', `[[${currentFile.basename}]]`)

			if (dailyFile === null) {
				new Notice(`A daily file with format ${dailyNoteFormat} doesn't exist! Cannot append link`) 
				return
			}

			if (currentFile === dailyFile) return
			
			if (this.fileIsLinked(dailyFile, currentFile.basename)) return

			if (tags[0] !== '' && !this.fileMeetsTagRequirements(currentFile, tags)) return

			const contents: string = await this.app.vault.cachedRead(dailyFile)

			// If the daily file ends with a new line character, put the new
			// modified file link onto that line and add a new line. Otherwise,
			// add a new line first, then append the new modified file link.
			if (contents.slice(-1) == '\n') {
				await this.app.vault.append(dailyFile, resolvedOutputFormat + '\n')
			} else {
				await this.app.vault.append(dailyFile, '\n' + resolvedOutputFormat)
			}
		}))

		this.addSettingTab(new ListModifiedSettingTab(this.app, this))
	}

	fileIsLinked(fileToCheck: TFile, link: string): boolean {
		const cache: CachedMetadata = this.app.metadataCache.getFileCache(fileToCheck)
		return cache.links.some(l => l.link === link)
	}

	fileMeetsTagRequirements(file: TFile, tags: string[]): boolean {
		for (const tag of tags) {
			if (this.fileHasTag(file, tag)) return false
		}
		return true
	}

	fileHasTag(file: TFile, tag: string): boolean {
		const cache: CachedMetadata = this.app.metadataCache.getFileCache(file)
		return this.tagMetadataContainsTag(cache, tag) || 
		this.frontmatterMetadataContainsTag(cache, tag)
	}

	tagMetadataContainsTag(cache: CachedMetadata, tagToMatch: string): boolean {
		const tagCache: TagCache[] = cache.tags
		if (tagCache === undefined) return false
		return tagCache.some(tag => tag.tag === tagToMatch)
	}

	frontmatterMetadataContainsTag(cache: CachedMetadata, tagToMatch: string): boolean {
		const frontmatterCache: FrontMatterCache = cache.frontmatter
		if (frontmatterCache === undefined) return false
		return frontmatterCache.tags.some((tag: string) => tag === tagToMatch)
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}

class ListModifiedSettingTab extends PluginSettingTab {
	plugin: ListModified

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
			'BE SURE TO include the folder path in square brackets if your ' +
			'daily notes do not reside in the root folder of your vault!')
			.addText(text => text
				.setPlaceholder('e.g. [Daily/]YYYY-MM-DD')
				.setValue(this.plugin.settings.dailyNoteFormat)
				.onChange(async (value) => {
					this.plugin.settings.dailyNoteFormat = value
					await this.plugin.saveSettings()
		}))

		new Setting(containerEl)
			.setName('Output Format')
			.setDesc('The format to output added links. Use [[link]] as a placeholder to represent a link.')
			.addText(text => text
				.setPlaceholder('e.g. - [[link]]')
				.setValue(this.plugin.settings.outputFormat)
				.onChange(async (value) => {
					this.plugin.settings.outputFormat = value
					await this.plugin.saveSettings()
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
					await this.plugin.saveSettings()
		}))
	}
}
