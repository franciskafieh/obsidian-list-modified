# Obsidian List Modified

This plugin lists all modified files meeting certain criteria to a daily note.

Example:

Using these settings...

![plugin settings](preview/settings-preview.png)

This is the result...

![plugin demo gif](preview/obsidian-list-modified.gif)

# Why?

As of now, dataview queries cannot be "frozen" in time. There are hacky solutions using templater, but I wanted something really simple.

# How?

When a file is modified, the plugin checks if there is already a link to the modified file inside of your daily note. If so, it doesn't need to link it again. Otherwise, If this modified file meets the criteria, it appends a link to the daily note.

# Criteria supported

## Ignored tags

Disables a modified note from linking if it contains a certain tag.

These tags will be recognized if they are in the note's content (#tag anywhere in your note)

or in its frontmatter in the following formats:

```yaml
---
tags: ['#your', '#tags', '#here']

# OR

tags:
    - '#your'
    - '#tags'
    - '#here'
---
```

# Installation

1. Open your vault's folder in your file explorer
2. Make sure showing hidden files is enabled
3. Open the `.obsidian` folder, then open the `plugins` folder.
4. Create a new folder called `obsidian-list-modified`
5. Head over to the releases page and download the `manifest.json` and `main.js`
6. Add these files to the new folder you've created
7. Reload/restart Obsidian and enable the plugin in your community plugin settings

**NOTE:** You must have safe mode shut off to be able to install community plugins!

# Usage

The only things you need to configure are in the settings tab! After these are configured, the plugin should work automatically. Read the description of each setting carefully!

# Disclaimer

This plugin should not do any harm, but **you should back up just in case**. I am not responsible for any damage!
