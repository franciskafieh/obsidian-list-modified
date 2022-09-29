# Class: default

[main](../wiki/main).default

Entry point of the plugin

## Hierarchy

- `Plugin_2`

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](../wiki/main.default#constructor)

### Properties

- [app](../wiki/main.default#app)
- [manifest](../wiki/main.default#manifest)
- [onCacheChange](../wiki/main.default#oncachechange)
- [onVaultDelete](../wiki/main.default#onvaultdelete)
- [onVaultRename](../wiki/main.default#onvaultrename)
- [settings](../wiki/main.default#settings)
- [updateTrackedFiles](../wiki/main.default#updatetrackedfiles)

### Methods

- [addChild](../wiki/main.default#addchild)
- [addCommand](../wiki/main.default#addcommand)
- [addRibbonIcon](../wiki/main.default#addribbonicon)
- [addSettingTab](../wiki/main.default#addsettingtab)
- [addStatusBarItem](../wiki/main.default#addstatusbaritem)
- [cacheContainsIgnoredTag](../wiki/main.default#cachecontainsignoredtag)
- [getFormattedOutput](../wiki/main.default#getformattedoutput)
- [load](../wiki/main.default#load)
- [loadData](../wiki/main.default#loaddata)
- [loadSettings](../wiki/main.default#loadsettings)
- [onload](../wiki/main.default#onload)
- [onunload](../wiki/main.default#onunload)
- [pathIsExcluded](../wiki/main.default#pathisexcluded)
- [register](../wiki/main.default#register)
- [registerCodeMirror](../wiki/main.default#registercodemirror)
- [registerDomEvent](../wiki/main.default#registerdomevent)
- [registerEditorExtension](../wiki/main.default#registereditorextension)
- [registerEditorSuggest](../wiki/main.default#registereditorsuggest)
- [registerEvent](../wiki/main.default#registerevent)
- [registerExtensions](../wiki/main.default#registerextensions)
- [registerInterval](../wiki/main.default#registerinterval)
- [registerMarkdownCodeBlockProcessor](../wiki/main.default#registermarkdowncodeblockprocessor)
- [registerMarkdownPostProcessor](../wiki/main.default#registermarkdownpostprocessor)
- [registerObsidianProtocolHandler](../wiki/main.default#registerobsidianprotocolhandler)
- [registerScopeEvent](../wiki/main.default#registerscopeevent)
- [registerView](../wiki/main.default#registerview)
- [removeChild](../wiki/main.default#removechild)
- [saveData](../wiki/main.default#savedata)
- [saveSettings](../wiki/main.default#savesettings)
- [unload](../wiki/main.default#unload)

## Constructors

### constructor

• **new default**(`app`, `manifest`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `app` | `App` |
| `manifest` | `PluginManifest` |

#### Inherited from

Plugin.constructor

#### Defined in

node_modules/obsidian/obsidian.d.ts:2451

## Properties

### app

• **app**: `App`

#### Inherited from

Plugin.app

#### Defined in

node_modules/obsidian/obsidian.d.ts:2443

___

### manifest

• **manifest**: `PluginManifest`

#### Inherited from

Plugin.manifest

#### Defined in

node_modules/obsidian/obsidian.d.ts:2447

___

### onCacheChange

• `Private` **onCacheChange**: `Object`

#### Call signature

▸ (...`args`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`Promise`<`void`\>

#### Type declaration

| Name | Type |
| :------ | :------ |
| `after` | () => `Promise`<`void`\> |

#### Defined in

[src/main.ts:49](https://github.com/franciskafieh/obsidian-list-modified/blob/b7d8481/src/main.ts#L49)

___

### onVaultDelete

• `Private` **onVaultDelete**: `Object`

#### Call signature

▸ (...`args`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`Promise`<`void`\>

#### Type declaration

| Name | Type |
| :------ | :------ |
| `after` | () => `Promise`<`void`\> |

#### Defined in

[src/main.ts:110](https://github.com/franciskafieh/obsidian-list-modified/blob/b7d8481/src/main.ts#L110)

___

### onVaultRename

• `Private` **onVaultRename**: `Object`

#### Call signature

▸ (...`args`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`Promise`<`void`\>

#### Type declaration

| Name | Type |
| :------ | :------ |
| `after` | () => `Promise`<`void`\> |

#### Defined in

[src/main.ts:119](https://github.com/franciskafieh/obsidian-list-modified/blob/b7d8481/src/main.ts#L119)

___

### settings

• **settings**: [`ListModifiedSettings`](../wiki/settings.ListModifiedSettings)

#### Defined in

[src/main.ts:29](https://github.com/franciskafieh/obsidian-list-modified/blob/b7d8481/src/main.ts#L29)

___

### updateTrackedFiles

• **updateTrackedFiles**: `Object`

#### Call signature

▸ (...`args`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`Promise`<`void`\>

#### Type declaration

| Name | Type |
| :------ | :------ |
| `after` | () => `Promise`<`void`\> |

#### Defined in

[src/main.ts:132](https://github.com/franciskafieh/obsidian-list-modified/blob/b7d8481/src/main.ts#L132)

## Methods

### addChild

▸ **addChild**<`T`\>(`component`): `T`

Adds a child component, loading it if this component is loaded

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Component`<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `T` |

#### Returns

`T`

#### Inherited from

Plugin.addChild

#### Defined in

node_modules/obsidian/obsidian.d.ts:586

___

### addCommand

▸ **addCommand**(`command`): `Command`

Register a command globally. The command id and name will be automatically prefixed with this plugin's id and name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | `Command` |

#### Returns

`Command`

#### Inherited from

Plugin.addCommand

#### Defined in

node_modules/obsidian/obsidian.d.ts:2468

___

### addRibbonIcon

▸ **addRibbonIcon**(`icon`, `title`, `callback`): `HTMLElement`

Adds a ribbon icon to the left bar.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `icon` | `string` | The icon name to be used. See addIcon |
| `title` | `string` | The title to be displayed in the tooltip. |
| `callback` | (`evt`: `MouseEvent`) => `any` | The `click` callback. |

#### Returns

`HTMLElement`

#### Inherited from

Plugin.addRibbonIcon

#### Defined in

node_modules/obsidian/obsidian.d.ts:2459

___

### addSettingTab

▸ **addSettingTab**(`settingTab`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `settingTab` | `PluginSettingTab` |

#### Returns

`void`

#### Inherited from

Plugin.addSettingTab

#### Defined in

node_modules/obsidian/obsidian.d.ts:2472

___

### addStatusBarItem

▸ **addStatusBarItem**(): `HTMLElement`

#### Returns

`HTMLElement`

#### Inherited from

Plugin.addStatusBarItem

#### Defined in

node_modules/obsidian/obsidian.d.ts:2463

___

### cacheContainsIgnoredTag

▸ `Private` **cacheContainsIgnoredTag**(`cache`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cache` | `CachedMetadata` |

#### Returns

`boolean`

#### Defined in

[src/main.ts:86](https://github.com/franciskafieh/obsidian-list-modified/blob/b7d8481/src/main.ts#L86)

___

### getFormattedOutput

▸ `Private` **getFormattedOutput**(`path`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`string`

#### Defined in

[src/main.ts:221](https://github.com/franciskafieh/obsidian-list-modified/blob/b7d8481/src/main.ts#L221)

___

### load

▸ **load**(): `void`

Load this component and its children

#### Returns

`void`

#### Inherited from

Plugin.load

#### Defined in

node_modules/obsidian/obsidian.d.ts:564

___

### loadData

▸ **loadData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

Plugin.loadData

#### Defined in

node_modules/obsidian/obsidian.d.ts:2522

___

### loadSettings

▸ `Private` **loadSettings**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/main.ts:245](https://github.com/franciskafieh/obsidian-list-modified/blob/b7d8481/src/main.ts#L245)

___

### onload

▸ **onload**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

Plugin.onload

#### Defined in

[src/main.ts:31](https://github.com/franciskafieh/obsidian-list-modified/blob/b7d8481/src/main.ts#L31)

___

### onunload

▸ **onunload**(): `void`

Override this to unload your component

#### Returns

`void`

#### Inherited from

Plugin.onunload

#### Defined in

node_modules/obsidian/obsidian.d.ts:581

___

### pathIsExcluded

▸ `Private` **pathIsExcluded**(`path`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`boolean`

#### Defined in

[src/main.ts:94](https://github.com/franciskafieh/obsidian-list-modified/blob/b7d8481/src/main.ts#L94)

___

### register

▸ **register**(`cb`): `void`

Registers a callback to be called when unloading

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | () => `any` |

#### Returns

`void`

#### Inherited from

Plugin.register

#### Defined in

node_modules/obsidian/obsidian.d.ts:596

___

### registerCodeMirror

▸ **registerCodeMirror**(`callback`): `void`

Runs callback on all currently loaded instances of CodeMirror,
then registers the callback for all future CodeMirror instances.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`cm`: `Editor`) => `any` |

#### Returns

`void`

#### Inherited from

Plugin.registerCodeMirror

#### Defined in

node_modules/obsidian/obsidian.d.ts:2497

___

### registerDomEvent

▸ **registerDomEvent**<`K`\>(`el`, `type`, `callback`, `options?`): `void`

Registers an DOM event to be detached when unloading

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `WindowEventMap` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `el` | `Window` |
| `type` | `K` |
| `callback` | (`this`: `HTMLElement`, `ev`: `WindowEventMap`[`K`]) => `any` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

#### Returns

`void`

#### Inherited from

Plugin.registerDomEvent

#### Defined in

node_modules/obsidian/obsidian.d.ts:606

▸ **registerDomEvent**<`K`\>(`el`, `type`, `callback`, `options?`): `void`

Registers an DOM event to be detached when unloading

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `DocumentEventMap` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `el` | `Document` |
| `type` | `K` |
| `callback` | (`this`: `HTMLElement`, `ev`: `DocumentEventMap`[`K`]) => `any` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

#### Returns

`void`

#### Inherited from

Plugin.registerDomEvent

#### Defined in

node_modules/obsidian/obsidian.d.ts:611

▸ **registerDomEvent**<`K`\>(`el`, `type`, `callback`, `options?`): `void`

Registers an DOM event to be detached when unloading

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `HTMLElementEventMap` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `el` | `HTMLElement` |
| `type` | `K` |
| `callback` | (`this`: `HTMLElement`, `ev`: `HTMLElementEventMap`[`K`]) => `any` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

#### Returns

`void`

#### Inherited from

Plugin.registerDomEvent

#### Defined in

node_modules/obsidian/obsidian.d.ts:616

___

### registerEditorExtension

▸ **registerEditorExtension**(`extension`): `void`

Registers a CodeMirror 6 extension.
To reconfigure cm6 extensions for your plugin on the fly, you can pass an array here and dynamically
modify it. Once this array is modified, call `Workspace.updateOptions()` to have the changes applied.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extension` | `Extension` | must be a CodeMirror 6 `Extension`, or an array of Extensions. |

#### Returns

`void`

#### Inherited from

Plugin.registerEditorExtension

#### Defined in

node_modules/obsidian/obsidian.d.ts:2505

___

### registerEditorSuggest

▸ **registerEditorSuggest**(`editorSuggest`): `void`

Register an EditorSuggest which can provide live suggestions while the user is typing.

#### Parameters

| Name | Type |
| :------ | :------ |
| `editorSuggest` | `EditorSuggest`<`any`\> |

#### Returns

`void`

#### Inherited from

Plugin.registerEditorSuggest

#### Defined in

node_modules/obsidian/obsidian.d.ts:2518

___

### registerEvent

▸ **registerEvent**(`eventRef`): `void`

Registers an event to be detached when unloading

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventRef` | `EventRef` |

#### Returns

`void`

#### Inherited from

Plugin.registerEvent

#### Defined in

node_modules/obsidian/obsidian.d.ts:601

___

### registerExtensions

▸ **registerExtensions**(`extensions`, `viewType`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensions` | `string`[] |
| `viewType` | `string` |

#### Returns

`void`

#### Inherited from

Plugin.registerExtensions

#### Defined in

node_modules/obsidian/obsidian.d.ts:2480

___

### registerInterval

▸ **registerInterval**(`id`): `number`

Registers an interval (from setInterval) to be cancelled when unloading
Use window.setInterval instead of setInterval to avoid TypeScript confusing between NodeJS vs Browser API

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`number`

#### Inherited from

Plugin.registerInterval

#### Defined in

node_modules/obsidian/obsidian.d.ts:627

___

### registerMarkdownCodeBlockProcessor

▸ **registerMarkdownCodeBlockProcessor**(`language`, `handler`, `sortOrder?`): `MarkdownPostProcessor`

Register a special post processor that handles fenced code given a language and a handler.
This special post processor takes care of removing the <pre><code> and create a <div> that
will be passed to your handler, and is expected to be filled with your custom elements.

#### Parameters

| Name | Type |
| :------ | :------ |
| `language` | `string` |
| `handler` | (`source`: `string`, `el`: `HTMLElement`, `ctx`: `MarkdownPostProcessorContext`) => `void` \| `Promise`<`any`\> |
| `sortOrder?` | `number` |

#### Returns

`MarkdownPostProcessor`

#### Inherited from

Plugin.registerMarkdownCodeBlockProcessor

#### Defined in

node_modules/obsidian/obsidian.d.ts:2491

___

### registerMarkdownPostProcessor

▸ **registerMarkdownPostProcessor**(`postProcessor`, `sortOrder?`): `MarkdownPostProcessor`

#### Parameters

| Name | Type |
| :------ | :------ |
| `postProcessor` | `MarkdownPostProcessor` |
| `sortOrder?` | `number` |

#### Returns

`MarkdownPostProcessor`

#### Inherited from

Plugin.registerMarkdownPostProcessor

#### Defined in

node_modules/obsidian/obsidian.d.ts:2484

___

### registerObsidianProtocolHandler

▸ **registerObsidianProtocolHandler**(`action`, `handler`): `void`

Register a handler for obsidian:// URLs.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `string` | the action string. For example, "open" corresponds to `obsidian://open`. |
| `handler` | `ObsidianProtocolHandler` | the callback to trigger. You will be passed the key-value pair that is decoded from the query.                   For example, `obsidian://open?key=value` would generate `{"action": "open", "key": "value"}`. |

#### Returns

`void`

#### Inherited from

Plugin.registerObsidianProtocolHandler

#### Defined in

node_modules/obsidian/obsidian.d.ts:2513

___

### registerScopeEvent

▸ **registerScopeEvent**(`keyHandler`): `void`

Registers an key event to be detached when unloading

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyHandler` | `KeymapEventHandler` |

#### Returns

`void`

#### Inherited from

Plugin.registerScopeEvent

#### Defined in

node_modules/obsidian/obsidian.d.ts:621

___

### registerView

▸ **registerView**(`type`, `viewCreator`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `viewCreator` | `ViewCreator` |

#### Returns

`void`

#### Inherited from

Plugin.registerView

#### Defined in

node_modules/obsidian/obsidian.d.ts:2476

___

### removeChild

▸ **removeChild**<`T`\>(`component`): `T`

Removes a child component, unloading it

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Component`<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `T` |

#### Returns

`T`

#### Inherited from

Plugin.removeChild

#### Defined in

node_modules/obsidian/obsidian.d.ts:591

___

### saveData

▸ **saveData**(`data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`void`\>

#### Inherited from

Plugin.saveData

#### Defined in

node_modules/obsidian/obsidian.d.ts:2526

___

### saveSettings

▸ **saveSettings**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/main.ts:241](https://github.com/franciskafieh/obsidian-list-modified/blob/b7d8481/src/main.ts#L241)

___

### unload

▸ **unload**(): `void`

Unload this component and its children

#### Returns

`void`

#### Inherited from

Plugin.unload

#### Defined in

node_modules/obsidian/obsidian.d.ts:575
